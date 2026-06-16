from __future__ import annotations

import pytest

from backend.src.models.demo import DestinationType
from backend.src.config.destination_assumptions import destination_assumption
from backend.src.rules.financials import calculate_financial_breakdown
from backend.src.services.financial_service import FinancialService


def test_financial_breakdown_separates_recovery_cost_avoidance_and_costs():
    breakdown = calculate_financial_breakdown(
        original_cargo_value_usd=10000,
        destination_acceptance_percent=50,
        rerouting_transportation_cost_usd=700,
        sorting_handling_cost_usd=300,
        processing_destination_fee_usd=200,
        avoided_disposal_cost_usd=900,
        pays_for_material=True,
    )

    assert breakdown.expected_gross_recovery_usd == 5000
    assert breakdown.cost_avoidance_usd == 900
    assert breakdown.incremental_cost_usd == 1200
    assert breakdown.expected_unrecovered_value_usd == 5000
    assert breakdown.estimated_net_value_preserved_usd == 4700


def test_compost_does_not_recover_original_retail_value():
    assumption = destination_assumption(DestinationType.COMPOST_FACILITY)

    breakdown = FinancialService().calculate_for_destination(
        original_cargo_value_usd=20000,
        adjusted_acceptance_percent=100,
        assumption=assumption,
    )

    assert breakdown.expected_gross_recovery_usd == 0
    assert breakdown.value_recovery_usd == 0
    assert breakdown.estimated_net_value_preserved_usd == 1450


def test_financial_calculation_rejects_missing_inputs():
    with pytest.raises(ValueError):
        calculate_financial_breakdown(
            original_cargo_value_usd=-1,
            destination_acceptance_percent=50,
            rerouting_transportation_cost_usd=0,
            sorting_handling_cost_usd=0,
            processing_destination_fee_usd=0,
            avoided_disposal_cost_usd=0,
            pays_for_material=True,
        )

