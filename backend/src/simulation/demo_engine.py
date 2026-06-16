from __future__ import annotations

from uuid import uuid4

from backend.src.models.common import utc_now
from backend.src.models.demo import (
    DemoRiskLevel,
    DemoShipmentState,
    SimulationMode,
    SimulationStep,
    TemperatureReadingPoint,
)
from backend.src.simulation.pallet_state import pallet_color_for_risk


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


def apply_simulation_step(
    scenario_id: str,
    shipments: list[DemoShipmentState],
    step_number: int,
    mode: SimulationMode,
) -> tuple[list[DemoShipmentState], SimulationStep]:
    created_at = utc_now()
    updated_shipments: list[DemoShipmentState] = []
    generated_readings: list[TemperatureReadingPoint] = []
    changed_shipments: list[str] = []

    for index, shipment in enumerate(order_shipments_by_risk(shipments)):
        previous_state = (
            shipment.temperature_c,
            shipment.remaining_shelf_life_hours,
            shipment.remaining_shelf_life_percent,
            shipment.risk_level,
        )
        updated = _advance_shipment(shipment, step_number, index, created_at)
        if previous_state != (
            updated.temperature_c,
            updated.remaining_shelf_life_hours,
            updated.remaining_shelf_life_percent,
            updated.risk_level,
        ):
            changed_shipments.append(updated.shipment_id)
        generated_readings.append(updated.temperature_history[-1])
        updated_shipments.append(updated)

    step = SimulationStep(
        step_id=f"SIM-{uuid4().hex[:12]}",
        scenario_id=scenario_id,
        step_number=step_number,
        mode=mode,
        created_at=created_at,
        generated_readings=generated_readings,
        changed_shipments=changed_shipments,
        message=f"{mode.value.title()} simulation step {step_number} applied to {len(changed_shipments)} shipments.",
    )
    return updated_shipments, step


def _advance_shipment(
    shipment: DemoShipmentState,
    step_number: int,
    index: int,
    recorded_at,
) -> DemoShipmentState:
    temperature_delta = 0.35 + (index * 0.2) + ((step_number - 1) * 0.05)
    next_temperature = round(shipment.temperature_c + temperature_delta, 1)
    shelf_life_loss = _shelf_life_loss(next_temperature, shipment.safe_temp_max_c)
    next_hours = round(max(shipment.remaining_shelf_life_hours - shelf_life_loss, 0), 1)
    next_percent = round(max(shipment.remaining_shelf_life_percent - (shelf_life_loss * 1.4), 0), 1)
    risk_level = _risk_level(next_temperature, shipment.safe_temp_max_c, next_percent)
    recommended_destination = shipment.recommended_destination
    if recommended_destination is None and risk_level in {DemoRiskLevel.AT_RISK, DemoRiskLevel.CRITICAL}:
        recommended_destination = f"{shipment.planned_destination} Salvage Dock"
    reading = TemperatureReadingPoint(recorded_at=recorded_at, temperature_c=next_temperature)
    return shipment.model_copy(
        update={
            "temperature_c": next_temperature,
            "temperature_history": [*shipment.temperature_history, reading],
            "remaining_shelf_life_hours": next_hours,
            "remaining_shelf_life_percent": next_percent,
            "risk_level": risk_level,
            "pallet_color": pallet_color_for_risk(risk_level),
            "recommended_destination": recommended_destination,
            "time_remaining_to_act_minutes": max(shipment.time_remaining_to_act_minutes - 15, 0),
            "confirmation_message": f"Simulation step {step_number} updated telemetry.",
        }
    )


def _shelf_life_loss(temperature_c: float, safe_temp_max_c: float) -> float:
    if temperature_c <= safe_temp_max_c:
        return 0.5
    return round(1.0 + ((temperature_c - safe_temp_max_c) * 1.5), 1)


def _risk_level(temperature_c: float, safe_temp_max_c: float, shelf_life_percent: float) -> DemoRiskLevel:
    if shelf_life_percent <= 15 or temperature_c >= safe_temp_max_c + 8:
        return DemoRiskLevel.CRITICAL
    if shelf_life_percent <= 45 or temperature_c >= safe_temp_max_c + 3:
        return DemoRiskLevel.AT_RISK
    if shelf_life_percent <= 80 or temperature_c > safe_temp_max_c:
        return DemoRiskLevel.WATCH
    return DemoRiskLevel.HEALTHY
