import type { DemoShipmentState } from "./types";

/** Top-down slot coordinates — layout only, positions come from the API. */
export const PALLET_SLOT_LAYOUT: Record<
  number,
  { x: number; y: number; width: number; height: number }
> = {
  1: { x: 44, y: 124, width: 128, height: 100 },
  2: { x: 188, y: 124, width: 128, height: 100 },
  3: { x: 44, y: 236, width: 128, height: 100 },
  4: { x: 188, y: 236, width: 128, height: 100 },
};

export function shipmentsForTrailer(
  shipments: DemoShipmentState[],
  trailerId: string,
): DemoShipmentState[] {
  return [...shipments]
    .filter((shipment) => shipment.trailer_id === trailerId)
    .sort((a, b) => a.pallet_position - b.pallet_position);
}

export function emptyPalletPositions(
  shipmentsOnTrailer: DemoShipmentState[],
): number[] {
  if (shipmentsOnTrailer.length === 0) {
    return [];
  }
  const capacity = shipmentsOnTrailer[0].trailer_pallet_capacity;
  const occupied = new Set(
    shipmentsOnTrailer.map((shipment) => shipment.pallet_position),
  );
  return Array.from({ length: capacity }, (_, index) => index + 1).filter(
    (position) => !occupied.has(position),
  );
}

export function shipmentByPalletPosition(
  shipmentsOnTrailer: DemoShipmentState[],
  position: number,
): DemoShipmentState | undefined {
  return shipmentsOnTrailer.find(
    (shipment) => shipment.pallet_position === position,
  );
}
