from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, model_validator

from backend.src.models.common import ApprovalDecision, RecommendationStatus, Urgency, utc_now


class RerouteRecommendation(BaseModel):
    recommendation_id: str = Field(min_length=1)
    shipment_id: str = Field(min_length=1)
    assessment_id: str = Field(min_length=1)
    recommended_destination: str | None = None
    urgency: Urgency
    expires_at: datetime
    status: RecommendationStatus
    rationale: str = Field(min_length=1)

    @model_validator(mode="after")
    def require_destination_when_actionable(self) -> "RerouteRecommendation":
        if self.status in {RecommendationStatus.AVAILABLE, RecommendationStatus.APPROVED} and not self.recommended_destination:
            raise ValueError("recommended_destination is required for available or approved recommendations")
        return self


class ApprovalCreate(BaseModel):
    approved_by: str = Field(min_length=1)
    decision_note: str | None = Field(default=None, max_length=500)


class ApprovalRecord(BaseModel):
    approval_id: str = Field(min_length=1)
    recommendation_id: str = Field(min_length=1)
    shipment_id: str = Field(min_length=1)
    approved_by: str = Field(min_length=1)
    approved_at: datetime = Field(default_factory=utc_now)
    decision: ApprovalDecision
    resulting_destination: str | None = None
    decision_note: str | None = None

    @model_validator(mode="after")
    def require_destination_for_approval(self) -> "ApprovalRecord":
        if self.decision == ApprovalDecision.APPROVED and not self.resulting_destination:
            raise ValueError("resulting_destination is required for approved reroutes")
        return self

