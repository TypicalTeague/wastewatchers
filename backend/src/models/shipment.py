from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, model_validator

from backend.src.models.common import DecisionState, TransitState, utc_now


class Shipment(BaseModel):
    shipment_id: str = Field(min_length=1)
    trailer_id: str = Field(min_length=1)
    commodity_id: str = Field(min_length=1)
    origin: str = Field(min_length=1)
    planned_destination: str = Field(min_length=1)
    current_destination: str | None = None
    transit_state: TransitState = TransitState.IN_TRANSIT
    decision_state: DecisionState = DecisionState.HEALTHY
    expected_arrival_at: datetime
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

    @model_validator(mode="after")
    def default_current_destination(self) -> "Shipment":
        if self.current_destination is None:
            self.current_destination = self.planned_destination
        return self

