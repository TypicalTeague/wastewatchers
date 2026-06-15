from __future__ import annotations

from datetime import UTC, datetime
from enum import StrEnum
from typing import Annotated

from pydantic import Field


class DecisionState(StrEnum):
    HEALTHY = "healthy"
    WATCH = "watch"
    AT_RISK = "at_risk"
    SALVAGE_RECOMMENDED = "salvage_recommended"
    REROUTE_APPROVED = "reroute_approved"
    MANUAL_FOLLOW_UP_REQUIRED = "manual_follow_up_required"


class RiskStatus(StrEnum):
    HEALTHY = "healthy"
    WATCH = "watch"
    AT_RISK = "at_risk"
    MANUAL_FOLLOW_UP_REQUIRED = "manual_follow_up_required"


class TransitState(StrEnum):
    IN_TRANSIT = "in_transit"
    ARRIVED = "arrived"
    CANCELLED = "cancelled"


class Urgency(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RecommendationStatus(StrEnum):
    AVAILABLE = "available"
    EXPIRED = "expired"
    NOT_VIABLE = "not_viable"
    APPROVED = "approved"


class ApprovalDecision(StrEnum):
    APPROVED = "approved"
    REJECTED = "rejected"
    MANUAL_FOLLOW_UP = "manual_follow_up"


TemperatureC = Annotated[float, Field(ge=-40, le=60)]
NonNegativeFloat = Annotated[float, Field(ge=0)]
NonNegativeInt = Annotated[int, Field(ge=0)]


def utc_now() -> datetime:
    return datetime.now(UTC)

