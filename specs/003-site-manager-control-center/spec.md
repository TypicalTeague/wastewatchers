# Feature Specification: WasteWatchers Site Manager Control Center

**Feature Branch**: `004-site-manager-control-center`  
**Created**: 2026-06-16  
**Status**: Draft  
**Input**: User description: "Create the feature specification for a WasteWatchers Site Manager Control Center."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review the Exception Queue (Priority: P1)

As a site manager, I want shipments ordered from most urgent to least urgent so
that I immediately know which load needs attention.

**Why this priority**: The queue is the manager's first triage surface. If the
highest-risk shipment is not obvious, all later detail and recommendation work
is delayed.

**Independent Test**: Load a mixed set of shipments with healthy, watch,
at-risk, critical, approved, manual review, rejected, stale, and missing-data
states. Confirm the highest urgency shipment appears first and each row gives
enough context to decide what to open next.

**Acceptance Scenarios**:

1. **Given** multiple active shipments with different risk, deadline, and data
   freshness states, **When** the manager opens the control center, **Then** the
   queue is ordered worst first.
2. **Given** any shipment in the queue, **When** the manager scans the row,
   **Then** the row shows risk status, commodity, decision deadline, remaining
   shelf life, and latest update time.
3. **Given** shipments in different workflow states, **When** the queue renders,
   **Then** statuses distinguish healthy, watch, at risk, critical, approved,
   manual review, and rejected.
4. **Given** telemetry is stale or missing, **When** the affected shipment is
   displayed, **Then** the stale or missing condition is visibly identified.
5. **Given** a shipment has changed since the previous update, **When** the
   queue refreshes, **Then** the queue explains what changed.

---

### User Story 2 - Understand Shipment Condition (Priority: P1)

As a site manager, I want to understand why a shipment is at risk so that I can
judge whether the recommendation is credible.

**Why this priority**: Managers need confidence in the evidence before they can
approve a costly or time-sensitive action.

**Independent Test**: Open an at-risk shipment with complete condition data,
then repeat with stale or missing signals. Confirm temperatures, shelf-life
impact, top risk drivers, and provenance labels are clear without reading raw
telemetry.

**Acceptance Scenarios**:

1. **Given** a shipment has temperature readings, **When** the manager views
   shipment condition, **Then** manager-facing temperatures display in degrees
   Fahrenheit and include the degrees Fahrenheit label.
2. **Given** a commodity has a safe temperature range, **When** the manager
   views shipment condition, **Then** the safe range displays in degrees
   Fahrenheit.
3. **Given** the shipment has been outside the safe range, **When** condition
   details render, **Then** time outside the safe range, severity, and
   cumulative exposure are shown when available.
4. **Given** shelf-life inputs are available, **When** condition details render,
   **Then** remaining shelf life and expected remaining shelf life at arrival
   are shown.
5. **Given** multiple risk factors contribute to the assessment, **When** the
   manager reviews the shipment, **Then** the three strongest risk drivers are
   clearly explained.
6. **Given** any risk input is displayed, **When** the manager reviews it,
   **Then** the input is labeled as measured, calculated, simulated, assumed, or
   unavailable.
7. **Given** a required input is missing, **When** the manager reviews shipment
   condition, **Then** the missing value displays as Data unavailable rather
   than an invented normal value.

---

### User Story 3 - Receive a Clear Recommended Decision (Priority: P1)

As a site manager, I want WasteWatchers to give me one clear recommended action
so that I can respond before the shipment becomes unsalvageable.

**Why this priority**: The control center must move from diagnosis to action.
The manager needs the recommended decision and deadline in the central workflow,
not buried in secondary UI.

**Independent Test**: Open a critical shipment with at least one viable
response. Confirm the central workspace presents one action-oriented
recommendation with deadline, rationale, financial effect, confidence, and
available decision actions.

**Acceptance Scenarios**:

1. **Given** a shipment has a recommended decision, **When** the manager opens
   the shipment workspace, **Then** the recommendation appears prominently in
   the main workspace and is not hidden exclusively in a narrow side panel.
2. **Given** a recommendation is available, **When** its title is displayed,
   **Then** the title is action-oriented, such as "Reroute to San Jose Juice
   Partner within 45 minutes."
3. **Given** a recommendation is available, **When** the manager reviews it,
   **Then** it includes destination, rationale, deadline, travel time, expected
   condition at arrival, financial effect, confidence, and expected
   post-action risk.
