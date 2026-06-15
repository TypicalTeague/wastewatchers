from __future__ import annotations

from datetime import timedelta

from backend.src.models.commodity import CommodityThermalProfile
from backend.src.models.common import utc_now
from backend.src.models.shipment import Shipment


def seed_profiles() -> list[CommodityThermalProfile]:
    return [
        CommodityThermalProfile(
            commodity_id="strawberry",
            name="Strawberries",
            min_temp_c=0,
            max_temp_c=2,
            baseline_shelf_life_hours=96,
            excursion_penalty_per_hour=8,
            critical_temp_c=8,
            critical_penalty_multiplier=2,
        ),
        CommodityThermalProfile(
            commodity_id="lettuce",
            name="Lettuce",
            min_temp_c=0,
            max_temp_c=4,
            baseline_shelf_life_hours=120,
            excursion_penalty_per_hour=5,
            critical_temp_c=10,
            critical_penalty_multiplier=2,
        ),
    ]


def seed_shipments() -> list[Shipment]:
    now = utc_now()
    return [
        Shipment(
            shipment_id="SHIP-1001",
            trailer_id="TRL-22",
            commodity_id="strawberry",
            origin="Salinas Farm",
            planned_destination="Fresno Warehouse",
            expected_arrival_at=now + timedelta(hours=5),
        ),
        Shipment(
            shipment_id="SHIP-1002",
            trailer_id="TRL-41",
            commodity_id="lettuce",
            origin="Yuma Farm",
            planned_destination="Bakersfield Warehouse",
            expected_arrival_at=now + timedelta(hours=8),
        ),
    ]

