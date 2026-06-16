from __future__ import annotations


def test_dashboard_payload_contains_control_center_fields(client):
    response = client.post("/demo/scenario/load")

    assert response.status_code == 200
    body = response.json()
    assert "estimated_net_value_preserved_usd" in body["metrics"]
    shipment = next(item for item in body["shipments"] if item["risk_level"] == "critical")
    assert shipment["sensor_freshness"]
    assert shipment["risk_drivers"]
    assert shipment["response_options"]
    assert shipment["recommended_decision"]
    assert shipment["recommended_decision"]["financial_breakdown"]["estimated_net_value_preserved_usd"] >= 0
    assert shipment["unavailable_signals"]


def test_decision_endpoint_requires_confirmation(client):
    client.post("/demo/scenario/load")

    response = client.post(
        "/demo/shipments/DEMO-1004/decision",
        json={"action": "approve_reroute", "actor_label": "Site Manager"},
    )

    assert response.status_code == 422