4. **Given** a recommendation is available, **When** the manager chooses a next
   step, **Then** they can approve, compare alternatives, request manual review,
   or reject.
5. **Given** the manager chooses a final decision, **When** they submit it,
   **Then** confirmation is required before the decision is recorded.
6. **Given** a decision is approved, **When** the shipment is viewed afterward,
   **Then** it shows approver, timestamp, destination, expected value preserved,
   and updated shipment status.

---

### User Story 4 - Compare Response Options (Priority: P2)

As a site manager, I want to compare viable response options so that I can
understand operational and financial tradeoffs.

**Why this priority**: One recommendation is useful, but managers also need to
understand why alternatives were viable or rejected before approving action.

**Independent Test**: Open a shipment with several possible responses and
verify continuing delivery, secondary market, processing, composting, manual
review, and rejection/disposal are represented with viability and financial
tradeoffs.

**Acceptance Scenarios**:

1. **Given** response options are available, **When** the manager compares them,
   **Then** options include continuing delivery where viable, farmers or
   secondary market, juice or food processing, composting, manual review, and
   rejection or disposal.
2. **Given** an option is shown, **When** the manager reviews it, **Then** it
   shows destination type, destination name, travel time, condition at arrival,
   acceptance percentage, gross recovery, incremental cost, estimated net value
   preserved, expected waste diversion, operational risk, and viability.
3. **Given** multiple options are shown, **When** the manager scans the list,
   **Then** each option is labeled Recommended, Viable alternative, or Not
   viable.
4. **Given** an option would arrive after usable shelf life expires, **When**
   recommendations are ranked, **Then** that option cannot be recommended.
5. **Given** food safety restrictions conflict with financial recovery, **When**
   options are evaluated, **Then** food safety takes priority.
6. **Given** composting is an option, **When** its financial estimate is shown,
   **Then** original retail cargo value is not treated as recovered unless the
   facility explicitly pays for the material.

---

### User Story 5 - Understand the Financial Estimate (Priority: P2)

As a site manager, I want to see how the financial estimate was produced so
that I do not mistake an assumption for guaranteed savings.

**Why this priority**: Financial estimates are central to decision trust and
must not overstate certainty or hide assumptions.

**Independent Test**: Review the financial panel for a shipment with demo
assumptions and manager-entered values. Confirm the estimate is named, broken
down, labeled by provenance, and changes as spoilage worsens.

**Acceptance Scenarios**:

1. **Given** financial impact is displayed, **When** the manager views it,
   **Then** the label "protected value" is replaced with "Estimated net value
   preserved."
2. **Given** an estimate is displayed, **When** the manager reviews it, **Then**
   the interface states that the result is an estimate and is not guaranteed
   savings.
3. **Given** the estimate is displayed, **When** the manager expands or reviews
   the breakdown, **Then** it includes original cargo value, destination
   acceptance percentage, expected gross recovery, rerouting cost, sorting and
   handling cost, processing or destination fees, avoided disposal cost,
   expected unrecovered value, and net value preserved.
4. **Given** any financial input is displayed, **When** the manager reviews it,
   **Then** it is labeled measured, calculated, demo assumption, or manager
   entered.
5. **Given** value recovery and cost avoidance both contribute to the estimate,
   **When** the breakdown is shown, **Then** they are shown separately.
6. **Given** destination assumptions affect recovery or cost, **When** the
   manager reviews the estimate, **Then** those assumptions are visible.
7. **Given** spoilage worsens over time, **When** financial estimates refresh,
   **Then** expected recovery generally declines unless an explicitly disclosed
   assumption explains otherwise.

---

### User Story 6 - Use Multiple Spoilage Signals (Priority: P2)

As a site manager, I want risk to consider more than a single temperature
reading so that the decision reflects the shipment's full condition.

**Why this priority**: A single reading can overstate or understate urgency.
Risk and confidence must account for freshness, history, route timing, and
available condition signals.

**Independent Test**: Evaluate shipments with different combinations of current
temperature, duration, trend, shelf life, freshness, delays, and unavailable
signals. Confirm risk drivers, recommendation influence, and confidence change
appropriately.

**Acceptance Scenarios**:

