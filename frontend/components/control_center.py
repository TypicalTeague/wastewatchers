from __future__ import annotations

from backend.src.models.demo import DemoDashboardState, DemoMetrics, DemoShipmentState


def empty_state_message(state: DemoDashboardState) -> str | None:
    if not state.empty_state:
        return None
    return state.message or "Load Demo Scenario to populate the control center."


def metric_cards(metrics: DemoMetrics) -> list[tuple[str, str]]:
    return [
        ("Active shipments", str(metrics.active_shipments)),
        ("At-risk shipments", str(metrics.at_risk_shipments)),
        ("Critical shipments", str(metrics.critical_shipments)),
        ("Value protected", f"${metrics.estimated_value_protected_usd:,.0f}"),
    ]


def shipment_card_rows(shipments: list[DemoShipmentState]) -> list[dict[str, object]]:
    return [
        {
            "Shipment": shipment.shipment_id,
            "Truck": shipment.truck_id,
            "Trailer": shipment.trailer_id,
            "Pallet": shipment.pallet_id,
            "Crop": shipment.crop,
            "Risk": shipment.risk_level.value,
            "Shelf Life": f"{shipment.remaining_shelf_life_hours:.1f}h ({shipment.remaining_shelf_life_percent:.0f}%)",
            "Temperature": f"{shipment.temperature_c:.1f} C",
            "Destination": shipment.recommended_destination or shipment.planned_destination,
            "Act Within": f"{shipment.time_remaining_to_act_minutes} min",
        }
        for shipment in shipments
    ]
