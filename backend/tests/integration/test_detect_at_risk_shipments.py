from __future__ import annotations

from datetime import UTC, datetime, timedelta


def test_telemetry_ingestion_updates_shipment_assessment(client, store):
    response = client.post(
        "/telemetry/readings",
        json={
            "shipment_id": "SHIP-1001",
            "trailer_id": "TRL-22",
            "recorded_at": (datetime.now(UTC) - timedelta(hours=3)).isoformat(),
            "temperature_c": 11.0,
            "source": "integration-test",
        },
    )

    assert response.status_code == 202
    body = response.json()
    assert body["assessment"]["risk_status"] == "at_risk"

    shipment = store.get_shipment("SHIP-1001")
    assessment = store.latest_assessment("SHIP-1001")
    assert shipment is not None
    assert shipment.decision_state in {"at_risk", "salvage_recommended"}
    assert assessment is not None
    assert assessment.remaining_shelf_life_hours >= 0

