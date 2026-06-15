from __future__ import annotations

import logging

from backend.src.models.assessment import ShelfLifeAssessment
from backend.src.models.approval import RerouteRecommendation
from backend.src.models.common import DecisionState, RiskStatus, utc_now
from backend.src.models.shipment import Shipment
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.rules.shelf_life import calculate_shelf_life


class ShipmentService:
    def __init__(self, store: SQLiteStore) -> None:
        self.store = store

    def assess_shipment(self, shipment: Shipment) -> ShelfLifeAssessment:
        profile = self.store.get_profile(shipment.commodity_id)
        readings = self.store.list_readings_for_shipment(shipment.shipment_id)
        assessment = calculate_shelf_life(shipment, profile, readings)
        logging.info(
            "Generated assessment %s for shipment %s with risk %s",
            assessment.assessment_id,
            shipment.shipment_id,
            assessment.risk_status.value,
        )
        self.store.save_assessment(assessment)
        shipment.decision_state = _decision_from_risk(assessment.risk_status)
        shipment.updated_at = utc_now()
        self.store.save_shipment(shipment)
        return assessment

    def dashboard_shipments(self, include_watch: bool = True) -> list[dict]:
        rows: list[dict] = []
        for shipment in self.store.list_shipments():
            assessment = self.store.latest_assessment(shipment.shipment_id)
            recommendation = self.store.latest_recommendation(shipment.shipment_id)
            if assessment is None:
                continue
            if shipment.decision_state == DecisionState.WATCH and not include_watch:
                continue
            if shipment.decision_state not in {
                DecisionState.WATCH,
                DecisionState.AT_RISK,
                DecisionState.SALVAGE_RECOMMENDED,
                DecisionState.MANUAL_FOLLOW_UP_REQUIRED,
                DecisionState.REROUTE_APPROVED,
            }:
                continue
            rows.append(_dashboard_row(shipment, assessment, recommendation))
        return sorted(rows, key=lambda row: (row["remaining_shelf_life_hours"], row["expected_arrival_at"]))

    def shipment_detail(self, shipment_id: str) -> dict | None:
        shipment = self.store.get_shipment(shipment_id)
        assessment = self.store.latest_assessment(shipment_id)
        if shipment is None or assessment is None:
            return None
        recommendation = self.store.latest_recommendation(shipment_id)
        row = _dashboard_row(shipment, assessment, recommendation)
        row["assessment"] = assessment.model_dump(mode="json")
        row["recommendation"] = recommendation.model_dump(mode="json") if recommendation else None
        row["recovery_reason"] = ", ".join(assessment.reason_codes) if assessment.reason_codes else None
        return row


def _decision_from_risk(risk_status: RiskStatus) -> DecisionState:
    if risk_status == RiskStatus.HEALTHY:
        return DecisionState.HEALTHY
    if risk_status == RiskStatus.WATCH:
        return DecisionState.WATCH
    if risk_status == RiskStatus.AT_RISK:
        return DecisionState.AT_RISK
    return DecisionState.MANUAL_FOLLOW_UP_REQUIRED


def _dashboard_row(
    shipment: Shipment,
    assessment: ShelfLifeAssessment,
    recommendation: RerouteRecommendation | None,
) -> dict:
    profile_name = shipment.commodity_id.replace("_", " ").title()
    return {
        "shipment_id": shipment.shipment_id,
        "trailer_id": shipment.trailer_id,
        "commodity_name": profile_name,
        "decision_state": shipment.decision_state.value,
        "remaining_shelf_life_hours": assessment.remaining_shelf_life_hours,
        "urgency": recommendation.urgency.value if recommendation else "low",
        "expected_arrival_at": shipment.expected_arrival_at.isoformat(),
        "recommended_destination": recommendation.recommended_destination if recommendation else None,
    }
