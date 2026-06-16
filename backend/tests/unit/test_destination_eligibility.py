from __future__ import annotations

from backend.src.models.demo import DestinationType, OptionViability
from backend.src.rules.reroute import build_demo_response_options, select_recommended_option
from backend.src.simulation.demo_scenarios import seeded_demo_shipments


def test_recommendation_is_not_after_shelf_life_expiration():
    shipment = next(item for item in seeded_demo_shipments() if item.shipment_id == "DEMO-1004")
    shipment = shipment.model_copy(update={"remaining_shelf_life_hours": 0.5})

    options = build_demo_response_options(shipment)
    recommended = select_recommended_option(options)

    assert recommended is not None
    assert recommended.destination_type in {DestinationType.COMPOST_FACILITY, DestinationType.MANUAL_REVIEW}
    assert all(
        option.viability == OptionViability.NOT_VIABLE
        for option in options
        if option.destination_type in {DestinationType.CONTINUE_DELIVERY, DestinationType.SECONDARY_MARKET, DestinationType.FOOD_PROCESSOR}
    )


def test_food_safety_blocks_market_recovery_before_financial_value():
    shipment = next(item for item in seeded_demo_shipments() if item.shipment_id == "DEMO-1004")
    shipment = shipment.model_copy(
        update={
            "temperature_c": shipment.safe_temp_max_c + 13,
            "remaining_shelf_life_percent": 5,
            "remaining_shelf_life_hours": 10,
        }
    )

    options = build_demo_response_options(shipment)

    market_options = [
        option
        for option in options
        if option.destination_type in {DestinationType.CONTINUE_DELIVERY, DestinationType.SECONDARY_MARKET, DestinationType.FOOD_PROCESSOR}
    ]
    assert market_options
    assert all(option.food_safety_blocked for option in market_options)
    assert all(option.viability == OptionViability.NOT_VIABLE for option in market_options)

