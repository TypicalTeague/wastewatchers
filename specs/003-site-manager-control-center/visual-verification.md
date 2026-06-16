# Visual Verification: Site Manager Control Center

## Protected Surfaces

- Truck and pallet visualization remains in the central shipment workspace.
- Shipment queue remains visible and ordered worst first.
- Emerald WasteWatchers identity remains the primary accent.
- Simulation controls remain available above the dashboard workspace.
- Dark mode classes remain present on updated dashboard surfaces.
- Responsive layout keeps queue, workspace, and compact summary stacked on
  smaller viewports and columnar on wide desktop.

## No Fake Map

No route map was added. When route coordinates are unavailable, the dashboard
uses route context, deadline, travel time, destination, and condition cards
instead of fabricated GPS data.

## Manual Checks

1. Load the demo scenario at `/dashboard`.
2. Select each queue row and confirm the selected pallet remains interactive in
   the truck visualization.
3. Confirm manager-facing temperatures show `°F`.
4. Step the simulation and confirm the latest update, risk drivers, response
   options, financial impact, and timeline change.
5. Approve a recommendation and confirm the shipment status changes to approved
   without generating a new unapproved suggestion.

