from __future__ import annotations

from backend.src.models.demo import DemoRiskLevel, PalletColor
from backend.src.simulation.pallet_state import degraded_pallet_color, pallet_color_for_risk


def test_pallet_color_mapping_covers_foundational_demo_states():
    assert pallet_color_for_risk(DemoRiskLevel.HEALTHY) == PalletColor.GREEN
    assert pallet_color_for_risk(DemoRiskLevel.WATCH) == PalletColor.YELLOW
    assert pallet_color_for_risk(DemoRiskLevel.AT_RISK) == PalletColor.YELLOW
    assert pallet_color_for_risk(DemoRiskLevel.CRITICAL) == PalletColor.RED
    assert degraded_pallet_color() == PalletColor.GRAY
