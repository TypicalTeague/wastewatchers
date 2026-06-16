from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from typing import Any, Annotated

from pydantic import BaseModel, Field, field_validator, model_validator

from backend.src.models.common import NonNegativeFloat, NonNegativeInt, TemperatureC, utc_now


Percent = Annotated[float, Field(ge=0, le=100)]


class DemoScenarioStatus(StrEnum):
    EMPTY = "empty"
    LOADED = "loaded"
    RUNNING = "running"
    PAUSED = "paused"
    RESET = "reset"


class DemoRiskLevel(StrEnum):
    HEALTHY = "healthy"
    WATCH = "watch"
    AT_RISK = "at_risk"
    CRITICAL = "critical"
    MANUAL_REVIEW = "manual_review"
    REROUTE_APPROVED = "reroute_approved"
    REJECTED = "rejected"


class PalletColor(StrEnum):
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"
    GRAY = "gray"


class SimulationMode(StrEnum):
    LIVE = "live"
    MANUAL = "manual"


class PresenterControl(StrEnum):
    LOAD_DEMO = "load_demo"
    START_LIVE = "start_live"
    PAUSE = "pause"
    ADVANCE_STEP = "advance_step"
    COOLING_FAILURE = "cooling_failure"
    TEMPERATURE_SPIKE = "temperature_spike"
    RESTORE_COOLING = "restore_cooling"
    TELEMETRY_OUTAGE = "telemetry_outage"
    RESET = "reset"


class ManagerDecisionAction(StrEnum):
    APPROVE_REROUTE = "approve_reroute"
    SEND_MANUAL_REVIEW = "send_manual_review"
    REJECT_SHIPMENT = "reject_shipment"


class DataProvenance(StrEnum):
    MEASURED = "measured"
    CALCULATED = "calculated"
    SIMULATED = "simulated"
    DEMO_ASSUMPTION = "demo_assumption"
    MANAGER_ENTERED = "manager_entered"
    UNAVAILABLE = "unavailable"


class DestinationType(StrEnum):
    CONTINUE_DELIVERY = "continue_delivery"
    SECONDARY_MARKET = "secondary_market"
    FOOD_PROCESSOR = "food_processor"
    COMPOST_FACILITY = "compost_facility"
    REJECT_DISPOSE = "reject_dispose"
    MANUAL_REVIEW = "manual_review"


class OptionViability(StrEnum):
    RECOMMENDED = "recommended"
    VIABLE_ALTERNATIVE = "viable_alternative"
    NOT_VIABLE = "not_viable"


class SensorStatus(StrEnum):
    FRESH = "fresh"
    STALE = "stale"
    MISSING = "missing"
    SIMULATED = "simulated"


