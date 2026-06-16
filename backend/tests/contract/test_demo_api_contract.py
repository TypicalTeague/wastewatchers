from __future__ import annotations


def test_get_demo_dashboard_empty_state_contract(client):
    response = client.get("/demo/dashboard")

    assert response.status_code == 200
    body = response.json()
    assert body["scenario_status"] == "empty"
    assert body["empty_state"] is True
    assert body["shipments"] == []
    assert {"active_shipments", "at_risk_shipments", "critical_shipments", "estimated_value_protected_usd"} <= set(
        body["metrics"]
    )


def test_load_demo_scenario_contract(client):
    response = client.post("/demo/scenario/load")

    assert response.status_code == 200
    body = response.json()
    assert body["scenario_status"] == "loaded"
    assert body["empty_state"] is False
    assert len(body["shipments"]) == 4
    assert {"healthy", "watch", "at_risk", "critical"} == {shipment["risk_level"] for shipment in body["shipments"]}
    assert {"green", "yellow", "red"} <= {shipment["pallet_color"] for shipment in body["shipments"]}


def test_reset_demo_scenario_contract(client):
    client.post("/demo/scenario/load")

    response = client.post("/demo/scenario/reset")

    assert response.status_code == 200
    body = response.json()
    assert body["scenario_status"] == "reset"
    assert body["empty_state"] is True
    assert body["shipments"] == []


def test_demo_simulation_start_pause_and_step_contract(client):
    client.post("/demo/scenario/load")

    start_response = client.post("/demo/simulation/start", json={"interval_seconds": 3})

    assert start_response.status_code == 200
    start_body = start_response.json()
    assert start_body["scenario_status"] == "running"
    assert start_body["empty_state"] is False
    assert len(start_body["shipments"]) == 4

    pause_response = client.post("/demo/simulation/pause")

    assert pause_response.status_code == 200
    assert pause_response.json()["scenario_status"] == "paused"

    step_response = client.post("/demo/simulation/step")

    assert step_response.status_code == 200
    step_body = step_response.json()
    assert step_body["scenario_status"] == "paused"
    assert any(len(shipment["temperature_history"]) >= 5 for shipment in step_body["shipments"])


def test_demo_simulation_start_validates_interval_contract(client):
    response = client.post("/demo/simulation/start", json={"interval_seconds": 0})

    assert response.status_code == 422
