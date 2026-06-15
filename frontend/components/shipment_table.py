from __future__ import annotations

from frontend.services.wastewatchers_client import DashboardShipment


def shipment_rows(shipments: list[DashboardShipment]) -> list[dict[str, object]]:
    return [
        {
            "Shipment": shipment.shipment_id,
            "Trailer": shipment.trailer_id,
            "Commodity": shipment.commodity_name,
            "State": shipment.decision_state,
            "Shelf Life Hours": shipment.remaining_shelf_life_hours,
            "Urgency": shipment.urgency,
            "Recommended Destination": shipment.recommended_destination or "Manual follow-up",
        }
        for shipment in shipments
    ]

