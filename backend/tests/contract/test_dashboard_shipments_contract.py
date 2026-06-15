from __future__ import annotations

from datetime import UTC, datetime, timedelta


def _create_at_risk(client) -> None:
    client.post(
        "/telemetry/readings",
        json={
            "shipment_id": "SHIP-1001",
            "trailer_id": "TRL-22",
            "recorded_at": (datetime.now(UTC) - timedelta(hours=3)).isoformat(),
            "temperature_c": 11.0,
        },
    )


def test_list_at_risk_shipments_contract(client):
    _create_at_risk(client)

    response = client.get("/shipments/at-risk")

    assert response.status_code == 200
    body = response.json()
    assert body
    assert {"shipment_id", "trailer_id", "commodity_name", "decision_state", "urgency"} <= set(body[0])


def test_get_shipment_detail_contract(client):
    _create_at_risk(client)

    response = client.get("/shipments/SHIP-1001")

    assert response.status_code == 200
    body = response.json()
    assert body["shipment_id"] == "SHIP-1001"
    assert "assessment" in body
    assert "recommendation" in body

