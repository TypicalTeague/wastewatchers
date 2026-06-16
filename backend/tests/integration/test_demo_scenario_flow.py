from __future__ import annotations


def test_demo_scenario_loads_four_realistic_shipments_and_resets(client):
    empty_response = client.get("/demo/dashboard")
    assert empty_response.json()["empty_state"] is True

    load_response = client.post("/demo/scenario/load")
    assert load_response.status_code == 200
    state = load_response.json()

    assert state["metrics"]["active_shipments"] == 4
    assert state["metrics"]["at_risk_shipments"] == 2
    assert state["metrics"]["critical_shipments"] == 1
    assert state["metrics"]["estimated_value_protected_usd"] > 0

    shipments = state["shipments"]
    assert {shipment["risk_level"] for shipment in shipments} == {"healthy", "watch", "at_risk", "critical"}
    for shipment in shipments:
        assert shipment["truck_id"]
        assert shipment["trailer_id"]
        assert shipment["pallet_id"]
        assert shipment["pallet_position"] in {1, 2}
        assert shipment["trailer_pallet_capacity"] == 4
        assert shipment["commodity_abbrev"]
        assert shipment["crop"].startswith("Fictional")
        assert shipment["origin"]
        assert shipment["planned_destination"]
        assert shipment["remaining_shelf_life_hours"] >= 0
        assert 0 <= shipment["remaining_shelf_life_percent"] <= 100
        assert shipment["estimated_value_usd"] > 0
        assert len(shipment["temperature_history"]) >= 3

    reset_response = client.post("/demo/scenario/reset")
    reset_state = reset_response.json()
    assert reset_state["empty_state"] is True
    assert reset_state["shipments"] == []
