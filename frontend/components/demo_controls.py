from __future__ import annotations

from backend.src.models.demo import DemoDashboardState, DemoScenarioStatus


def load_button_label(state: DemoDashboardState) -> str:
    return "Reload Demo Scenario" if not state.empty_state else "Load Demo Scenario"


def confirmation_message(state: DemoDashboardState) -> str | None:
    return state.message or None


def simulation_mode_label(state: DemoDashboardState) -> str:
    if state.scenario_status == DemoScenarioStatus.RUNNING:
        return "Live simulation running"
    if state.scenario_status == DemoScenarioStatus.PAUSED:
        return "Simulation paused"
    return "Simulation ready"
