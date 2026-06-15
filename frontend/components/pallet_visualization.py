from __future__ import annotations

from backend.src.models.demo import DemoShipmentState


PALLET_LABELS = {
    "green": "Stable",
    "yellow": "Watch",
    "red": "Critical",
    "gray": "Manual review",
}


def pallet_summary(shipment: DemoShipmentState) -> str:
    label = PALLET_LABELS[shipment.pallet_color.value]
    return f"{shipment.pallet_id}: {label} pallet for {shipment.crop}"


def pallet_badge(shipment: DemoShipmentState) -> dict[str, str]:
    return {
        "shipment_id": shipment.shipment_id,
        "color": shipment.pallet_color.value,
        "label": PALLET_LABELS[shipment.pallet_color.value],
    }
