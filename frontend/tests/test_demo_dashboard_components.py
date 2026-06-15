from __future__ import annotations

from backend.src.models.demo import DemoDashboardState, DemoMetrics, DemoScenarioStatus
from backend.src.simulation.demo_scenarios import seeded_demo_shipments
from frontend.components.control_center import empty_state_message, metric_cards, shipment_card_rows
from frontend.components.demo_controls import load_button_label
from frontend.components.pallet_visualization import pallet_badge, pallet_summary


def test_demo_empty_state_has_load_action_copy():
    state = DemoDashboardState(
        scenario_status=DemoScenarioStatus.EMPTY,
        empty_state=True,
        metrics=DemoMetrics(),
        shipments=[],
        message="Load Demo Scenario to populate the control center.",
    )

    assert "Load Demo Scenario" in empty_state_message(state)
    assert load_button_label(state) == "Load Demo Scenario"


def test_demo_metric_cards_and_shipment_rows_show_loaded_scenario_details():
    shipments = seeded_demo_shipments()
    cards = metric_cards(
        DemoMetrics(
            active_shipments=4,
            at_risk_shipments=2,
            critical_shipments=1,
            estimated_value_protected_usd=173200,
        )
    )
    rows = shipment_card_rows(shipments)

    assert ("Active shipments", "4") in cards
    assert ("Value protected", "$173,200") in cards
    assert len(rows) == 4
    assert {"Shipment", "Truck", "Trailer", "Pallet", "Crop", "Risk", "Shelf Life", "Temperature", "Destination"} <= set(
        rows[0]
    )


def test_pallet_visualization_helpers_are_visual_only():
    shipment = seeded_demo_shipments()[0]

    assert shipment.pallet_id in pallet_summary(shipment)
    assert pallet_badge(shipment)["color"] == shipment.pallet_color.value