class ConfidenceLevel(StrEnum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    MANUAL_REVIEW_REQUIRED = "manual_review_required"


class OperationalRisk(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RiskDriverSeverity(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ProvenancedValue(BaseModel):
    label: str = Field(min_length=1)
    value: str | float | int | None = None
    unit: str | None = None
    provenance: DataProvenance = DataProvenance.UNAVAILABLE
    source: str = "WasteWatchers demo"
    unavailable_reason: str | None = None


class SensorFreshness(BaseModel):
    status: SensorStatus
    latest_update_at: datetime | None = None
    age_minutes: NonNegativeInt | None = None
    provenance: DataProvenance = DataProvenance.SIMULATED
    message: str


class ConfidenceScore(BaseModel):
    level: ConfidenceLevel
    score: Percent
    reason_codes: list[str] = Field(default_factory=list)
    provenance: DataProvenance = DataProvenance.CALCULATED


class RiskDriver(BaseModel):
    driver_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    explanation: str = Field(min_length=1)
    severity: RiskDriverSeverity
    provenance: DataProvenance
    value: str | None = None


class FinancialBreakdown(BaseModel):
    original_cargo_value_usd: NonNegativeFloat
    destination_acceptance_percent: Percent
    expected_gross_recovery_usd: NonNegativeFloat
    rerouting_transportation_cost_usd: NonNegativeFloat
    sorting_handling_cost_usd: NonNegativeFloat
    processing_destination_fee_usd: NonNegativeFloat
    avoided_disposal_cost_usd: NonNegativeFloat
    expected_unrecovered_value_usd: NonNegativeFloat
    estimated_net_value_preserved_usd: NonNegativeFloat
    value_recovery_usd: NonNegativeFloat
    cost_avoidance_usd: NonNegativeFloat
    incremental_cost_usd: NonNegativeFloat
    provenance: DataProvenance = DataProvenance.CALCULATED
    input_provenance: list[ProvenancedValue] = Field(default_factory=list)
    estimate_disclaimer: str = "Estimate only; not guaranteed savings."


class DestinationAssumption(BaseModel):
    destination_type: DestinationType
    destination_name: str = Field(min_length=1)
    travel_time_minutes: NonNegativeInt
    acceptance_percent: Percent
    rerouting_transportation_cost_usd: NonNegativeFloat
    sorting_handling_cost_usd: NonNegativeFloat
    processing_destination_fee_usd: NonNegativeFloat
    avoided_disposal_cost_usd: NonNegativeFloat
    expected_condition_at_arrival: str = Field(min_length=1)
    operational_risk: OperationalRisk
    pays_for_material: bool = True
    capacity_available: bool = True
    provenance: DataProvenance = DataProvenance.DEMO_ASSUMPTION


class ResponseOption(BaseModel):
    option_id: str = Field(min_length=1)
    destination_type: DestinationType
    destination_name: str = Field(min_length=1)
    travel_time_minutes: NonNegativeInt
    expected_condition_at_arrival: str = Field(min_length=1)
    acceptance_percent: Percent
    financial_breakdown: FinancialBreakdown
    expected_waste_diversion_percent: Percent
    operational_risk: OperationalRisk
    viability: OptionViability
    viability_reason: str = Field(min_length=1)
    shelf_life_at_arrival_hours: NonNegativeFloat
    food_safety_blocked: bool = False
    assumptions: list[ProvenancedValue] = Field(default_factory=list)


class RecommendedDecision(BaseModel):
    recommendation_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    destination_type: DestinationType
    destination_name: str = Field(min_length=1)
    rationale: str = Field(min_length=1)
    deadline_at: datetime | None = None
    travel_time_minutes: NonNegativeInt
    expected_condition_at_arrival: str = Field(min_length=1)
    financial_breakdown: FinancialBreakdown
    confidence: ConfidenceScore
    expected_post_action_risk: DemoRiskLevel
    option_id: str = Field(min_length=1)
    status: DemoRiskLevel | None = None


class TimelineEvent(BaseModel):
    event_id: str = Field(min_length=1)
    occurred_at: datetime
    title: str = Field(min_length=1)
    detail: str = Field(min_length=1)
    provenance: DataProvenance = DataProvenance.SIMULATED


class TemperatureReadingPoint(BaseModel):
    recorded_at: datetime
    temperature_c: TemperatureC


class DemoScenario(BaseModel):
    scenario_id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    loaded_at: datetime = Field(default_factory=utc_now)
    status: DemoScenarioStatus = DemoScenarioStatus.EMPTY
    simulation_interval_seconds: Annotated[int, Field(ge=1, le=60)] = 5
    active_step: NonNegativeInt = 0
    message: str = ""


class DemoShipmentState(BaseModel):
    shipment_id: str = Field(min_length=1)
    trailer_id: str = Field(min_length=1)
    truck_id: str = Field(min_length=1)
    pallet_id: str = Field(min_length=1)
    pallet_position: Annotated[int, Field(ge=1, le=8)] = 1
    trailer_pallet_capacity: Annotated[int, Field(ge=1, le=8)] = 4
    commodity_abbrev: str = Field(min_length=1, max_length=12, default="CARGO")
    crop: str = Field(min_length=1)
    origin: str = Field(min_length=1)
    planned_destination: str = Field(min_length=1)
    recommended_destination: str | None = None
    risk_level: DemoRiskLevel
    pallet_color: PalletColor
    remaining_shelf_life_hours: NonNegativeFloat
    remaining_shelf_life_percent: Percent
    temperature_c: TemperatureC
    safe_temp_min_c: TemperatureC
    safe_temp_max_c: TemperatureC
    temperature_history: list[TemperatureReadingPoint] = Field(default_factory=list)
    estimated_value_usd: NonNegativeFloat
    value_protected_usd: NonNegativeFloat = 0
    time_remaining_to_act_minutes: NonNegativeInt
    confirmation_message: str = ""
    decision_deadline_at: datetime | None = None
    latest_update_at: datetime | None = None
    change_summary: str = ""
    sensor_freshness: SensorFreshness | None = None
    confidence: ConfidenceScore | None = None
    expected_shelf_life_at_arrival_hours: NonNegativeFloat | None = None
    risk_drivers: list[RiskDriver] = Field(default_factory=list)
    response_options: list[ResponseOption] = Field(default_factory=list)
    recommended_decision: RecommendedDecision | None = None
    event_timeline: list[TimelineEvent] = Field(default_factory=list)
    unavailable_signals: list[ProvenancedValue] = Field(default_factory=list)
    technical_details: list[ProvenancedValue] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_safe_band(self) -> "DemoShipmentState":
        if self.safe_temp_min_c > self.safe_temp_max_c:
            raise ValueError("safe_temp_min_c cannot exceed safe_temp_max_c")
        return self

    @field_validator("crop", "origin", "planned_destination", "recommended_destination")
    @classmethod
    def reject_obvious_real_customer_data(cls, value: str | None) -> str | None:
        if value is None:
            return value
        forbidden = ("@real", "ssn", "personal")
        if any(marker in value.lower() for marker in forbidden):
            raise ValueError("demo data must be fictional")
        return value


class DemoMetrics(BaseModel):
    active_shipments: NonNegativeInt = 0
    at_risk_shipments: NonNegativeInt = 0
    critical_shipments: NonNegativeInt = 0
    estimated_value_protected_usd: NonNegativeFloat = 0
    estimated_net_value_preserved_usd: NonNegativeFloat = 0


class DemoDashboardState(BaseModel):
    scenario_status: DemoScenarioStatus
    empty_state: bool
    metrics: DemoMetrics
    shipments: list[DemoShipmentState]
    message: str


class SimulationConfig(BaseModel):
    interval_seconds: Annotated[int, Field(ge=1, le=60)]


class SimulationStep(BaseModel):
    step_id: str = Field(min_length=1)
    scenario_id: str = Field(min_length=1)
    step_number: NonNegativeInt
    mode: SimulationMode
    created_at: datetime = Field(default_factory=utc_now)
    generated_readings: list[TemperatureReadingPoint] = Field(default_factory=list)
    changed_shipments: list[str] = Field(default_factory=list)
    message: str = ""


class PresenterControlEvent(BaseModel):
    event_id: str = Field(min_length=1)
    scenario_id: str = Field(min_length=1)
    shipment_id: str | None = None
    control: PresenterControl
    created_at: datetime = Field(default_factory=utc_now)
    prior_state: dict[str, Any] = Field(default_factory=dict)
    resulting_state: dict[str, Any] = Field(default_factory=dict)
    message: str = ""


class ManagerDecisionRequest(BaseModel):
    action: ManagerDecisionAction
    actor_label: str = Field(min_length=1)
    option_id: str | None = None
    confirmation_acknowledged: bool = False
    decision_note: str | None = None

    @model_validator(mode="after")
    def require_confirmation(self) -> "ManagerDecisionRequest":
        if not self.confirmation_acknowledged:
            raise ValueError("confirmation_acknowledged must be true for consequential decisions")
        return self


class ManagerDecisionEvent(BaseModel):
    event_id: str = Field(min_length=1)
    scenario_id: str = Field(min_length=1)
    shipment_id: str = Field(min_length=1)
    action: ManagerDecisionAction
    actor_label: str = Field(min_length=1)
    created_at: datetime = Field(default_factory=utc_now)
    prior_status: DemoRiskLevel
    resulting_status: DemoRiskLevel
    option_id: str | None = None
    destination_name: str | None = None
    estimated_net_value_preserved_usd: NonNegativeFloat | None = None
    recommendation_context: RecommendedDecision | None = None
    decision_note: str | None = None
    message: str = ""