1. **Given** multiple spoilage signals are available, **When** risk is
   assessed, **Then** risk may use current temperature, safe range, duration
   outside range, excursion severity, cumulative exposure, temperature trend,
   remaining shelf life, route ETA, commodity tolerance, sensor freshness,
   shipment age, humidity, door events, shock events, delays, weather, traffic,
   destination acceptance, and capacity when available.
2. **Given** a signal is unavailable, **When** risk is assessed or displayed,
   **Then** the signal is not fabricated.
3. **Given** a signal is part of the demo simulation, **When** it is displayed,
   **Then** it is labeled simulated.
4. **Given** factors materially influence the recommendation, **When** the
   manager reviews the rationale, **Then** those factors are visible.
5. **Given** telemetry is missing or stale, **When** confidence is calculated,
   **Then** confidence is reduced or manual review is triggered.

---

### User Story 7 - Monitor a Changing Disruption (Priority: P3)

As a site manager, I want the demo simulation to update the shipment and
recommendation over time so that I can see proactive decision support.

**Why this priority**: The demo must show that WasteWatchers responds to a
changing disruption rather than presenting static recommendations.

**Independent Test**: Run the simulation through multiple updates and confirm
condition, risk, deadline, option viability, financial estimates, confidence,
and recommendation destination change where applicable.

**Acceptance Scenarios**:

1. **Given** the simulation is running, **When** simulated updates occur,
   **Then** condition, excursion duration, shelf life, risk, deadline, option
   viability, estimated recovery, net value preserved, confidence, and
   recommended destination update where applicable.
2. **Given** spoilage risk increases, **When** financial estimates refresh,
   **Then** estimates do not remain static.
3. **Given** usable shelf life declines, **When** options are reevaluated,
   **Then** some options become unavailable when they no longer meet viability
   rules.
4. **Given** a recommendation has already been approved, **When** the simulation
   updates, **Then** that approved recommendation stops appearing as an
   unapproved suggestion.
5. **Given** a simulation update changes a shipment, **When** the manager views
   the workspace, **Then** the latest simulated update and what changed are
   visible.

---

### User Story 8 - Preserve the Existing Visual Strengths (Priority: P1)

As a site manager, I want a clean and familiar control center so that I can make
decisions without learning a completely redesigned application.

**Why this priority**: The existing truck visualization, queue, simulation, and
visual identity are working strengths. The feature must improve the workflow
without replacing the product's recognizable core.

**Independent Test**: Compare the updated control center with the existing
experience across the same shipment states. Confirm the truck and pallet
visualization, queue, emerald identity, simulation concept, responsive behavior,
and dark mode remain intact where currently supported.

**Acceptance Scenarios**:

1. **Given** the control center is updated, **When** the manager opens a
   shipment, **Then** the current truck and pallet visualization remains
   available.
2. **Given** the control center is updated, **When** the manager opens the
   dashboard, **Then** the shipment queue remains available.
3. **Given** the control center is updated, **When** the manager scans the
   interface, **Then** the emerald WasteWatchers visual identity remains
   recognizable.
4. **Given** the demo is available, **When** the manager or presenter uses it,
   **Then** the live simulation concept remains available.
5. **Given** the current experience supports responsive behavior or dark mode,
   **When** the control center is updated, **Then** those behaviors remain
   supported.
6. **Given** reliable route coordinates are unavailable, **When** route context
   is displayed, **Then** the interface does not add a fake map.
7. **Given** mapping data is unavailable, **When** the manager needs route
   context, **Then** route, ETA, delay, and destination cards are used instead.

### Edge Cases

- A shipment has no recent telemetry, and the workspace must show Data
  unavailable, stale status, lower confidence, or manual review rather than a
  normal condition.
- A destination has missing acceptance, capacity, or pricing assumptions, and
  the option must be marked unavailable or lower confidence rather than
  recommended from invented data.
- Food safety constraints disqualify the financially best option.
- Usable shelf life expires while the manager is reviewing options.
- A shipment is already approved, rejected, or in manual review when new
  telemetry arrives.
- Multiple shipments become critical at the same time and must still be ordered
  by urgency and decision deadline.
- Simulation updates produce worsening spoilage but financial values fail to
  decline, requiring the discrepancy to be visible or explained by assumptions.
- Route coordinates are unavailable, so route context must be shown without a
  fabricated map.
- Existing truck, queue, dark mode, responsive behavior, or emerald identity is
  touched by the change and must be verified for regression.

## Requirements *(mandatory)*

### Scope Boundaries

