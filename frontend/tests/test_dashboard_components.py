from __future__ import annotations

from frontend.components.recommendation_panel import recommendation_summary
from frontend.components.shipment_table import shipment_rows
from frontend.services.wastewatchers_client import DashboardShipment


def test_shipment_table_accepts_typed_dashboard_records():
    rows = shipment_rows(
        [
            DashboardShipment(
                shipment_id="SHIP-1001",
                trailer_id="TRL-22",
                commodity_name="Strawberries",
                decision_state="salvage_recommended",
                remaining_shelf_life_hours=12,
                urgency="critical",
                expected_arrival_at="2026-06-15T20:00:00Z",
                recommended_destination="Cold Dock A",
            )
        ]
    )

    assert rows[0]["Shipment"] == "SHIP-1001"
    assert rows[0]["Urgency"] == "critical"


def test_recommendation_panel_summary_handles_missing_recommendation():
    summary = recommendation_summary(None)

    assert "manual follow-up" in summary.lower()

