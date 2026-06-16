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


class ManagerDecisionEvent(BaseModel):
    event_id: str = Field(min_length=1)
    scenario_id: str = Field(min_length=1)
    shipment_id: str = Field(min_length=1)
    action: ManagerDecisionAction
    actor_label: str = Field(min_length=1)
    created_at: datetime = Field(default_factory=utc_now)
    prior_status: DemoRiskLevel
    resulting_status: DemoRiskLevel
    message: str = ""
