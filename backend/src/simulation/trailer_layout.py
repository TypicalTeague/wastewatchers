from __future__ import annotations

from backend.src.models.demo import DemoShipmentState


def shipments_for_trailer(
    shipments: list[DemoShipmentState],
    trailer_id: str,
) -> list[DemoShipmentState]:
    return sorted(
        (shipment for shipment in shipments if shipment.trailer_id == trailer_id),
        key=lambda shipment: shipment.pallet_position,
    )


def empty_pallet_positions(shipments_on_trailer: list[DemoShipmentState]) -> list[int]:
    if not shipments_on_trailer:
        return []
    capacity = shipments_on_trailer[0].trailer_pallet_capacity
    occupied = {shipment.pallet_position for shipment in shipments_on_trailer}
    return [position for position in range(1, capacity + 1) if position not in occupied]


def validate_trailer_pallet_layout(shipments: list[DemoShipmentState]) -> None:
    by_trailer: dict[str, list[DemoShipmentState]] = {}
    for shipment in shipments:
        by_trailer.setdefault(shipment.trailer_id, []).append(shipment)

    for trailer_shipments in by_trailer.values():
        truck_ids = {shipment.truck_id for shipment in trailer_shipments}
        capacities = {shipment.trailer_pallet_capacity for shipment in trailer_shipments}
        positions = [shipment.pallet_position for shipment in trailer_shipments]

        if len(truck_ids) != 1:
            raise ValueError("each trailer must map to exactly one truck")
        if len(capacities) != 1:
            raise ValueError("trailer pallet capacity must be consistent per trailer")
        if len(positions) != len(set(positions)):
            raise ValueError("pallet positions must be unique within a trailer")
        capacity = trailer_shipments[0].trailer_pallet_capacity
        if any(position < 1 or position > capacity for position in positions):
            raise ValueError("pallet position must fit within trailer capacity")
