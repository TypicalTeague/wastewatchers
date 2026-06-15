from __future__ import annotations

from datetime import UTC, datetime, timedelta


def _recommendation_id(client) -> str:
    response = client.post(
        "/telemetry/readings",
        json={
            "shipment_id": "SHIP-1001",
            "trailer_id": "TRL-22",
            "recorded_at": (datetime.now(UTC) - timedelta(hours=4)).isoformat(),
            "temperature_c": 12.0,
        },
    )
    return response.json()["recommendation"]["recommendation_id"]


def test_approve_recommendation_contract(client):
    recommendation_id = _recommendation_id(client)

    response = client.post(
        f"/recommendations/{recommendation_id}/approve",
        json={"approved_by": "manager@example.com", "decision_note": "Salvage now"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["recommendation_id"] == recommendation_id
    assert body["decision"] == "approved"


def test_approve_recommendation_not_found_contract(client):
    response = client.post("/recommendations/REC-missing/approve", json={"approved_by": "manager@example.com"})

    assert response.status_code == 404


def test_approve_recommendation_conflict_contract(client):
    recommendation_id = _recommendation_id(client)
    client.post(f"/recommendations/{recommendation_id}/approve", json={"approved_by": "manager@example.com"})

    response = client.post(f"/recommendations/{recommendation_id}/approve", json={"approved_by": "manager@example.com"})

    assert response.status_code == 409

