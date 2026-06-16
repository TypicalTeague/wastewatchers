from __future__ import annotations

from backend.src.simulation.demo_scenarios import SCENARIO_ID


def test_live_simulation_updates_state_and_manual_step_fallback(client, store):
    loaded = client.post("/demo/scenario/load").json()
    original_by_id = {shipment["shipment_id"]: shipment for shipment in loaded["shipments"]}

    started = client.post("/demo/simulation/start", json={"interval_seconds": 3}).json()

    assert started["scenario_status"] == "running"
    assert "3 seconds" in started["message"]
    started_by_id = {shipment["shipment_id"]: shipment for shipment in started["shipments"]}
    assert any(
        started_by_id[shipment_id]["temperature_c"] > original["temperature_c"]
        for shipment_id, original in original_by_id.items()
    )
    assert all(len(shipment["temperature_history"]) == 4 for shipment in started["shipments"])

    scenario = store.get_demo_scenario(SCENARIO_ID)
    assert scenario is not None
    assert scenario.simulation_interval_seconds == 3
    assert scenario.active_step == 1
    steps = store.list_demo_simulation_steps(SCENARIO_ID)
    assert len(steps) == 1
    assert steps[0].mode == "live"
    assert steps[0].generated_readings

    paused = client.post("/demo/simulation/pause").json()
    assert paused["scenario_status"] == "paused"

    manual = client.post("/demo/simulation/step").json()
    assert manual["scenario_status"] == "paused"
    assert all(len(shipment["temperature_history"]) == 5 for shipment in manual["shipments"])
    assert store.get_demo_scenario(SCENARIO_ID).active_step == 2
    assert [step.mode for step in store.list_demo_simulation_steps(SCENARIO_ID)] == ["live", "manual"]


def test_repeated_simulation_steps_refresh_risk_and_recommendations(client):
    client.post("/demo/scenario/load")
    client.post("/demo/simulation/start", json={"interval_seconds": 2})

    state = None
    for _ in range(4):
        state = client.post("/demo/simulation/step").json()

    assert state is not None
    shipments = state["shipments"]
    assert any(shipment["risk_level"] == "critical" for shipment in shipments)
    assert any(shipment["recommended_destination"] for shipment in shipments if shipment["risk_level"] in {"at_risk", "critical"})
    assert any(shipment["remaining_shelf_life_percent"] < 40 for shipment in shipments)
