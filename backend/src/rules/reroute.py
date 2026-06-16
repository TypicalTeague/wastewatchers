from __future__ import annotations

from datetime import timedelta
from uuid import uuid4

from backend.src.config.destination_assumptions import destination_assumptions
from backend.src.models.approval import RerouteRecommendation
from backend.src.models.assessment import ShelfLifeAssessment
from backend.src.models.common import RecommendationStatus, RiskStatus, Urgency, utc_now
from backend.src.models.demo import (
    ConfidenceLevel,
    ConfidenceScore,
    DataProvenance,
    DemoRiskLevel,
    DemoShipmentState,
    DestinationType,
    OptionViability,
    ProvenancedValue,
    ResponseOption,
    SensorStatus,
)
from backend.src.models.shipment import Shipment
from backend.src.services.financial_service import FinancialService


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


def build_confidence_score(shipment: DemoShipmentState) -> ConfidenceScore:
    reason_codes: list[str] = []
    score = 88.0
    if not shipment.temperature_history:
        score -= 35.0
        reason_codes.append("missing_temperature_history")
    if shipment.sensor_freshness and shipment.sensor_freshness.status == SensorStatus.STALE:
        score -= 25.0
        reason_codes.append("stale_telemetry")
    if shipment.remaining_shelf_life_hours <= 8:
        score -= 10.0
        reason_codes.append("narrow_decision_window")
    if shipment.risk_level == DemoRiskLevel.MANUAL_REVIEW:
        score -= 30.0
        reason_codes.append("manual_review_state")

    bounded = max(0.0, min(100.0, score))
    if bounded < 45:
        level = ConfidenceLevel.MANUAL_REVIEW_REQUIRED
    elif bounded < 65:
        level = ConfidenceLevel.LOW
    elif bounded < 82:
        level = ConfidenceLevel.MEDIUM
    else:
        level = ConfidenceLevel.HIGH
    if not reason_codes:
        reason_codes.append("simulated_inputs_consistent")
    return ConfidenceScore(level=level, score=round(bounded, 1), reason_codes=reason_codes)


def build_demo_response_options(shipment: DemoShipmentState) -> list[ResponseOption]:
    confidence = shipment.confidence or build_confidence_score(shipment)
    financials = FinancialService()
    options: list[ResponseOption] = []

    for assumption in destination_assumptions():
        shelf_life_at_arrival = max(
            shipment.remaining_shelf_life_hours - (assumption.travel_time_minutes / 60),
            0.0,
        )
        acceptance = _adjusted_acceptance(shipment, assumption.destination_type)
        breakdown = financials.calculate_for_destination(
            original_cargo_value_usd=shipment.estimated_value_usd,
            adjusted_acceptance_percent=acceptance,
            assumption=assumption,
        )
        viability, reason = _option_viability(
            shipment=shipment,
            destination_type=assumption.destination_type,
            shelf_life_at_arrival=shelf_life_at_arrival,
            confidence=confidence,
        )
        assumptions = [
            ProvenancedValue(
                label="Destination acceptance",
                value=acceptance,
                unit="percent",
                provenance=DataProvenance.DEMO_ASSUMPTION,
            ),
            ProvenancedValue(
                label="Route time",
                value=assumption.travel_time_minutes,
                unit="minutes",
                provenance=DataProvenance.DEMO_ASSUMPTION,
            ),
            ProvenancedValue(
                label="Capacity",
                value="Available" if assumption.capacity_available else "Unavailable",
                provenance=DataProvenance.DEMO_ASSUMPTION,
            ),
        ]
        options.append(
            ResponseOption(
                option_id=f"{shipment.shipment_id}:{assumption.destination_type.value}",
                destination_type=assumption.destination_type,
                destination_name=assumption.destination_name
                if assumption.destination_type != DestinationType.CONTINUE_DELIVERY
                else shipment.planned_destination,
                travel_time_minutes=assumption.travel_time_minutes,
                expected_condition_at_arrival=assumption.expected_condition_at_arrival,
                acceptance_percent=acceptance,
                financial_breakdown=breakdown,
                expected_waste_diversion_percent=_waste_diversion(assumption.destination_type, acceptance),
                operational_risk=assumption.operational_risk,
                viability=viability,
                viability_reason=reason,
                shelf_life_at_arrival_hours=round(shelf_life_at_arrival, 1),
                food_safety_blocked=_food_safety_blocked(shipment, assumption.destination_type),
                assumptions=assumptions,
            )
        )

    recommended = select_recommended_option(options)
    if recommended is None:
        return options
    return [
        option.model_copy(update={"viability": OptionViability.RECOMMENDED})
        if option.option_id == recommended.option_id
        else option
        for option in options
    ]


