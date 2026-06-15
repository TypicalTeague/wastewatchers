from __future__ import annotations

from datetime import timedelta
from uuid import uuid4

from backend.src.models.approval import RerouteRecommendation
from backend.src.models.assessment import ShelfLifeAssessment
from backend.src.models.common import RecommendationStatus, RiskStatus, Urgency, utc_now
from backend.src.models.shipment import Shipment


def build_recommendation(shipment: Shipment, assessment: ShelfLifeAssessment) -> RerouteRecommendation:
    now = utc_now()
    if assessment.risk_status not in {RiskStatus.AT_RISK, RiskStatus.MANUAL_FOLLOW_UP_REQUIRED}:
        return _not_viable(shipment, assessment, "Shipment is not at risk.")
    if shipment.expected_arrival_at <= now:
        return _not_viable(shipment, assessment, "Shipment has already reached or passed expected arrival.")
    if assessment.risk_status == RiskStatus.MANUAL_FOLLOW_UP_REQUIRED:
        return _not_viable(shipment, assessment, "Manual follow-up is required before rerouting.")

    urgency = _urgency(assessment.remaining_shelf_life_hours, assessment.reason_codes)
    destination = _destination_for(shipment)
    return RerouteRecommendation(
        recommendation_id=f"REC-{uuid4().hex[:12]}",
        shipment_id=shipment.shipment_id,
        assessment_id=assessment.assessment_id,
        recommended_destination=destination,
        urgency=urgency,
        expires_at=min(shipment.expected_arrival_at, now + timedelta(hours=max(1, assessment.remaining_shelf_life_hours / 2))),
        status=RecommendationStatus.AVAILABLE,
        rationale=f"Reroute {shipment.commodity_id} load to {destination} while {assessment.remaining_shelf_life_hours:.1f} shelf-life hours remain.",
    )


def _not_viable(shipment: Shipment, assessment: ShelfLifeAssessment, rationale: str) -> RerouteRecommendation:
    return RerouteRecommendation(
        recommendation_id=f"REC-{uuid4().hex[:12]}",
        shipment_id=shipment.shipment_id,
        assessment_id=assessment.assessment_id,
        recommended_destination=None,
        urgency=Urgency.LOW,
        expires_at=utc_now(),
        status=RecommendationStatus.NOT_VIABLE,
        rationale=rationale,
    )


def _urgency(remaining_hours: float, reason_codes: list[str]) -> Urgency:
    if remaining_hours <= 8:
        return Urgency.CRITICAL
    if "severe_excursion" in reason_codes:
        return Urgency.HIGH
    if remaining_hours <= 24:
        return Urgency.HIGH
    if remaining_hours <= 48:
        return Urgency.MEDIUM
    return Urgency.LOW


def _destination_for(shipment: Shipment) -> str:
    return f"{shipment.planned_destination} Salvage Dock"
