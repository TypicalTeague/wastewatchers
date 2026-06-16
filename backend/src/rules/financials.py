from __future__ import annotations

from backend.src.models.demo import DataProvenance, FinancialBreakdown, ProvenancedValue


def calculate_financial_breakdown(
    *,
    original_cargo_value_usd: float,
    destination_acceptance_percent: float,
    rerouting_transportation_cost_usd: float,
    sorting_handling_cost_usd: float,
    processing_destination_fee_usd: float,
    avoided_disposal_cost_usd: float,
    pays_for_material: bool,
) -> FinancialBreakdown:
    inputs = [
        original_cargo_value_usd,
        destination_acceptance_percent,
        rerouting_transportation_cost_usd,
        sorting_handling_cost_usd,
        processing_destination_fee_usd,
        avoided_disposal_cost_usd,
    ]
    if any(value is None for value in inputs):
        raise ValueError("financial calculation inputs cannot be unavailable")
    if original_cargo_value_usd < 0:
        raise ValueError("original cargo value cannot be negative")

    expected_gross_recovery = (
        original_cargo_value_usd * (destination_acceptance_percent / 100)
        if pays_for_material
        else 0.0
    )
    incremental_cost = (
        rerouting_transportation_cost_usd
        + sorting_handling_cost_usd
        + processing_destination_fee_usd
    )
    net_value_preserved = max(
        expected_gross_recovery + avoided_disposal_cost_usd - incremental_cost,
        0.0,
    )
    expected_unrecovered = max(original_cargo_value_usd - expected_gross_recovery, 0.0)

    provenance = [
        ProvenancedValue(
            label="Original cargo value",
            value=round(original_cargo_value_usd, 2),
            unit="USD",
            provenance=DataProvenance.DEMO_ASSUMPTION,
        ),
        ProvenancedValue(
            label="Destination acceptance",
            value=round(destination_acceptance_percent, 1),
            unit="percent",
            provenance=DataProvenance.DEMO_ASSUMPTION,
        ),
        ProvenancedValue(
            label="Avoided disposal cost",
            value=round(avoided_disposal_cost_usd, 2),
            unit="USD",
            provenance=DataProvenance.DEMO_ASSUMPTION,
        ),
    ]
    return FinancialBreakdown(
        original_cargo_value_usd=round(original_cargo_value_usd, 2),
        destination_acceptance_percent=round(destination_acceptance_percent, 1),
        expected_gross_recovery_usd=round(expected_gross_recovery, 2),
        rerouting_transportation_cost_usd=round(rerouting_transportation_cost_usd, 2),
        sorting_handling_cost_usd=round(sorting_handling_cost_usd, 2),
        processing_destination_fee_usd=round(processing_destination_fee_usd, 2),
        avoided_disposal_cost_usd=round(avoided_disposal_cost_usd, 2),
        expected_unrecovered_value_usd=round(expected_unrecovered, 2),
        estimated_net_value_preserved_usd=round(net_value_preserved, 2),
        value_recovery_usd=round(expected_gross_recovery, 2),
        cost_avoidance_usd=round(avoided_disposal_cost_usd, 2),
        incremental_cost_usd=round(incremental_cost, 2),
        input_provenance=provenance,
    )

