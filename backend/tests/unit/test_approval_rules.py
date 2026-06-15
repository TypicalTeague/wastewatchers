from __future__ import annotations

from datetime import timedelta

import pytest

from backend.src.api.errors import AppError
from backend.src.models.approval import ApprovalCreate
from backend.src.models.common import RecommendationStatus, utc_now
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.services.recommendation_service import RecommendationService
from backend.src.services.telemetry_service import TelemetryService
from backend.src.models.telemetry import TrailerTelemetryReading
from backend.src.persistence.seed_data import seed_profiles, seed_shipments


def _store_with_recommendation() -> tuple[SQLiteStore, str]:
    store = SQLiteStore(":memory:")
    store.seed(seed_profiles(), seed_shipments())
    TelemetryService(store).ingest(
        TrailerTelemetryReading(
            shipment_id="SHIP-1001",
            trailer_id="TRL-22",
            recorded_at=utc_now() - timedelta(hours=4),
            temperature_c=12.0,
        )
    )
    recommendation = store.latest_recommendation("SHIP-1001")
    assert recommendation is not None
    return store, recommendation.recommendation_id


def test_approval_before_arrival_succeeds():
    store, recommendation_id = _store_with_recommendation()

    approval = RecommendationService(store).approve(recommendation_id, ApprovalCreate(approved_by="manager"))

    assert approval.decision == "approved"


def test_duplicate_approval_is_rejected():
    store, recommendation_id = _store_with_recommendation()
    service = RecommendationService(store)
    service.approve(recommendation_id, ApprovalCreate(approved_by="manager"))

    with pytest.raises(AppError):
        service.approve(recommendation_id, ApprovalCreate(approved_by="manager"))


def test_expired_recommendation_is_rejected():
    store, recommendation_id = _store_with_recommendation()
    recommendation = store.get_recommendation(recommendation_id)
    assert recommendation is not None
    recommendation.expires_at = utc_now() - timedelta(minutes=1)
    store.save_recommendation(recommendation)

    with pytest.raises(AppError):
        RecommendationService(store).approve(recommendation_id, ApprovalCreate(approved_by="manager"))


def test_not_viable_recommendation_is_rejected():
    store, recommendation_id = _store_with_recommendation()
    recommendation = store.get_recommendation(recommendation_id)
    assert recommendation is not None
    recommendation.status = RecommendationStatus.NOT_VIABLE
    recommendation.recommended_destination = None
    store.save_recommendation(recommendation)

    with pytest.raises(AppError):
        RecommendationService(store).approve(recommendation_id, ApprovalCreate(approved_by="manager"))