- The feature covers a site manager decision workspace for refrigerated produce
  shipment exceptions, condition explanation, recommendations, option
  comparison, financial estimate transparency, multi-signal spoilage risk, demo
  simulation changes, and preservation of existing visual strengths.
- The feature does not include real partner pricing integrations, guaranteed
  salvage revenue, actual weather or traffic integrations unless already
  configured, fabricated GPS coordinates, automatic rerouting without manager
  confirmation, or copying another logistics platform's proprietary interface
  or branding.

### Functional Requirements

- **FR-001**: The system MUST order the exception queue from most urgent to
  least urgent using risk status, decision deadline, remaining shelf life, and
  data freshness.
- **FR-002**: Each queued shipment MUST show risk status, commodity, decision
  deadline, remaining shelf life, latest update time, data freshness, and what
  changed since the previous update.
- **FR-003**: Shipment statuses MUST include healthy, watch, at risk, critical,
  approved, manual review, and rejected.
- **FR-004**: Stale or missing telemetry MUST be visibly identified wherever it
  affects queue ordering, condition, confidence, or recommendations.
- **FR-005**: Manager-facing temperatures and safe temperature ranges MUST
  display in degrees Fahrenheit and include the degrees Fahrenheit label.
- **FR-006**: Shipment condition MUST show time outside the safe range,
  excursion severity, cumulative exposure, remaining shelf life, expected
  remaining shelf life at arrival, and the three strongest risk drivers when
  those values are available.
- **FR-007**: Missing risk or condition information MUST display as Data
  unavailable and MUST NOT be replaced with invented normal values.
- **FR-008**: Every manager-facing operational or financial value MUST identify
  whether it is measured, calculated, simulated, a demo assumption, manager
  entered, or unavailable.
- **FR-009**: The main shipment workspace MUST prominently display one clear
  action-oriented recommendation when a recommendation is available.
- **FR-010**: The recommendation MUST include destination, rationale, deadline,
  travel time, expected condition at arrival, financial effect, confidence, and
  expected post-action risk.
- **FR-011**: The manager MUST be able to approve the recommendation, compare
  alternatives, request manual review, or reject the shipment response.
- **FR-012**: Final decisions MUST require explicit confirmation before being
  recorded.
- **FR-013**: Approved decisions MUST show approver, timestamp, destination,
  expected value preserved, and updated shipment status.
- **FR-014**: Response options MUST include continuing delivery where viable,
  farmers or secondary market, juice or food processing, composting, manual
  review, and rejection or disposal.
- **FR-015**: Each response option MUST show destination type, destination name,
  travel time, condition at arrival, acceptance percentage, gross recovery,
  incremental cost, estimated net value preserved, expected waste diversion,
  operational risk, and viability.
- **FR-016**: Response options MUST be labeled Recommended, Viable alternative,
  or Not viable.
- **FR-017**: An option MUST NOT be recommended when arrival would occur after
  usable shelf life expires.
- **FR-018**: Food safety restrictions MUST take priority over financial
  recovery in recommendation eligibility and ranking.
- **FR-019**: Composting MUST NOT treat original retail cargo value as recovered
  unless the facility explicitly pays for the material.
- **FR-020**: Manager-facing financial copy MUST use "Estimated net value
  preserved" instead of "protected value."
- **FR-021**: The financial estimate MUST state that it is an estimate and is
  not guaranteed savings.
- **FR-022**: The financial breakdown MUST include original cargo value,
  destination acceptance percentage, expected gross recovery, rerouting cost,
  sorting and handling cost, processing or destination fees, avoided disposal
  cost, expected unrecovered value, and net value preserved.
- **FR-023**: Value recovery and cost avoidance MUST be shown separately.
- **FR-024**: Destination assumptions that affect recovery, cost, viability, or
  confidence MUST be visible to the manager.
- **FR-025**: Expected recovery MUST generally decline as spoilage worsens
  unless a disclosed assumption explains why it did not.
- **FR-026**: Risk assessment MAY use current temperature, safe range, duration
  outside range, excursion severity, cumulative exposure, temperature trend,
  remaining shelf life, route ETA, commodity tolerance, sensor freshness,
  shipment age, humidity, door events, shock events, delays, weather, traffic,
  destination acceptance, and capacity when available.
- **FR-027**: Unavailable spoilage, route, partner, weather, traffic, capacity,
  or financial signals MUST NOT be fabricated.
