from __future__ import annotations

from datetime import UTC, datetime


def test_ingest_telemetry_reading_accepts_valid_payload(client):
    response = client.post(
        "/telemetry/readings",
        json={
            "shipment_id": "SHIP-1001",
            "trailer_id": "TRL-22",
            "recorded_at": datetime.now(UTC).isoformat(),
            "temperature_c": 9.5,
            "source": "contract-test",
        },
    )

    assert response.status_code == 202
    body = response.json()
    assert body["shipment_id"] == "SHIP-1001"
    assert body["reading_accepted"] is True
    assert body["decision_state"] in {"watch", "at_risk", "salvage_recommended", "manual_follow_up_required"}
    assert body["assessment"]["remaining_shelf_life_hours"] >= 0


def test_ingest_telemetry_reading_rejects_invalid_temperature(client):
    response = client.post(
        "/telemetry/readings",
        json={
            "shipment_id": "SHIP-1001",
            "trailer_id": "TRL-22",
            "recorded_at": datetime.now(UTC).isoformat(),
            "temperature_c": 100,
        },
    )

    assert response.status_code == 422

