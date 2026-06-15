from __future__ import annotations

from backend.src.models.demo import DemoDashboardState


def load_button_label(state: DemoDashboardState) -> str:
    return "Reload Demo Scenario" if not state.empty_state else "Load Demo Scenario"


def confirmation_message(state: DemoDashboardState) -> str | None:
    return state.message or None