- **FR-028**: Demo signals MUST be labeled simulated.
- **FR-029**: The recommendation rationale MUST show which factors materially
  influenced the recommendation.
- **FR-030**: Missing or stale telemetry MUST reduce confidence or trigger
  manual review.
- **FR-031**: Simulation updates MUST update condition, excursion duration,
  shelf life, risk, deadline, option viability, estimated recovery, net value
  preserved, confidence, and recommended destination where applicable.
- **FR-032**: Approved recommendations MUST stop appearing as unapproved
  suggestions.
- **FR-033**: The workspace MUST show the latest simulated update and what
  changed.
- **FR-034**: The existing truck and pallet visualization, shipment queue,
  emerald identity, live simulation concept, responsive behavior, and dark mode
  where currently supported MUST be preserved.
- **FR-035**: The interface MUST NOT add a fake map when reliable route
  coordinates are unavailable.
- **FR-036**: When mapping data is unavailable, the interface MUST use route,
  ETA, delay, and destination cards for route context.

### Data Provenance *(mandatory for operational or financial values)*

- **Temperature readings**: measured when received from telemetry, simulated
  during demo scenarios, unavailable when missing or stale beyond the freshness
  threshold; fallback is Data unavailable with reduced confidence or manual
  review.
- **Safe temperature range**: calculated or assumed from commodity tolerance
  rules; fallback is Data unavailable and no normal condition is inferred.
- **Excursion duration, severity, cumulative exposure, and trend**: calculated
  from available condition history; fallback is Data unavailable when history is
  insufficient.
- **Remaining shelf life and expected shelf life at arrival**: calculated from
  commodity tolerance, shipment age, exposure, and ETA when available; fallback
  is Data unavailable or manual review when required inputs are missing.
- **Route ETA, delay, destination acceptance, capacity, weather, and traffic**:
  measured or partner-provided when available, simulated in demo mode, or
  unavailable; fallback is disclosed lower confidence or option ineligibility.
- **Original cargo value**: measured when supplied by shipment records, manager
  entered when provided during review, demo assumption in demo scenarios, or
  unavailable.
- **Destination acceptance percentage and destination assumptions**: measured or
  partner-provided when available, demo assumption in demo scenarios, manager
  entered during review, or unavailable.
- **Expected gross recovery, expected unrecovered value, avoided disposal cost,
  incremental costs, and estimated net value preserved**: calculated from
  disclosed inputs; fallback is Data unavailable or incomplete estimate when
  required inputs are missing.
- **Approval metadata**: manager entered or system recorded from the confirmed
  decision event; fallback is not applicable because final decisions cannot be
  recorded without confirmation metadata.

### Calculation Requirements *(mandatory for risk, shelf life, financials, ranking, or confidence)*

- **Estimated net value preserved**: Equals expected salvage revenue plus
  avoided disposal cost minus additional rerouting transportation cost minus
  sorting and handling cost minus processing or destination fees. Boundary
  behavior: missing required financial inputs produce an incomplete estimate or
  Data unavailable, not a fabricated zero. Failure behavior: option cannot be
  financially recommended when the estimate cannot be produced and no manager
  override is confirmed.
- **Expected unrecovered value**: Equals original cargo value minus expected
  gross recovery value. Boundary behavior: the value cannot be negative unless
  an explicit manager-entered adjustment explains the exception. Failure
  behavior: display Data unavailable when original cargo value or gross recovery
  is unavailable.
- **Option viability**: Considers usable shelf life at arrival, food safety
  restrictions, destination acceptance, operational risk, and required data
  availability. Boundary behavior: options arriving after usable shelf life
  expires are Not viable. Failure behavior: missing safety-critical data
  prevents recommendation and may trigger manual review.
- **Recommendation ranking**: Prioritizes food safety first, then viable
  recovery and waste diversion within the decision deadline. Boundary behavior:
  composting recovery excludes original retail cargo value unless payment is
  explicitly available. Failure behavior: no automatic recommendation is made
  when all options are Not viable or confidence is too low.
- **Confidence**: Reflects data freshness, completeness, signal agreement, demo
  assumptions, and stale or missing telemetry. Boundary behavior: stale or
  missing telemetry reduces confidence or triggers manual review. Failure
  behavior: confidence displays as unavailable only when it cannot be assessed
  from disclosed inputs.

### Approval & Audit Requirements *(mandatory for consequential manager decisions)*

