# Feature Specification: Salvage Rerouting Dashboard

**Feature Branch**: `001-salvage-rerouting-dashboard`  
**Created**: 2026-06-15  
**Status**: Draft  
**Input**: User description: "We are building WasteWatchers. The problem is that fleet telemetry tracks real time truck temperatures, but agricultural systems remain isolated. Warehouses are unaware of transit cooling failures until the truck hits the dock, triggering chaotic manual negotiations and product spoilage. WasteWatchers provides an API middleware bridge that automates this. It ingests live trailer data, cross references it against commodity thermal profiles, and calculates remaining crop shelf life. It generates a resolution dashboard for farm logistics managers to approve salvage rerouting with a single click."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Detect At-Risk Shipments (Priority: P1)

A farm logistics manager needs WasteWatchers to identify in-transit shipments
whose temperature history has reduced crop shelf life before the truck reaches
the warehouse.

**Why this priority**: Early detection is the core value of the product; without
it, managers still discover cooling failures too late to prevent spoilage.

**Independent Test**: Feed a shipment with live trailer temperature readings and
a known commodity profile, then verify the shipment is classified with an
updated remaining shelf-life estimate and risk status.

**Acceptance Scenarios**:

1. **Given** a shipment carrying a commodity with a known thermal profile,
   **When** new trailer temperature readings arrive within acceptable range,
   **Then** the shipment remains marked as healthy with updated shelf-life
   timing.
2. **Given** a shipment with temperature readings outside the commodity's
   acceptable profile, **When** WasteWatchers evaluates the shipment, **Then**
   the shipment is marked at risk and shows reduced remaining shelf life.

---

### User Story 2 - Review Resolution Options (Priority: P2)

A farm logistics manager needs a dashboard that summarizes cooling failures,
remaining shelf life, and salvage rerouting options so they can decide how to
save crop value before arrival.

**Why this priority**: Detection must lead to a clear operational decision;
otherwise teams remain stuck in manual negotiation.

**Independent Test**: Create multiple at-risk shipments with different
commodities and shelf-life outcomes, then verify the dashboard ranks or groups
them by urgency and displays the available salvage resolution for each.

**Acceptance Scenarios**:

1. **Given** several in-transit shipments with different risk levels, **When**
   the manager opens the dashboard, **Then** the most urgent salvage decisions
   are visible without searching across separate systems.
2. **Given** an at-risk shipment with a viable alternate destination, **When**
   the dashboard presents resolution details, **Then** the manager can see the
   affected crop, current risk, remaining shelf life, and recommended reroute
   action.

---

### User Story 3 - Approve Salvage Rerouting (Priority: P3)

A farm logistics manager needs to approve a recommended salvage reroute in one
action so the shipment can be redirected before spoilage risk becomes
unrecoverable.

**Why this priority**: A single approval closes the loop from detection to
resolution and reduces delays caused by manual coordination.

**Independent Test**: Select an at-risk shipment with a recommended reroute,
approve the resolution, and verify the shipment changes to an approved reroute
state with an auditable decision record.

**Acceptance Scenarios**:

1. **Given** an at-risk shipment with a proposed salvage reroute, **When** the
   manager approves the recommendation, **Then** the shipment records the
   approval, decision time, and selected reroute.
2. **Given** a shipment with no viable salvage reroute, **When** the manager
   reviews it, **Then** the dashboard explains why a one-click approval is not
   available and preserves the shipment for manual follow-up.

---

### Edge Cases

- Temperature readings arrive out of order or with duplicate timestamps.
- A shipment references a commodity without a matching thermal profile.
- A trailer stops reporting telemetry during transit.
- A temperature excursion is brief but severe enough to reduce shelf life.
- Multiple at-risk shipments require attention at the same time.
- A manager attempts to approve a reroute after the shipment has already reached
  the dock.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept live trailer telemetry for active shipments,
  including shipment identity, trailer identity, temperature readings, reading
  time, and current transit status.
- **FR-002**: System MUST match each shipment to the commodity thermal profile
  that defines acceptable temperature range and shelf-life sensitivity.
- **FR-003**: System MUST calculate remaining crop shelf life after each relevant
  telemetry update using the shipment's commodity profile and temperature
  history.
- **FR-004**: System MUST classify shipments into clear operational states such
  as healthy, watch, at risk, salvage recommended, reroute approved, and manual
  follow-up required.
- **FR-005**: System MUST identify shipments whose remaining shelf life or
  temperature excursion requires logistics-manager review before dock arrival.
