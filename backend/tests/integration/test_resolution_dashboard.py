from __future__ import annotations

from datetime import UTC, datetime, timedelta


def test_dashboard_orders_urgent_shipments_first(client):
    client.post(
        "/telemetry/readings",
        json={
            "shipment_id": "SHIP-1002",
            "trailer_id": "TRL-41",
            "recorded_at": (datetime.now(UTC) - timedelta(hours=2)).isoformat(),
            "temperature_c": 5.0,
        },
    )
    client.post(
        "/telemetry/readings",
        json={
            "shipment_id": "SHIP-1001",
            "trailer_id": "TRL-22",
            "recorded_at": (datetime.now(UTC) - timedelta(hours=5)).isoformat(),
            "temperature_c": 12.0,
        },
    )

    response = client.get("/shipments/at-risk")

    assert response.status_code == 200
    body = response.json()
    assert body[0]["urgency"] in {"critical", "high"}
    assert body[0]["remaining_shelf_life_hours"] <= body[-1]["remaining_shelf_life_hours"]