- **Approve recommendation**: Requires explicit confirmation and records
  approver, timestamp, selected destination, recommendation context, estimated
  value preserved, and resulting shipment status.
- **Request manual review**: Requires explicit confirmation and records
  requester, timestamp, reason when provided, current risk context, and shipment
  status.
- **Reject shipment or response**: Requires explicit confirmation and records
  approver, timestamp, rejection reason when provided, current recommendation
  context, and shipment status.
- **Compare alternatives**: Does not record a final decision until the manager
  confirms an action.

### Product Strengths Preservation *(mandatory when UI/workflow is touched)*

- **Truck/Pallet Visualization**: Preserved and available in the shipment
  workspace; verification requires comparing existing and updated shipment
  states.
- **Shipment Queue**: Preserved and enhanced with urgency ordering, status,
  freshness, deadline, shelf life, latest update, and change explanation;
  verification requires mixed-status queue testing.
- **Emerald Identity, Dark Mode, Responsive Behavior**: Preserved where
  currently supported; verification requires visual review across supported
  layouts and modes.
- **Simulation Workflow**: Preserved and enhanced with changing condition,
  recommendation, viability, confidence, and financial estimates; verification
  requires multi-step simulation testing.

### Key Entities *(include if feature involves data)*

- **Shipment**: A produce load being monitored, including commodity, planned
  destination, route timing, current workflow status, telemetry freshness, risk
  state, and decision deadline.
- **Condition Signal**: A measured, calculated, simulated, assumed, manager
  entered, or unavailable input that can affect risk, shelf life, confidence, or
  recommendation.
- **Risk Assessment**: The current risk status, top risk drivers, remaining
  shelf life, expected arrival condition, confidence, and provenance for inputs.
- **Response Option**: A possible operational action such as continuing
  delivery, secondary market, processing, composting, manual review, or
  rejection, with destination, viability, travel, condition, financial, waste
  diversion, and risk attributes.
- **Recommendation**: The single promoted response for a shipment, including
  action title, destination, rationale, deadline, financial effect, confidence,
  expected post-action risk, and status.
- **Financial Estimate**: A transparent estimate of gross recovery, cost
  avoidance, additional costs, unrecovered value, and estimated net value
  preserved, with provenance labels for inputs.
- **Decision Audit Record**: A record of a confirmed approve, manual review, or
  rejection decision, including actor, timestamp, selected action, destination
  when applicable, context, and resulting status.
- **Simulation Update**: A simulated change event that updates shipment
  condition, risk, shelf life, viability, financial estimate, confidence,
  recommendation, and change explanation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A manager can identify the highest-risk shipment in under 10
  seconds when viewing a queue with at least six mixed-status shipments.
- **SC-002**: At least 90% of representative managers can identify the primary
  risk drivers for an at-risk shipment without reading raw telemetry.
- **SC-003**: A manager can identify the recommended action, deadline, and
  estimated financial effect from the central shipment workspace in under 15
  seconds.
- **SC-004**: A manager can compare viable alternatives without leaving the
  shipment view.
- **SC-005**: 100% of important displayed assumptions and unavailable values are
  labeled by provenance or shown as Data unavailable.
- **SC-006**: 100% of final approve, manual review, and reject decisions require
  confirmation and produce an audit record.
- **SC-007**: Financial estimates update during worsening simulated spoilage,
  and expected recovery generally declines unless a visible assumption explains
  otherwise.
- **SC-008**: The existing truck and pallet visualization remains available and
  recognizable in the updated shipment workspace.
- **SC-009**: No fake map or fabricated route coordinates appear when reliable
  mapping data is unavailable.

## Assumptions

- The primary user is a logistics or site manager responsible for monitoring
  refrigerated produce shipments and approving operational responses.
- Existing shipment, telemetry, simulation, queue, recommendation, approval,
  and visualization concepts remain in scope and should be extended rather than
  replaced.
- Celsius remains the internal calculation unit, while all manager-facing
  temperature displays use degrees Fahrenheit.
- Demo scenarios may use simulated data and demo assumptions if each such value
  is labeled clearly.
- Real partner pricing, weather, traffic, and GPS integrations are out of scope
  unless already configured and reliable.
- When a material input is unavailable, the default behavior is disclosure,
  reduced confidence, option ineligibility, or manual review rather than
  substituting a normal value.
- The feature is intended to improve decision support and does not guarantee
  salvage revenue or savings.
