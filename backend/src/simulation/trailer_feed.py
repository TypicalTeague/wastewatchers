from __future__ import annotations

import argparse
from datetime import timedelta

from backend.src.models.common import utc_now
from backend.src.models.telemetry import TrailerTelemetryReading


def scenario_readings(scenario: str) -> list[TrailerTelemetryReading]:
    now = utc_now()
    if scenario == "healthy":
        temps = [1.0, 1.2, 1.1]
    elif scenario == "cooling-failure":
        temps = [1.0, 5.5, 9.5, 11.0]
    elif scenario == "duplicate":
        recorded = now - timedelta(hours=1)
        return [
            TrailerTelemetryReading(shipment_id="SHIP-1001", trailer_id="TRL-22", recorded_at=recorded, received_at=now, temperature_c=6.0, source="simulation"),
            TrailerTelemetryReading(shipment_id="SHIP-1001", trailer_id="TRL-22", recorded_at=recorded, received_at=now, temperature_c=6.0, source="simulation"),
        ]
    elif scenario == "out-of-order":
        return [
            TrailerTelemetryReading(shipment_id="SHIP-1001", trailer_id="TRL-22", recorded_at=now - timedelta(hours=1), received_at=now, temperature_c=8.0, source="simulation"),
            TrailerTelemetryReading(shipment_id="SHIP-1001", trailer_id="TRL-22", recorded_at=now - timedelta(hours=3), received_at=now, temperature_c=1.0, source="simulation"),
        ]
    else:
        raise ValueError(f"Unknown scenario: {scenario}")

    return [
        TrailerTelemetryReading(
            shipment_id="SHIP-1001",
            trailer_id="TRL-22",
            recorded_at=now - timedelta(hours=len(temps) - index),
            received_at=now,
            temperature_c=temp,
            source="simulation",
        )
        for index, temp in enumerate(temps)
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--scenario", default="cooling-failure")
    args = parser.parse_args()
    for reading in scenario_readings(args.scenario):
        print(reading.model_dump_json())


if __name__ == "__main__":
    main()

