from __future__ import annotations

from datetime import timedelta

from backend.src.models.assessment import ShelfLifeAssessment
from backend.src.models.common import RecommendationStatus, RiskStatus, Urgency, utc_now
from backend.src.persistence.seed_data import seed_shipments
from backend.src.rules.reroute import build_recommendation


def _assessment(hours: float, status: RiskStatus = RiskStatus.AT_RISK) -> ShelfLifeAssessment:
    return ShelfLifeAssessment(
        assessment_id="ASSESS-1",
        shipment_id="SHIP-1001",
        remaining_shelf_life_hours=hours,
        risk_status=status,
        reason_codes=["severe_excursion"] if status == RiskStatus.AT_RISK else [],
    )


def test_at_risk_assessment_gets_available_recommendation():
    recommendation = build_recommendation(seed_shipments()[0], _assessment(24))

    assert recommendation.status == RecommendationStatus.AVAILABLE
    assert recommendation.urgency == Urgency.HIGH
    assert recommendation.recommended_destination is not None


def test_low_remaining_shelf_life_is_critical():
    recommendation = build_recommendation(seed_shipments()[0], _assessment(4))

    assert recommendation.urgency == Urgency.CRITICAL


def test_healthy_assessment_is_not_viable():
    recommendation = build_recommendation(seed_shipments()[0], _assessment(96, RiskStatus.HEALTHY))

    assert recommendation.status == RecommendationStatus.NOT_VIABLE
    assert recommendation.recommended_destination is None


def test_arrived_shipment_is_not_viable():
    shipment = seed_shipments()[0]
    shipment.expected_arrival_at = utc_now() - timedelta(minutes=1)

    recommendation = build_recommendation(shipment, _assessment(24))

    assert recommendation.status == RecommendationStatus.NOT_VIABLE

