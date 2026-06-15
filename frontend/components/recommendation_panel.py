from __future__ import annotations

from typing import Any

from backend.src.models.approval import ApprovalCreate
from frontend.services.wastewatchers_client import ClientError, WasteWatchersClient


def recommendation_summary(recommendation: dict[str, Any] | None) -> str:
    if not recommendation:
        return "Manual follow-up required: no viable recommendation is available."
    destination = recommendation.get("recommended_destination")
    if not destination:
        return recommendation.get("rationale", "Manual follow-up required.")
    return f"{recommendation.get('urgency', 'unknown').title()} reroute to {destination}: {recommendation.get('rationale', '')}"


def approve_recommendation(
    client: WasteWatchersClient,
    recommendation: dict[str, Any],
    approved_by: str,
) -> str:
    recommendation_id = recommendation.get("recommendation_id")
    if not recommendation_id:
        return "Manual follow-up required: no recommendation can be approved."
    try:
        approval = client.approve_recommendation(
            recommendation_id,
            ApprovalCreate(approved_by=approved_by),
        )
    except ClientError as exc:
        return f"Approval could not be completed: {exc}"
    return f"Reroute approved to {approval.resulting_destination}."
