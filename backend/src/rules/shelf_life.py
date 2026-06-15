from __future__ import annotations

from uuid import uuid4

from backend.src.models.assessment import ShelfLifeAssessment
from backend.src.models.commodity import CommodityThermalProfile
from backend.src.models.common import RiskStatus, utc_now
from backend.src.models.shipment import Shipment
from backend.src.models.telemetry import TrailerTelemetryReading


def calculate_shelf_life(
    shipment: Shipment,
    profile: CommodityThermalProfile | None,
    readings: list[TrailerTelemetryReading],
) -> ShelfLifeAssessment:
    if profile is None:
        return _manual(shipment.shipment_id, "missing_profile")
    if not readings:
        return _manual(shipment.shipment_id, "telemetry_gap")

    sorted_readings = sorted(readings, key=lambda item: item.recorded_at)
    penalty = 0.0
    excursion_minutes = 0
    reason_codes: list[str] = []

    for reading in sorted_readings:
        if profile.min_temp_c <= reading.temperature_c <= profile.max_temp_c:
            continue
        excursion_minutes += 60
        multiplier = 1.0
        if reading.temperature_c >= profile.critical_temp_c:
            multiplier = profile.critical_penalty_multiplier
            if "severe_excursion" not in reason_codes:
                reason_codes.append("severe_excursion")
        else:
            if "temperature_excursion" not in reason_codes:
                reason_codes.append("temperature_excursion")
        penalty += profile.excursion_penalty_per_hour * multiplier

    remaining = max(profile.baseline_shelf_life_hours - penalty, 0)
    risk_status = _risk_status(remaining, profile.baseline_shelf_life_hours, reason_codes)
    if not reason_codes and risk_status == RiskStatus.HEALTHY:
        reason_codes = []

    return ShelfLifeAssessment(
        assessment_id=f"ASSESS-{uuid4().hex[:12]}",
        shipment_id=shipment.shipment_id,
        calculated_at=utc_now(),
        remaining_shelf_life_hours=remaining,
        risk_status=risk_status,
        temperature_excursion_minutes=excursion_minutes,
        reason_codes=reason_codes,
    )


def _manual(shipment_id: str, reason: str) -> ShelfLifeAssessment:
    return ShelfLifeAssessment(
        assessment_id=f"ASSESS-{uuid4().hex[:12]}",
        shipment_id=shipment_id,
        calculated_at=utc_now(),
        remaining_shelf_life_hours=0,
        risk_status=RiskStatus.MANUAL_FOLLOW_UP_REQUIRED,
        reason_codes=[reason],
    )


def _risk_status(remaining: float, baseline: float, reasons: list[str]) -> RiskStatus:
    if "severe_excursion" in reasons or remaining <= baseline * 0.5:
        return RiskStatus.AT_RISK
    if reasons or remaining <= baseline * 0.8:
        return RiskStatus.WATCH
    return RiskStatus.HEALTHY

