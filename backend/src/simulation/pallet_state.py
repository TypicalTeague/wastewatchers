from __future__ import annotations

from backend.src.models.demo import DemoRiskLevel, PalletColor


def pallet_color_for_risk(risk_level: DemoRiskLevel) -> PalletColor:
    if risk_level == DemoRiskLevel.HEALTHY:
        return PalletColor.GREEN
    if risk_level in {DemoRiskLevel.WATCH, DemoRiskLevel.AT_RISK}:
        return PalletColor.YELLOW
    if risk_level == DemoRiskLevel.CRITICAL:
        return PalletColor.RED
    return PalletColor.GRAY


def degraded_pallet_color() -> PalletColor:
    return PalletColor.GRAY
