from __future__ import annotations

from datetime import UTC, datetime, timedelta


def test_approving_reroute_records_state(client, store):
    ingest = client.post(
        "/telemetry/readings",
        json={
            "shipment_id": "SHIP-1001",
            "trailer_id": "TRL-22",
            "recorded_at": (datetime.now(UTC) - timedelta(hours=4)).isoformat(),
            "temperature_c": 12.0,
        },
    )
    recommendation_id = ingest.json()["recommendation"]["recommendation_id"]

    response = client.post(
        f"/recommendations/{recommendation_id}/approve",
        json={"approved_by": "manager@example.com"},
    )

    assert response.status_code == 200
    shipment = store.get_shipment("SHIP-1001")
    approval = store.get_approval_for_recommendation(recommendation_id)
    assert shipment is not None
    assert shipment.decision_state == "reroute_approved"
    assert approval is not None
    assert approval.resulting_destination is not None

