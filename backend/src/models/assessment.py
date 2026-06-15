from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, model_validator

from backend.src.models.common import NonNegativeFloat, NonNegativeInt, RiskStatus, utc_now


class ShelfLifeAssessment(BaseModel):
    assessment_id: str = Field(min_length=1)
    shipment_id: str = Field(min_length=1)
    calculated_at: datetime = Field(default_factory=utc_now)
    remaining_shelf_life_hours: NonNegativeFloat
    risk_status: RiskStatus
    temperature_excursion_minutes: NonNegativeInt = 0
    reason_codes: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def require_reason_for_manual_follow_up(self) -> "ShelfLifeAssessment":
        if self.risk_status == RiskStatus.MANUAL_FOLLOW_UP_REQUIRED and not self.reason_codes:
            raise ValueError("manual_follow_up_required assessments require reason_codes")
        return self

