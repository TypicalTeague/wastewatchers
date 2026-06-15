from __future__ import annotations

from fastapi import APIRouter, Depends

from backend.src.main import get_store
from backend.src.models.approval import ApprovalCreate, ApprovalRecord
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.post("/{recommendation_id}/approve", response_model=ApprovalRecord)
def approve_reroute_recommendation(
    recommendation_id: str,
    approval: ApprovalCreate,
    store: SQLiteStore = Depends(get_store),
) -> ApprovalRecord:
    return RecommendationService(store).approve(recommendation_id, approval)
