from __future__ import annotations

from fastapi import APIRouter, Depends

from backend.src.api.errors import not_found
from backend.src.main import get_store
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.services.shipment_service import ShipmentService

router = APIRouter(prefix="/shipments", tags=["shipments"])


@router.get("/at-risk")
def list_at_risk_shipments(
    include_watch: bool = True,
    store: SQLiteStore = Depends(get_store),
) -> list[dict]:
    return ShipmentService(store).dashboard_shipments(include_watch=include_watch)


@router.get("/{shipment_id}")
def get_shipment_detail(
    shipment_id: str,
    store: SQLiteStore = Depends(get_store),
) -> dict:
    detail = ShipmentService(store).shipment_detail(shipment_id)
    if detail is None:
        raise not_found("Shipment not found", shipment_id)
    return detail

