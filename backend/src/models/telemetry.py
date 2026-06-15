from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, model_validator

from backend.src.models.assessment import ShelfLifeAssessment
from backend.src.models.approval import RerouteRecommendation
from backend.src.models.common import DecisionState, TemperatureC, utc_now


class TrailerTelemetryReading(BaseModel):
    reading_id: str | None = None
    shipment_id: str = Field(min_length=1)
    trailer_id: str = Field(min_length=1)
    recorded_at: datetime
    received_at: datetime = Field(default_factory=utc_now)
    temperature_c: TemperatureC
    source: str = "telemetry_provider"

    @model_validator(mode="after")
    def validate_recorded_before_received(self) -> "TrailerTelemetryReading":
        if self.recorded_at > self.received_at:
            raise ValueError("recorded_at must not be after received_at")
        if self.reading_id is None:
            self.reading_id = f"{self.shipment_id}:{self.trailer_id}:{self.recorded_at.isoformat()}"
        return self


class TelemetryIngestResult(BaseModel):
    shipment_id: str
    reading_accepted: bool
    decision_state: DecisionState
    assessment: ShelfLifeAssessment
    recommendation: RerouteRecommendation | None = None

