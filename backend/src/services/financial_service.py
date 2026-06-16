from __future__ import annotations

from backend.src.models.demo import DestinationAssumption, FinancialBreakdown
from backend.src.rules.financials import calculate_financial_breakdown


class FinancialService:
    def calculate_for_destination(
        self,
        *,
        original_cargo_value_usd: float,
        adjusted_acceptance_percent: float,
        assumption: DestinationAssumption,
    ) -> FinancialBreakdown:
        return calculate_financial_breakdown(
            original_cargo_value_usd=original_cargo_value_usd,
            destination_acceptance_percent=adjusted_acceptance_percent,
            rerouting_transportation_cost_usd=assumption.rerouting_transportation_cost_usd,
            sorting_handling_cost_usd=assumption.sorting_handling_cost_usd,
            processing_destination_fee_usd=assumption.processing_destination_fee_usd,
            avoided_disposal_cost_usd=assumption.avoided_disposal_cost_usd,
            pays_for_material=assumption.pays_for_material,
        )
