# Data Retention and Privacy Notes

WasteWatchers stores operational cold-chain data needed to explain salvage
reroute recommendations and manager approvals.

## Data Categories

- Shipment records: shipment identity, trailer identity, commodity, origin,
  destination, transit state, expected arrival, and decision state.
- Trailer telemetry: shipment identity, trailer identity, reading timestamp,
  received timestamp, temperature, and telemetry source.
- Commodity profiles: commodity name, acceptable temperature range, baseline
  shelf life, and excursion penalty rules.
- Shelf-life assessments: calculated remaining shelf life, risk status,
  excursion duration, and reason codes.
- Reroute recommendations: shipment, assessment, urgency, recommended
  destination, expiration time, status, and rationale.
- Approval records: recommendation, shipment, approver identity, approval time,
  decision, resulting destination, and optional note.

## Retention Guidance

For the pilot, retain records long enough to support operational review and
post-incident analysis. Production retention periods should be finalized with
operations and compliance stakeholders before storing live customer data.

## Access Guidance

Access should be limited to farm logistics managers and system operators who
need the data for spoilage prevention, reroute decisions, or audit review. Do
not add personal or location fields beyond those required for shipment
resolution without updating the data model and specification.