def select_recommended_option(options: list[ResponseOption]) -> ResponseOption | None:
    eligible = [
        option
        for option in options
        if option.viability != OptionViability.NOT_VIABLE
        and option.destination_type
        not in {DestinationType.MANUAL_REVIEW, DestinationType.REJECT_DISPOSE}
        and not option.food_safety_blocked
    ]
    if not eligible:
        return next(
            (option for option in options if option.destination_type == DestinationType.MANUAL_REVIEW),
            None,
        )
    return max(
        eligible,
        key=lambda option: (
            option.financial_breakdown.estimated_net_value_preserved_usd,
            option.shelf_life_at_arrival_hours,
            -option.travel_time_minutes,
        ),
    )


def _adjusted_acceptance(shipment: DemoShipmentState, destination_type: DestinationType) -> float:
    base_by_type = {
        DestinationType.CONTINUE_DELIVERY: 82.0,
        DestinationType.SECONDARY_MARKET: 68.0,
        DestinationType.FOOD_PROCESSOR: 52.0,
        DestinationType.COMPOST_FACILITY: 100.0,
        DestinationType.REJECT_DISPOSE: 0.0,
        DestinationType.MANUAL_REVIEW: 0.0,
    }
    base = base_by_type[destination_type]
    if destination_type in {DestinationType.COMPOST_FACILITY, DestinationType.REJECT_DISPOSE, DestinationType.MANUAL_REVIEW}:
        return base
    shelf_life_penalty = max(0.0, 50.0 - shipment.remaining_shelf_life_percent) * 0.55
    temperature_penalty = max(0.0, shipment.temperature_c - shipment.safe_temp_max_c) * 2.4
    return round(max(0.0, min(100.0, base - shelf_life_penalty - temperature_penalty)), 1)


def _option_viability(
    *,
    shipment: DemoShipmentState,
    destination_type: DestinationType,
    shelf_life_at_arrival: float,
    confidence: ConfidenceScore,
) -> tuple[OptionViability, str]:
    if destination_type == DestinationType.MANUAL_REVIEW:
        if confidence.level in {ConfidenceLevel.LOW, ConfidenceLevel.MANUAL_REVIEW_REQUIRED}:
            return OptionViability.VIABLE_ALTERNATIVE, "Confidence is too low for automatic recommendation."
        return OptionViability.VIABLE_ALTERNATIVE, "Available if the manager wants a human check."
    if destination_type == DestinationType.REJECT_DISPOSE:
        return OptionViability.VIABLE_ALTERNATIVE, "Fallback when no safe recovery path remains."
    if _food_safety_blocked(shipment, destination_type):
        return OptionViability.NOT_VIABLE, "Food safety restriction takes priority over recovery value."
    if shelf_life_at_arrival <= 0:
        return OptionViability.NOT_VIABLE, "Arrival would occur after usable shelf life expires."
    return OptionViability.VIABLE_ALTERNATIVE, "Operationally viable under demo assumptions."


def _food_safety_blocked(shipment: DemoShipmentState, destination_type: DestinationType) -> bool:
    if destination_type in {DestinationType.COMPOST_FACILITY, DestinationType.REJECT_DISPOSE, DestinationType.MANUAL_REVIEW}:
        return False
    return shipment.temperature_c >= shipment.safe_temp_max_c + 12 and shipment.remaining_shelf_life_percent <= 8


def _waste_diversion(destination_type: DestinationType, acceptance: float) -> float:
    if destination_type == DestinationType.REJECT_DISPOSE:
        return 0.0
    if destination_type == DestinationType.MANUAL_REVIEW:
        return 0.0
    if destination_type == DestinationType.COMPOST_FACILITY:
        return 100.0
    return round(acceptance, 1)
