from __future__ import annotations

from backend.src.models.demo import DestinationAssumption, DestinationType, OperationalRisk


DESTINATION_ASSUMPTIONS: dict[DestinationType, DestinationAssumption] = {
    DestinationType.CONTINUE_DELIVERY: DestinationAssumption(
        destination_type=DestinationType.CONTINUE_DELIVERY,
        destination_name="Planned destination",
        travel_time_minutes=210,
        acceptance_percent=82.0,
        rerouting_transportation_cost_usd=0.0,
        sorting_handling_cost_usd=1400.0,
        processing_destination_fee_usd=0.0,
        avoided_disposal_cost_usd=1800.0,
        expected_condition_at_arrival="Marketable if shelf life remains",
        operational_risk=OperationalRisk.MEDIUM,
    ),
    DestinationType.SECONDARY_MARKET: DestinationAssumption(
        destination_type=DestinationType.SECONDARY_MARKET,
        destination_name="San Jose Secondary Market",
        travel_time_minutes=95,
        acceptance_percent=68.0,
        rerouting_transportation_cost_usd=1800.0,
        sorting_handling_cost_usd=2200.0,
        processing_destination_fee_usd=600.0,
        avoided_disposal_cost_usd=2200.0,
        expected_condition_at_arrival="Discount retail with shortened shelf life",
        operational_risk=OperationalRisk.MEDIUM,
    ),
    DestinationType.FOOD_PROCESSOR: DestinationAssumption(
        destination_type=DestinationType.FOOD_PROCESSOR,
        destination_name="San Jose Juice Partner",
        travel_time_minutes=70,
        acceptance_percent=52.0,
        rerouting_transportation_cost_usd=1600.0,
        sorting_handling_cost_usd=2600.0,
        processing_destination_fee_usd=900.0,
        avoided_disposal_cost_usd=2600.0,
        expected_condition_at_arrival="Processor grade if received before deadline",
        operational_risk=OperationalRisk.LOW,
    ),
    DestinationType.COMPOST_FACILITY: DestinationAssumption(
        destination_type=DestinationType.COMPOST_FACILITY,
        destination_name="Regional Compost Facility",
        travel_time_minutes=55,
        acceptance_percent=100.0,
        rerouting_transportation_cost_usd=900.0,
        sorting_handling_cost_usd=500.0,
        processing_destination_fee_usd=350.0,
        avoided_disposal_cost_usd=3200.0,
        expected_condition_at_arrival="Compost feedstock",
        operational_risk=OperationalRisk.LOW,
        pays_for_material=False,
    ),
    DestinationType.REJECT_DISPOSE: DestinationAssumption(
        destination_type=DestinationType.REJECT_DISPOSE,
        destination_name="Reject and dispose",
        travel_time_minutes=0,
        acceptance_percent=0.0,
        rerouting_transportation_cost_usd=0.0,
        sorting_handling_cost_usd=400.0,
        processing_destination_fee_usd=4200.0,
        avoided_disposal_cost_usd=0.0,
        expected_condition_at_arrival="No recovery",
        operational_risk=OperationalRisk.HIGH,
        pays_for_material=False,
    ),
    DestinationType.MANUAL_REVIEW: DestinationAssumption(
        destination_type=DestinationType.MANUAL_REVIEW,
        destination_name="Manager manual review",
        travel_time_minutes=0,
        acceptance_percent=0.0,
        rerouting_transportation_cost_usd=0.0,
        sorting_handling_cost_usd=0.0,
        processing_destination_fee_usd=0.0,
        avoided_disposal_cost_usd=0.0,
        expected_condition_at_arrival="Pending human assessment",
        operational_risk=OperationalRisk.MEDIUM,
        pays_for_material=False,
    ),
}


def destination_assumptions() -> list[DestinationAssumption]:
    """Return documented fictional assumptions used by the demo scenario."""
    return list(DESTINATION_ASSUMPTIONS.values())


def destination_assumption(destination_type: DestinationType) -> DestinationAssumption:
    return DESTINATION_ASSUMPTIONS[destination_type]

