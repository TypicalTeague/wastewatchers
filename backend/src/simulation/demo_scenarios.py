from __future__ import annotations

from datetime import timedelta

from backend.src.models.common import utc_now
from backend.src.models.demo import DemoRiskLevel, DemoShipmentState, TemperatureReadingPoint
from backend.src.simulation.pallet_state import pallet_color_for_risk
from backend.src.simulation.trailer_layout import validate_trailer_pallet_layout


SCENARIO_ID = "hackathon-main"
SCENARIO_NAME = "Hackathon Main Demo"


def seeded_demo_shipments() -> list[DemoShipmentState]:
    now = utc_now()
    specs = [
        {
            "shipment_id": "DEMO-1001",
            "trailer_id": "TRL-DEMO-11",
            "truck_id": "TRK-204",
            "pallet_id": "PAL-STRAW-01",
            "pallet_position": 1,
            "trailer_pallet_capacity": 4,
            "commodity_abbrev": "STRAW",
            "crop": "Fictional Salinas Strawberries",
            "origin": "Demo Salinas Cooling Yard",
            "planned_destination": "Fresno Demo Distribution Center",
            "recommended_destination": None,
            "risk_level": DemoRiskLevel.HEALTHY,
            "remaining_shelf_life_hours": 88.0,
            "remaining_shelf_life_percent": 92.0,
            "temperature_c": 1.5,
            "safe_temp_min_c": 0.0,
            "safe_temp_max_c": 2.0,
            "estimated_value_usd": 42000.0,
            "value_protected_usd": 0.0,
            "time_remaining_to_act_minutes": 480,
        },
        {
            "shipment_id": "DEMO-1002",
            "trailer_id": "TRL-DEMO-11",
            "truck_id": "TRK-204",
            "pallet_id": "PAL-LEAF-02",
            "pallet_position": 2,
            "trailer_pallet_capacity": 4,
            "commodity_abbrev": "LEAF",
            "crop": "Fictional Yuma Romaine",
            "origin": "Demo Yuma Packing Shed",
            "planned_destination": "Bakersfield Demo Warehouse",
            "recommended_destination": None,
            "risk_level": DemoRiskLevel.WATCH,
            "remaining_shelf_life_hours": 72.0,
            "remaining_shelf_life_percent": 76.0,
            "temperature_c": 4.8,
            "safe_temp_min_c": 0.0,
            "safe_temp_max_c": 4.0,
            "estimated_value_usd": 36500.0,
            "value_protected_usd": 0.0,
            "time_remaining_to_act_minutes": 360,
        },
        {
            "shipment_id": "DEMO-1003",
            "trailer_id": "TRL-DEMO-24",
            "truck_id": "TRK-419",
            "pallet_id": "PAL-MELON-03",
            "pallet_position": 1,
            "trailer_pallet_capacity": 4,
            "commodity_abbrev": "MELON",
            "crop": "Fictional Imperial Melons",
            "origin": "Demo Imperial Valley Farm",
            "planned_destination": "Sacramento Demo Market",
            "recommended_destination": "Stockton Demo Salvage Dock",
            "risk_level": DemoRiskLevel.AT_RISK,
            "remaining_shelf_life_hours": 30.0,
            "remaining_shelf_life_percent": 42.0,
            "temperature_c": 8.7,
            "safe_temp_min_c": 2.0,
            "safe_temp_max_c": 6.0,
            "estimated_value_usd": 51000.0,
            "value_protected_usd": 0.0,
            "time_remaining_to_act_minutes": 150,
        },
        {
            "shipment_id": "DEMO-1004",
            "trailer_id": "TRL-DEMO-24",
            "truck_id": "TRK-419",
            "pallet_id": "PAL-BERRY-04",
            "pallet_position": 2,
            "trailer_pallet_capacity": 4,
            "commodity_abbrev": "BERRY",
            "crop": "Fictional Coastal Blueberries",
            "origin": "Demo Watsonville Cold Dock",
            "planned_destination": "Oakland Demo Grocery Hub",
            "recommended_destination": "San Jose Demo Juice Partner",
            "risk_level": DemoRiskLevel.CRITICAL,
            "remaining_shelf_life_hours": 7.0,
            "remaining_shelf_life_percent": 11.0,
            "temperature_c": 13.4,
            "safe_temp_min_c": 0.0,
            "safe_temp_max_c": 2.0,
            "estimated_value_usd": 68000.0,
            "value_protected_usd": 0.0,
            "time_remaining_to_act_minutes": 45,
        },
    ]
    shipments: list[DemoShipmentState] = []
    for index, spec in enumerate(specs):
        temperature = float(spec["temperature_c"])
        age_offset = 80 if spec["shipment_id"] == "DEMO-1002" else 0
        history = [
            TemperatureReadingPoint(
                recorded_at=now - timedelta(minutes=30 + age_offset),
                temperature_c=max(0.0, temperature - 0.8),
            ),
            TemperatureReadingPoint(
                recorded_at=now - timedelta(minutes=15 + age_offset),
                temperature_c=max(0.0, temperature - 0.3),
            ),
            TemperatureReadingPoint(
                recorded_at=now - timedelta(minutes=age_offset),
                temperature_c=temperature,
            ),
        ]
        risk = spec["risk_level"]
        shipments.append(
            DemoShipmentState(
                **spec,
                pallet_color=pallet_color_for_risk(risk),
                temperature_history=history,
                confirmation_message=f"Demo shipment {index + 1} loaded.",
            )
        )
    validate_trailer_pallet_layout(shipments)
    return shipments
