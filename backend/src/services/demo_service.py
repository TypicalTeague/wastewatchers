from __future__ import annotations

from backend.src.models.demo import (
    DemoDashboardState,
    DemoMetrics,
    DemoRiskLevel,
    DemoScenario,
    DemoScenarioStatus,
    DemoShipmentState,
)
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.simulation.demo_engine import order_shipments_by_risk
from backend.src.simulation.demo_scenarios import SCENARIO_ID, SCENARIO_NAME, seeded_demo_shipments


EMPTY_MESSAGE = "No demo scenario is loaded. Load Demo Scenario to populate the control center."


class DemoService:
    def __init__(self, store: SQLiteStore) -> None:
        self.store = store

    def get_dashboard_state(self) -> DemoDashboardState:
        scenario = self.store.get_demo_scenario(SCENARIO_ID)
        shipments = self.store.list_demo_shipments(SCENARIO_ID)
        if scenario is None or not shipments:
            return DemoDashboardState(
                scenario_status=DemoScenarioStatus.EMPTY,
                empty_state=True,
                metrics=DemoMetrics(),
                shipments=[],
                message=EMPTY_MESSAGE,
            )
        return DemoDashboardState(
            scenario_status=scenario.status,
            empty_state=False,
            metrics=build_demo_metrics(shipments),
            shipments=order_shipments_by_risk(shipments),
            message=scenario.message,
        )

    def load_demo_scenario(self) -> DemoDashboardState:
        self.store.clear_demo_state(SCENARIO_ID)
        scenario = DemoScenario(
            scenario_id=SCENARIO_ID,
            name=SCENARIO_NAME,
            status=DemoScenarioStatus.LOADED,
            message="Loaded four-shipment WasteWatchers demo scenario.",
        )
        self.store.save_demo_scenario(scenario)
        for shipment in seeded_demo_shipments():
            self.store.save_demo_shipment(SCENARIO_ID, shipment)
        return self.get_dashboard_state()

    def reset_demo_scenario(self) -> DemoDashboardState:
        self.store.clear_demo_state(SCENARIO_ID)
        return DemoDashboardState(
            scenario_status=DemoScenarioStatus.RESET,
            empty_state=True,
            metrics=DemoMetrics(),
            shipments=[],
            message="Demo scenario reset. Load Demo Scenario to start again.",
        )


def build_demo_metrics(shipments: list[DemoShipmentState]) -> DemoMetrics:
    at_risk_levels = {DemoRiskLevel.AT_RISK, DemoRiskLevel.CRITICAL}
    return DemoMetrics(
        active_shipments=len(shipments),
        at_risk_shipments=sum(1 for shipment in shipments if shipment.risk_level in at_risk_levels),
        critical_shipments=sum(1 for shipment in shipments if shipment.risk_level == DemoRiskLevel.CRITICAL),
        estimated_value_protected_usd=sum(shipment.value_protected_usd for shipment in shipments),
    )
