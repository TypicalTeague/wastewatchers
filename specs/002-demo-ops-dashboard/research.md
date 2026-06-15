# Phase 0 Research: Demo Operations Dashboard

## Decision: Use Additive `/demo/*` Endpoints

**Rationale**: The existing salvage rerouting API already supports telemetry,
shipment review, and approvals. Demo-specific behavior needs scenario loading,
simulation controls, reset, and dashboard view models. Keeping these behind
additive `/demo/*` endpoints preserves existing API behavior and makes demo
flows explicit.

**Alternatives considered**:
- Overload existing shipment endpoints: risks changing production-style
  behavior for demo-only needs.
- Drive demo entirely from Streamlit session state: duplicates business logic in
  the UI and bypasses existing persistence.
- Require manual Swagger calls: unsuitable for live judging.

## Decision: Deterministic Seeded Demo Scenario

**Rationale**: Hackathon demos must be repeatable. A deterministic scenario with
healthy, watch, at-risk, and critical salvage shipments guarantees useful
initial visuals and predictable transitions.

**Alternatives considered**:
- Random generated demo data: visually interesting but unreliable under time
  pressure.
- Manual fixture entry: too slow and error-prone.
- Reuse the existing two pilot shipments only: not enough contrast for a
  polished operations dashboard.

## Decision: Backend Simulation Engine with Manual Step Fallback

**Rationale**: Streamlit automatic refresh can vary by environment. The backend
will own simulation state and expose both live interval settings and a manual
step action. If automatic refresh is unstable, the presenter can pause and use
Advance One Step to show the same state transitions reliably.

**Alternatives considered**:
- UI timer only: unstable and duplicates simulation decisions in Streamlit.
- Background worker service: unnecessary for a local hackathon demo.
- Browser-side simulation: violates separation of concerns.

## Decision: Dedicated Pallet-State Mapping Module

**Rationale**: Pallet colors are business-facing representations of risk and
shelf-life state. A backend simulation helper maps risk to visual states so
charts/cards and tests share one source of truth.

**Alternatives considered**:
- Hardcode colors in Streamlit components: violates no-duplicated-business-logic
  constraint and makes tests weaker.
- Infer colors separately per component: risks inconsistent visual states.

## Decision: Extend Existing SQLite Store for Demo Events

**Rationale**: Existing persistence already stores shipments, telemetry,
assessments, recommendations, and approvals. Demo scenario metadata,
simulation-step history, presenter-control events, and manager decision events
can be added as lightweight tables without changing existing records.

**Alternatives considered**:
- Separate demo database: creates synchronization problems.
- In-memory-only demo state: reset is easy but audit and reload behavior are
  fragile.

## Decision: Manager Actions Use Existing Approval Flow Plus Additive Actions

**Rationale**: Approve reroute already exists. Manual review and rejection are
new demo actions that should update shipment/demo status and produce visible
confirmation messages without changing the existing approval endpoint contract.

**Alternatives considered**:
- Extend the approval endpoint to handle all decisions: would blur existing API
  behavior.
- UI-only action state: would not persist decision history or refresh metrics.

