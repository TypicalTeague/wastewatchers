from __future__ import annotations

from backend.src.models.demo import DemoRiskLevel, PalletColor
from backend.src.services.demo_service import build_demo_metrics
from backend.src.simulation.demo_scenarios import seeded_demo_shipments


def test_seeded_demo_scenario_is_deterministic_and_distinct():
    first = seeded_demo_shipments()
    second = seeded_demo_shipments()

    assert [shipment.shipment_id for shipment in first] == [shipment.shipment_id for shipment in second]
    assert {shipment.risk_level for shipment in first} == {
        DemoRiskLevel.HEALTHY,
        DemoRiskLevel.WATCH,
        DemoRiskLevel.AT_RISK,
        DemoRiskLevel.CRITICAL,
    }
    assert all(shipment.crop.startswith("Fictional") for shipment in first)
    assert all(shipment.temperature_history for shipment in first)
    assert {shipment.trailer_id for shipment in first} == {"TRL-DEMO-11", "TRL-DEMO-24"}
    assert all(shipment.pallet_position in {1, 2} for shipment in first)


def test_seeded_demo_scenario_maps_risk_to_expected_pallet_colors():
    shipments = seeded_demo_shipments()
    by_risk = {shipment.risk_level: shipment.pallet_color for shipment in shipments}

    assert by_risk[DemoRiskLevel.HEALTHY] == PalletColor.GREEN
    assert by_risk[DemoRiskLevel.WATCH] == PalletColor.YELLOW
    assert by_risk[DemoRiskLevel.AT_RISK] == PalletColor.YELLOW
    assert by_risk[DemoRiskLevel.CRITICAL] == PalletColor.RED


def test_demo_metrics_count_visible_operational_risk():
    metrics = build_demo_metrics(seeded_demo_shipments())

    assert metrics.active_shipments == 4
    assert metrics.at_risk_shipments == 2
    assert metrics.critical_shipments == 1
    assert metrics.estimated_value_protected_usd > 0
