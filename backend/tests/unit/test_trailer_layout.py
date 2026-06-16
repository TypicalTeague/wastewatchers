from __future__ import annotations

import pytest

from backend.src.simulation.demo_scenarios import seeded_demo_shipments
from backend.src.simulation.trailer_layout import (
    empty_pallet_positions,
    shipments_for_trailer,
    validate_trailer_pallet_layout,
)


def test_seeded_demo_assigns_stable_pallet_positions_per_trailer():
    shipments = seeded_demo_shipments()

    trailer_a = shipments_for_trailer(shipments, "TRL-DEMO-11")
    trailer_b = shipments_for_trailer(shipments, "TRL-DEMO-24")

    assert [shipment.pallet_position for shipment in trailer_a] == [1, 2]
    assert [shipment.pallet_id for shipment in trailer_a] == ["PAL-STRAW-01", "PAL-LEAF-02"]
    assert all(shipment.truck_id == "TRK-204" for shipment in trailer_a)

    assert [shipment.pallet_position for shipment in trailer_b] == [1, 2]
    assert [shipment.pallet_id for shipment in trailer_b] == ["PAL-MELON-03", "PAL-BERRY-04"]
    assert all(shipment.truck_id == "TRK-419" for shipment in trailer_b)


def test_empty_positions_only_include_unused_capacity():
    shipments = seeded_demo_shipments()

    assert empty_pallet_positions(shipments_for_trailer(shipments, "TRL-DEMO-11")) == [3, 4]
    assert empty_pallet_positions(shipments_for_trailer(shipments, "TRL-DEMO-24")) == [3, 4]


def test_validate_trailer_pallet_layout_rejects_duplicate_positions():
    shipments = seeded_demo_shipments()
    duplicate = shipments[1].model_copy(update={"pallet_position": 1})

    with pytest.raises(ValueError, match="unique"):
        validate_trailer_pallet_layout([shipments[0], duplicate])