- **FR-006**: System MUST present farm logistics managers with a dashboard of
  at-risk shipments, including affected commodity, current temperature status,
  remaining shelf life, urgency, and recommended action.
- **FR-007**: System MUST allow a farm logistics manager to approve a salvage
  reroute for a shipment with one deliberate approval action.
- **FR-008**: System MUST record each reroute approval with shipment identity,
  decision maker, decision time, recommended action, and resulting shipment
  state.
- **FR-009**: System MUST prevent one-click reroute approval when a shipment has
  no viable recommendation, lacks required commodity data, or has already
  reached the dock.
- **FR-010**: System MUST surface telemetry, commodity-profile, and calculation
  errors in a way that routes affected shipments to manual follow-up instead of
  silently hiding them.
- **FR-011**: System MUST retain enough shipment, telemetry summary, shelf-life
  calculation, and approval history to explain why a reroute was recommended or
  approved.

### Data, Privacy, and Recovery Requirements *(mandatory when data or operations are involved)*

- **DR-001**: Feature MUST identify persisted data, ownership, validation rules,
  retention expectations, and access boundaries for shipments, trailer
  telemetry, commodity profiles, shelf-life calculations, reroute
  recommendations, and approval records.
- **DR-002**: Feature MUST identify operational data fields, including trailer
  identity, shipment identity, commodity type, temperature readings, shipment
  location or transit state, decision maker, and approval timestamp, and justify
  each field by its role in detecting spoilage risk or approving salvage action.
- **DR-003**: Feature MUST define explicit validated data contracts for incoming
  trailer data, commodity thermal profiles, shelf-life outcomes, dashboard
  records, and approval decisions. Unstructured typed data passing MUST NOT be
  used for these business records.
- **OR-001**: Feature MUST define user-visible recovery behavior for telemetry
  gaps, missing commodity profiles, stale shelf-life calculations, failed
  recommendation generation, and approval attempts that can no longer be safely
  applied.

### Architecture Boundaries *(mandatory)*

- **AB-001**: Telemetry simulation MUST remain separate from shipment risk
  evaluation, dashboard presentation, and approval decision logic.
- **AB-002**: Business rules for shelf-life calculation and salvage eligibility
  MUST remain separate from ingestion and dashboard presentation.
- **AB-003**: Dashboard behavior MUST consume validated shipment, risk, and
  recommendation records; it MUST NOT contain telemetry simulation or
  shelf-life calculation rules.

### Key Entities *(include if feature involves data)*

- **Shipment**: A crop load in transit, including shipment identity, trailer
  identity, commodity, current transit state, and arrival status.
- **Trailer Telemetry Reading**: A time-stamped temperature observation tied to a
  trailer and shipment.
- **Commodity Thermal Profile**: The acceptable temperature range and shelf-life
  sensitivity rules for a crop commodity.
- **Shelf-Life Assessment**: The calculated remaining shelf life, risk status,
  and calculation time for a shipment.
- **Reroute Recommendation**: A proposed salvage action for an at-risk shipment,
  including destination or resolution intent and urgency.
- **Approval Record**: The manager decision to approve or withhold a salvage
  reroute, including decision maker, decision time, and resulting state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Farm logistics managers can identify at-risk in-transit shipments
  at least 2 hours before expected dock arrival for 90% of shipments where
  telemetry arrives before that window.
- **SC-002**: Managers can review an at-risk shipment and approve an available
  salvage reroute in under 60 seconds from opening the dashboard.
- **SC-003**: 95% of shipments with complete telemetry and commodity profiles
  receive a current shelf-life assessment without manual intervention.
- **SC-004**: At least 90% of approved reroutes include a complete decision
  record that explains the risk, recommendation, approver, and approval time.
- **SC-005**: Manual negotiation cases caused by late discovery of transit
  cooling failures are reduced by 50% during pilot evaluation.

## Assumptions

- Farm logistics managers are the primary users for reviewing risks and
  approving salvage reroutes.
- Fleet telemetry providers can supply trailer identity, shipment identity,
  temperature readings, and reading timestamps while shipments are in transit.
- Commodity thermal profiles are available for the crop types included in the
  initial pilot.
- Salvage rerouting recommendations are limited to operationally viable
  alternatives known to the logistics team at decision time.
- The first release records approvals and exposes recommendations; it does not
  automatically dispatch drivers or change carrier instructions without manager
  approval.
- Retention for telemetry and decision records follows agricultural operations
  audit needs and will be finalized during implementation planning.
