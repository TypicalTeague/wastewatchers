from __future__ import annotations

from backend.src.models.demo import DemoRiskLevel, PalletColor
from backend.src.models.demo import SimulationMode
from backend.src.simulation.demo_engine import apply_simulation_step
from backend.src.simulation.demo_scenarios import SCENARIO_ID, seeded_demo_shipments
from backend.src.simulation.pallet_state import degraded_pallet_color, pallet_color_for_risk


def test_pallet_color_mapping_covers_foundational_demo_states():
    assert pallet_color_for_risk(DemoRiskLevel.HEALTHY) == PalletColor.GREEN
    assert pallet_color_for_risk(DemoRiskLevel.WATCH) == PalletColor.YELLOW
    assert pallet_color_for_risk(DemoRiskLevel.AT_RISK) == PalletColor.YELLOW
    assert pallet_color_for_risk(DemoRiskLevel.CRITICAL) == PalletColor.RED
    assert degraded_pallet_color() == PalletColor.GRAY


def test_simulation_step_adds_readings_and_recalculates_shelf_life():
    shipments = seeded_demo_shipments()

    updated, step = apply_simulation_step(SCENARIO_ID, shipments, 1, SimulationMode.LIVE)

    assert step.mode == SimulationMode.LIVE
    assert step.step_number == 1
    assert len(step.generated_readings) == 4
    assert set(step.changed_shipments) == {shipment.shipment_id for shipment in shipments}
    for before, after in zip(sorted(shipments, key=lambda item: item.shipment_id), sorted(updated, key=lambda item: item.shipment_id), strict=True):
        assert after.temperature_c > before.temperature_c
        assert len(after.temperature_history) == len(before.temperature_history) + 1
        assert after.remaining_shelf_life_hours <= before.remaining_shelf_life_hours
        assert after.pallet_color == pallet_color_for_risk(after.risk_level)


def test_repeated_simulation_steps_cross_thresholds_and_refresh_recommendations():
    shipments = seeded_demo_shipments()

    for step_number in range(1, 6):
        shipments, _ = apply_simulation_step(SCENARIO_ID, shipments, step_number, SimulationMode.MANUAL)

    assert any(shipment.risk_level == DemoRiskLevel.CRITICAL for shipment in shipments)
    assert any(
        shipment.recommended_destination is not None
        for shipment in shipments
        if shipment.risk_level in {DemoRiskLevel.AT_RISK, DemoRiskLevel.CRITICAL}
    )
