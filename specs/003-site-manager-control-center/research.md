# Research: WasteWatchers Site Manager Control Center

## Decision: Preserve Existing Next.js Dashboard and API Rewrite

The control center will keep the current `src/app/dashboard` route,
`DashboardClient.tsx`, `TrailerPalletVisualization.tsx`, `src/lib/api/client.ts`,
and the `/api/wastewatchers` rewrite configured in `next.config.ts`.

**Rationale**: The existing dashboard already has the core control center shape:
shipment queue, central workspace, truck/pallet visualization, simulation
controls, and a right-side decision summary placeholder. Preserving these paths
minimizes regression risk and honors the protected product strengths.

**Alternatives considered**:

- Add new dashboard route: rejected because it would duplicate the working
  control center and increase migration risk.
- Replace the Next.js rewrite with route handlers: rejected because no server
  logic is needed there, and the current rewrite keeps backend ownership in
  FastAPI.

## Decision: Keep Celsius Canonical and Convert Only in Shared Frontend Display Utility

Celsius remains the backend telemetry, threshold, shelf-life, and simulation
unit. Manager-facing Fahrenheit display will be handled in `src/lib/api/display.ts`
through shared formatting helpers.

**Rationale**: Existing backend models use `temperature_c`, safe bands in
Celsius, and shelf-life rules based on Celsius. Converting only at the
manager-facing display layer avoids formula drift and meets the constitution.

**Alternatives considered**:

- Store both Celsius and Fahrenheit in backend models: rejected because it
  duplicates canonical data and can create consistency errors.
- Convert inline in components: rejected because it scatters unit logic and
  makes testing harder.

## Decision: Add Rich Typed Models Additively

Extend `backend/src/models/demo.py` and `src/lib/api/types.ts` with typed models
for provenance, sensor status, risk drivers, confidence, destination type,
financial breakdowns, recommendation options, recommendation summaries, and
manager decisions.

**Rationale**: Existing Pydantic and TypeScript contracts are simple but stable.
Additive fields preserve the demo dashboard contract while enabling richer
manager workflow data. SQLite stores Pydantic payload JSON, so schema evolution
can remain additive.

**Alternatives considered**:

- Use raw dictionaries for option details: rejected by constitution and would
  weaken API/client contracts.
- Create a separate control-center API model tree unrelated to demo state:
  rejected because it would duplicate shipment and simulation data.

## Decision: Centralize Demo Destination Assumptions

Create `backend/src/config/destination_assumptions.py` to define documented demo
assumptions for farmers or secondary market, juice or food processor, compost
facility, and reject or dispose.

**Rationale**: Current demo scenario values embed protected value assumptions in
seed data. Centralizing destination assumptions prevents recovery percentages,
costs, fees, and acceptance assumptions from being scattered across components,
services, and tests.

**Alternatives considered**:

- Put assumptions directly in seeded shipments: rejected because it repeats the
  current hardcoded value problem.
- Load assumptions from an external service: rejected because real partner
  pricing integrations and credentials are out of scope.

## Decision: Add Backend Financial Calculation Service and Rules Module

Create centralized financial formulas in backend rules/services. The formulas
calculate expected gross recovery, rerouting cost, handling cost, processing or
destination fees, avoided disposal cost, expected unrecovered value, and
estimated net value preserved.

**Rationale**: Financial estimates must be transparent, testable, and reused by
recommendation ranking, simulation, and API responses. Backend ownership keeps
formula behavior consistent across clients while the frontend renders the typed
breakdown.

**Alternatives considered**:

- Calculate financials in React components: rejected because UI formulas would
  duplicate business logic.
- Keep only `value_protected_usd`: rejected because it is vague and hides
  recovery and cost avoidance.

## Decision: Separate Eligibility From Ranking

Recommendation logic will first determine option eligibility using food safety,
shelf life at arrival, destination acceptance, route time, and data
availability. Ranking will then choose among eligible options using operational
risk, net value preserved, waste diversion, and confidence.

**Rationale**: Food safety and shelf-life constraints must disqualify unsafe
options before financial value is considered. Separating eligibility from
ranking makes explanations clearer for managers and tests easier to write.

**Alternatives considered**:

- Single weighted score for all options: rejected because a high financial value
  could obscure a safety or shelf-life failure.
- Manual-only ranking: rejected because the feature requires a clear
  recommended action when confidence is sufficient.

## Decision: Extend Existing Demo Simulation Engine

`backend/src/simulation/demo_engine.py` will continue advancing demo shipment
state, but updates will also recompute option eligibility, acceptance,
financial estimates, confidence, and recommended destination.

**Rationale**: The existing simulation already changes temperature, shelf life,
risk, and deadlines. Extending that engine keeps demo progression in one place
and ensures financial values deteriorate with spoilage.

**Alternatives considered**:

- New simulation engine: rejected because the current engine is small and
  already integrated with service and persistence layers.
- Static option data: rejected because the spec requires worsening conditions
  to affect option availability and financial estimates.

## Decision: Preserve Existing Approval and Demo Decision Persistence

Use existing `RecommendationService.approve` and approval persistence for real
recommendations where practical. Use existing demo manager decision persistence
for demo approve, manual review, and reject actions, extending payloads
additively with selected option and financial context.

**Rationale**: The repository already has approval tables, approval models, and
demo decision event tables. Reuse avoids new storage and keeps audit behavior
consistent.

**Alternatives considered**:

- Create a new decision database: rejected as unnecessary complexity.
- Treat compare-alternatives as a persisted decision: rejected because the spec
  states comparison is not final until the manager confirms an action.

## Decision: No Map Without Real Coordinates

Route context will use route, ETA, delay, and destination cards when reliable
coordinates are unavailable. No map will be added for this feature.

**Rationale**: The spec explicitly forbids fabricated GPS coordinates and fake
maps. Current data supports route/destination cards but not reliable mapping.

**Alternatives considered**:

- Approximate map with generated coordinates: rejected because it fabricates
  operational data.
- Add external mapping service: rejected because it introduces external service
  dependencies and credentials outside the feature scope.

## Decision: Documentation Owns Assumption Replacement Guidance

Create `docs/site-manager-control-center.md` during implementation to document
unit handling, formulas, assumptions, provenance labels, supported spoilage
signals, unavailable integrations, recommendation ranking, and how demo
assumptions can be replaced with real customer data later.

**Rationale**: The feature relies on transparent demo assumptions. Documentation
must make clear what is demo-only and what would be required for production
customer data.

**Alternatives considered**:

- Put all explanation only in code comments: rejected because managers and
  future planners need a readable operational reference.
