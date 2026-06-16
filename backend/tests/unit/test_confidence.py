from __future__ import annotations

from backend.src.rules.reroute import build_confidence_score
from backend.src.simulation.demo_scenarios import seeded_demo_shipments


def test_missing_telemetry_lowers_confidence():
    shipment = next(item for item in seeded_demo_shipments() if item.shipment_id == "DEMO-1001")
    shipment = shipment.model_copy(update={"temperature_history": []})

    confidence = build_confidence_score(shipment)

    assert confidence.score < 65
    assert "missing_temperature_history" in confidence.reason_codes
