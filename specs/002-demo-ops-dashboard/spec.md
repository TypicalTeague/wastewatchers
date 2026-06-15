# Feature Specification: Demo Operations Dashboard

**Feature Branch**: `002-demo-ops-dashboard`  
**Created**: 2026-06-15  
**Status**: Draft  
**Input**: User description: "Build a polished WasteWatchers logistics operations dashboard for hackathon demonstrations. The dashboard must provide realistic seeded demo data and a live telemetry simulation so judges can observe shipment conditions changing over time. The feature must include seeded demo scenario loading, live simulation mode, manual presenter controls, logistics-control-center visuals, interactive manager actions, visible state changes, separation of demo/simulation logic from UI components, helpful empty states, and automated tests."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Load a Complete Demo Scenario (Priority: P1)

A presenter needs to load a realistic WasteWatchers demo scenario with multiple
shipments in distinct operating states so judges immediately understand the
product value without manual setup.

**Why this priority**: A hackathon demo cannot start with an empty screen or
manual data entry; seeded data is the foundation for every other demo moment.

**Independent Test**: Start with no active demo records, choose Load Demo
Scenario, and verify the dashboard shows one healthy shipment, one watch-level
shipment, one at-risk shipment, and one critical salvage shipment with realistic
truck, trailer, pallet, crop, shelf-life, value, and destination details.

**Acceptance Scenarios**:

1. **Given** the dashboard has no active demo shipments, **When** the presenter
   loads the demo scenario, **Then** four realistic shipments appear with
   healthy, watch, at-risk, and critical salvage statuses.
2. **Given** no demo scenario has been loaded, **When** the presenter opens the
   dashboard, **Then** the page shows a helpful empty state and a clear Load Demo
   Scenario action instead of an empty raw table.

---

### User Story 2 - Run Live Telemetry Simulation (Priority: P2)

A presenter needs live simulation mode to change shipment conditions over time
so judges can observe temperature history, shelf-life, pallet color, risk
classification, and reroute recommendations update during the demo.

**Why this priority**: The dashboard must feel alive and show WasteWatchers
reacting to cold-chain changes without requiring separate API calls or hidden
setup.

**Independent Test**: Load the demo scenario, start live simulation with a
configured interval, and verify repeated simulation steps add trailer readings,
update temperature history, recalculate shelf life, update pallet colors, change
risk classification when thresholds are crossed, and refresh recommendations.

**Acceptance Scenarios**:

1. **Given** live simulation is running, **When** a shipment's temperature
   crosses a configured risk threshold, **Then** the shipment status, pallet
   color, remaining shelf life, and recommendation update on the dashboard.
2. **Given** the presenter changes the simulation interval, **When** live mode
   continues, **Then** new telemetry readings are generated at the selected
   cadence.

---

### User Story 3 - Control Demo Conditions Manually (Priority: P3)

A presenter needs manual controls to trigger dramatic demo moments, including
cooling failure, severe temperature spike, cooling recovery, telemetry outage,
single-step advancement, pause, and reset.

**Why this priority**: Presenter controls make the demo reliable under time
pressure and allow judges to see specific failure and recovery paths.

**Independent Test**: Load the demo scenario and use each manual control,
verifying visible confirmation messages and shipment state changes after every
action.

**Acceptance Scenarios**:

1. **Given** a shipment is healthy, **When** the presenter triggers a cooling
   failure or severe temperature spike, **Then** the shipment shows worsening
   temperature trend, reduced shelf life, changed pallet color, and updated
   risk state.
2. **Given** a shipment is in a failure state, **When** the presenter restores
   normal cooling, advances one step, pauses, or resets the simulation, **Then**
   the dashboard confirms the action and reflects the resulting state.
3. **Given** telemetry loss is simulated, **When** the dashboard refreshes,
   **Then** the affected shipment is visibly routed to manual review or a
   degraded-state warning instead of disappearing.

---

### User Story 4 - Act on Shipment Resolutions (Priority: P4)

A farm logistics manager needs interactive actions to approve reroutes, send
shipments to manual review, or reject shipments, with visible confirmations and
updated shipment statuses.

**Why this priority**: The dashboard must demonstrate the operational decision
loop, not only monitoring.

**Independent Test**: Select a shipment with an available recommendation, approve
the reroute, then verify confirmation messaging, changed shipment state, updated
recommendation status, and refreshed control-center metrics.

**Acceptance Scenarios**:

1. **Given** a critical salvage shipment has a recommended destination, **When**
   the manager approves reroute, **Then** the shipment status changes to reroute
   approved and the dashboard shows a confirmation message.
2. **Given** a shipment requires human judgment, **When** the manager sends it
   to manual review or rejects it, **Then** the shipment status and summary
   metrics update immediately.

---

### Edge Cases

