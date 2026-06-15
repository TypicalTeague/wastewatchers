from __future__ import annotations

from backend.src.models.demo import DemoShipmentState


def temperature_chart_rows(shipment: DemoShipmentState) -> list[dict[str, object]]:
    return [
        {
            "recorded_at": point.recorded_at.isoformat(),
            "temperature_c": point.temperature_c,
            "safe_min_c": shipment.safe_temp_min_c,
            "safe_max_c": shipment.safe_temp_max_c,
        }
        for point in shipment.temperature_history
    ]
