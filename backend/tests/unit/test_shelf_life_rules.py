from __future__ import annotations

from datetime import timedelta

from backend.src.models.common import RiskStatus, utc_now
from backend.src.models.telemetry import TrailerTelemetryReading
from backend.src.persistence.seed_data import seed_profiles, seed_shipments
from backend.src.rules.shelf_life import calculate_shelf_life


def _reading(temp: float, hours_ago: int = 1) -> TrailerTelemetryReading:
    now = utc_now()
    return TrailerTelemetryReading(
        shipment_id="SHIP-1001",
        trailer_id="TRL-22",
        recorded_at=now - timedelta(hours=hours_ago),
        received_at=now,
        temperature_c=temp,
    )


def test_in_range_readings_keep_shipment_healthy():
    shipment = seed_shipments()[0]
    profile = seed_profiles()[0]

    assessment = calculate_shelf_life(shipment, profile, [_reading(1.0)])

    assert assessment.risk_status == RiskStatus.HEALTHY
    assert assessment.remaining_shelf_life_hours == profile.baseline_shelf_life_hours


def test_out_of_range_readings_reduce_shelf_life():
    shipment = seed_shipments()[0]
    profile = seed_profiles()[0]

    assessment = calculate_shelf_life(shipment, profile, [_reading(5.0, hours_ago=3)])

    assert assessment.risk_status in {RiskStatus.WATCH, RiskStatus.AT_RISK}
    assert assessment.remaining_shelf_life_hours < profile.baseline_shelf_life_hours


def test_severe_excursion_marks_at_risk():
    shipment = seed_shipments()[0]
    profile = seed_profiles()[0]

    assessment = calculate_shelf_life(shipment, profile, [_reading(12.0, hours_ago=4)])

    assert assessment.risk_status == RiskStatus.AT_RISK
    assert "severe_excursion" in assessment.reason_codes


def test_missing_profile_routes_to_manual_follow_up():
    shipment = seed_shipments()[0]

    assessment = calculate_shelf_life(shipment, None, [_reading(1.0)])

    assert assessment.risk_status == RiskStatus.MANUAL_FOLLOW_UP_REQUIRED
    assert "missing_profile" in assessment.reason_codes


def test_no_recent_readings_routes_to_manual_follow_up():
    shipment = seed_shipments()[0]
    profile = seed_profiles()[0]

    assessment = calculate_shelf_life(shipment, profile, [])

    assert assessment.risk_status == RiskStatus.MANUAL_FOLLOW_UP_REQUIRED
    assert "telemetry_gap" in assessment.reason_codes

