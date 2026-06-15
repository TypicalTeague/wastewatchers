from __future__ import annotations

from fastapi import APIRouter, Depends, status

from backend.src.main import get_store
from backend.src.models.telemetry import TelemetryIngestResult, TrailerTelemetryReading
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.services.telemetry_service import TelemetryService

router = APIRouter(prefix="/telemetry", tags=["telemetry"])


@router.post("/readings", response_model=TelemetryIngestResult, status_code=status.HTTP_202_ACCEPTED)
def ingest_telemetry_reading(
    reading: TrailerTelemetryReading,
    store: SQLiteStore = Depends(get_store),
) -> TelemetryIngestResult:
    return TelemetryService(store).ingest(reading)