- The dashboard is opened before any demo scenario has been loaded.
- The presenter starts live simulation while another simulation is already
  running.
- The presenter pauses live simulation and advances a single step manually.
- Telemetry outage is triggered for an already critical shipment.
- Cooling is restored after shelf life has already dropped below salvage
  viability.
- A manager action is attempted on a shipment with no valid recommendation.
- The demo scenario is reset after approvals or manual review decisions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Load Demo Scenario action that creates four
  realistic shipments: healthy, watch-level, at-risk, and critical salvage.
- **FR-002**: System MUST show a helpful empty state and clear Load Demo
  Scenario action when no demo data is available.
- **FR-003**: System MUST support live simulation mode with a configurable
  interval for generating new trailer temperature readings.
- **FR-004**: System MUST update temperature history, remaining shelf life,
  shipment risk classification, pallet color, and reroute recommendation after
  each simulation step.
- **FR-005**: System MUST provide presenter controls to trigger cooling failure,
  severe temperature spike, normal cooling recovery, telemetry outage, one-step
  advancement, pause, and reset.
- **FR-006**: System MUST show visible confirmation messages and updated
  shipment state after every presenter control or manager action.
- **FR-007**: System MUST display logistics-control-center metrics including
  active shipments, at-risk shipments, critical shipments, and estimated value
  protected.
- **FR-008**: System MUST display truck and trailer cards, pallet condition
  visualization, temperature history charts, safe temperature bands, remaining
  shelf life in hours and percentage, recommended salvage destination, and time
  remaining to act.
- **FR-009**: System MUST let managers approve reroute, send to manual review,
  or reject shipment where those actions are valid for the shipment state.
- **FR-010**: System MUST keep demo data generation and telemetry simulation
  logic separate from dashboard presentation components.
- **FR-011**: System MUST use the existing validated domain records, services,
  and persistent storage boundaries for demo shipments, telemetry, assessments,
  recommendations, and manager decisions.
- **FR-012**: System MUST let judges observe meaningful status and visual
  changes without requiring manual API calls or separate developer tools.

### Data, Privacy, and Recovery Requirements *(mandatory when data or operations are involved)*

- **DR-001**: Demo shipments MUST include realistic but fictional truck,
  trailer, pallet, crop, value, destination, temperature, and shelf-life data.
- **DR-002**: Simulation steps MUST persist enough temperature and decision
  history to explain visible dashboard changes during the demo.
- **DR-003**: Manager actions MUST record the action, actor label, timestamp,
  prior status, and resulting status for demo traceability.
- **OR-001**: Telemetry outage and reset behavior MUST leave the dashboard in a
  clear recoverable state with visible messages.

### Architecture Boundaries *(mandatory)*

- **AB-001**: Demo data generation MUST remain separate from dashboard UI
  components.
- **AB-002**: Telemetry simulation and state transition logic MUST remain
  separate from dashboard UI components.
- **AB-003**: Dashboard presentation MUST consume existing validated shipment,
  telemetry, shelf-life, recommendation, and decision records.

### Key Entities *(include if feature involves data)*

- **Demo Scenario**: A named seeded presentation setup containing multiple
  fictional shipments and initial simulation state.
- **Demo Shipment State**: The current visible state of a shipment, including
  risk level, pallet color, shelf life, value protected, and recommended action.
- **Simulation Step**: A generated change in telemetry or connectivity that
  updates shipment condition and dashboard state.
- **Presenter Control Event**: A manual action such as cooling failure,
  temperature spike, recovery, outage, pause, step, or reset.
- **Manager Decision Event**: A decision to approve reroute, send to manual
  review, or reject shipment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A presenter can load a complete four-shipment demo scenario in
  under 10 seconds from an empty dashboard.
- **SC-002**: Judges can observe at least three visible state changes within 60
  seconds of starting live simulation.
- **SC-003**: Presenter controls produce visible confirmation messages and
  updated shipment state within 2 seconds for 95% of demo actions.
- **SC-004**: The dashboard never displays an empty raw table; empty data states
  always show explanatory copy and a Load Demo Scenario action.
- **SC-005**: Automated tests cover seeded data generation, simulation state
  transitions, risk-to-color mapping, shelf-life recalculation, cooling failure
  and recovery, telemetry outage, approval state updates, and reset behavior.

## Assumptions

- Demo data is fictional and safe for public hackathon presentation.
- The presenter is the primary operator during judging, while manager actions
  represent farm logistics manager decisions.
- The simulation may use deterministic seeded scenarios so demo behavior is
  repeatable.
- The existing WasteWatchers shipment, telemetry, shelf-life, recommendation,
  approval, service, and persistence boundaries remain the source of truth.
- This feature extends the existing dashboard experience rather than replacing
  the core salvage rerouting workflow.
