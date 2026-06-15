from __future__ import annotations

from backend.src.models.demo import DemoShipmentState


def order_shipments_by_risk(shipments: list[DemoShipmentState]) -> list[DemoShipmentState]:
    risk_order = {
        "critical": 0,
        "at_risk": 1,
        "watch": 2,
        "healthy": 3,
        "manual_review": 4,
        "reroute_approved": 5,
        "rejected": 6,
    }
    return sorted(shipments, key=lambda shipment: (risk_order[shipment.risk_level.value], shipment.shipment_id))
