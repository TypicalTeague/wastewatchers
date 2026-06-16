from __future__ import annotations

from backend.src.services.demo_service import DemoService
from backend.src.persistence.sqlite_store import SQLiteStore


def test_risk_drivers_explain_temperature_shelf_life_and_unavailable_signals():
    store = SQLiteStore(":memory:")
    try:
        service = DemoService(store)
        state = service.load_demo_scenario()
        critical = next(item for item in state.shipments if item.shipment_id == "DEMO-1004")

        driver_ids = {driver.driver_id for driver in critical.risk_drivers}
        unavailable_labels = {signal.label for signal in critical.unavailable_signals}

        assert "temperature_excursion" in driver_ids
        assert "shelf_life" in driver_ids
        assert {"Weather", "Live traffic", "GPS coordinates"} <= unavailable_labels
    finally:
        store.close()

