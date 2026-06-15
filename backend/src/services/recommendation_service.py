from __future__ import annotations

import logging
from uuid import uuid4

from backend.src.api.errors import conflict, not_found
from backend.src.models.approval import ApprovalCreate, ApprovalRecord, RerouteRecommendation
from backend.src.models.common import ApprovalDecision, DecisionState, RecommendationStatus, utc_now
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.rules.reroute import build_recommendation


class RecommendationService:
    def __init__(self, store: SQLiteStore) -> None:
        self.store = store

    def generate_for_assessment(self, shipment_id: str, assessment_id: str) -> RerouteRecommendation | None:
        shipment = self.store.get_shipment(shipment_id)
        assessment = self.store.latest_assessment(shipment_id)
        if shipment is None or assessment is None or assessment.assessment_id != assessment_id:
            return None
        recommendation = build_recommendation(shipment, assessment)
        logging.info(
            "Generated recommendation %s for shipment %s with status %s",
            recommendation.recommendation_id,
            shipment_id,
            recommendation.status.value,
        )
        self.store.save_recommendation(recommendation)
        if recommendation.status == RecommendationStatus.AVAILABLE:
            shipment.decision_state = DecisionState.SALVAGE_RECOMMENDED
            shipment.updated_at = utc_now()
            self.store.save_shipment(shipment)
        return recommendation

    def approve(self, recommendation_id: str, approval: ApprovalCreate) -> ApprovalRecord:
        recommendation = self.store.get_recommendation(recommendation_id)
        if recommendation is None:
            raise not_found("Recommendation not found", recommendation_id)
        if self.store.get_approval_for_recommendation(recommendation_id) is not None:
            raise conflict("Recommendation has already been approved", recommendation_id)
        if recommendation.status != RecommendationStatus.AVAILABLE:
            raise conflict("Recommendation is not available for approval", recommendation.status.value)
        if recommendation.expires_at <= utc_now():
            raise conflict("Recommendation has expired", recommendation_id)
        if not recommendation.recommended_destination:
            raise conflict("Recommendation has no resulting destination", recommendation_id)

        record = ApprovalRecord(
            approval_id=f"APPROVAL-{uuid4().hex[:12]}",
            recommendation_id=recommendation.recommendation_id,
            shipment_id=recommendation.shipment_id,
            approved_by=approval.approved_by,
            approved_at=utc_now(),
            decision=ApprovalDecision.APPROVED,
            resulting_destination=recommendation.recommended_destination,
            decision_note=approval.decision_note,
        )
        self.store.save_approval(record)
        logging.info("Approved recommendation %s for shipment %s", recommendation_id, record.shipment_id)
        recommendation.status = RecommendationStatus.APPROVED
        self.store.save_recommendation(recommendation)

        shipment = self.store.get_shipment(recommendation.shipment_id)
        if shipment is not None:
            shipment.decision_state = DecisionState.REROUTE_APPROVED
            shipment.current_destination = recommendation.recommended_destination
            shipment.updated_at = utc_now()
            self.store.save_shipment(shipment)
        return record
