from __future__ import annotations


def test_manager_decision_approval_updates_status_and_audit_summary(client):
    state = client.post("/demo/scenario/load").json()
    shipment = next(item for item in state["shipments"] if item["shipment_id"] == "DEMO-1004")

    response = client.post(
        "/demo/shipments/DEMO-1004/decision",
        json={
            "action": "approve_reroute",
            "actor_label": "Site Manager",
            "option_id": shipment["recommended_decision"]["option_id"],
            "confirmation_acknowledged": True,
        },
    )

    assert response.status_code == 200
    updated = next(item for item in response.json()["shipments"] if item["shipment_id"] == "DEMO-1004")
    assert updated["risk_level"] == "reroute_approved"
    assert "approved" in updated["confirmation_message"]


def test_approved_recommendation_stays_suppressed_after_simulation(client):
    state = client.post("/demo/scenario/load").json()
    shipment = next(item for item in state["shipments"] if item["shipment_id"] == "DEMO-1004")
    client.post(
        "/demo/shipments/DEMO-1004/decision",
        json={
            "action": "approve_reroute",
            "actor_label": "Site Manager",
            "option_id": shipment["recommended_decision"]["option_id"],
            "confirmation_acknowledged": True,
        },
    )

    stepped = client.post("/demo/simulation/step").json()
    updated = next(item for item in stepped["shipments"] if item["shipment_id"] == "DEMO-1004")

    assert updated["risk_level"] == "reroute_approved"
    assert updated["recommended_decision"]["destination_name"] == shipment["recommended_decision"]["destination_name"]

