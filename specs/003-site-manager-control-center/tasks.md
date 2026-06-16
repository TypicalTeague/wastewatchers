---

description: "Task list for WasteWatchers Site Manager Control Center implementation"
---

# Tasks: WasteWatchers Site Manager Control Center

**Input**: Design documents from `/specs/003-site-manager-control-center/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/control-center-openapi.yaml, quickstart.md

**Tests**: Required by the feature spec and WasteWatchers constitution. Write
happy path, boundary, and failure path tests before implementation work for
material calculations and manager workflows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US8)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Next.js dashboard**: `src/app/`, `src/lib/`
- **Feature docs**: `specs/003-site-manager-control-center/`, `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm brownfield context and create any missing test/documentation surfaces without changing behavior.

- [X] T001 Confirm current Next.js dashboard, API rewrite, and backend demo flow in src/app/dashboard/DashboardClient.tsx, src/lib/api/client.ts, next.config.ts, backend/src/api/demo.py
- [X] T002 Confirm local Next.js guidance for client components and error handling from node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md and node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md
- [X] T003 [P] Create frontend test directory and baseline display utility test file in src/lib/api/display.test.ts
- [X] T004 [P] Create documentation stub for unit handling, formulas, assumptions, provenance, unavailable integrations, and real-data replacement in docs/site-manager-control-center.md
- [X] T005 [P] Create backend config package marker for destination assumptions in backend/src/config/__init__.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared typed models, assumptions, formulas, and API contracts that must exist before user story implementation.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 [P] Add Pydantic enums and models for DataProvenance, DestinationType, OptionViability, SensorStatus, ConfidenceLevel, SensorFreshness, ConfidenceScore, RiskDriver, FinancialBreakdown, ResponseOption, RecommendedDecision, TimelineEvent, and extended ManagerDecisionRequest/Event in backend/src/models/demo.py
- [X] T007 [P] Add matching TypeScript types for provenance, sensor status, confidence, risk drivers, financial breakdowns, response options, recommended decisions, timeline events, and manager decision requests in src/lib/api/types.ts
- [X] T008 [P] Add shared Fahrenheit conversion and display helper tests for freezing, boundary decimals, safe range labels, unavailable display, and non-temperature currency formatting in src/lib/api/display.test.ts
- [X] T009 Add shared Fahrenheit conversion and manager-facing safe range helpers in src/lib/api/display.ts while preserving Celsius field names from API payloads
- [X] T010 [P] Add centralized demo destination assumptions for secondary market, food processor, compost facility, reject/dispose, and continue delivery in backend/src/config/destination_assumptions.py
- [X] T011 [P] Add backend financial calculation unit tests for gross recovery, rerouting cost, handling cost, destination fees, avoided disposal, unrecovered value, net value preserved, missing input failure, and cost avoidance separation in backend/tests/unit/test_financial_calculations.py
- [X] T012 Implement centralized financial formulas in backend/src/rules/financials.py and service wrapper in backend/src/services/financial_service.py
- [X] T013 [P] Add destination eligibility and ranking unit tests for food safety precedence, shelf life at arrival, acceptance, route time, operational risk, confidence, and net value in backend/tests/unit/test_destination_eligibility.py
- [X] T014 Extend recommendation eligibility and ranking rules in backend/src/rules/reroute.py using centralized financials and destination assumptions
- [X] T015 [P] Add API schema contract tests for extended /demo/dashboard payload and /demo/shipments/{shipment_id}/decision request validation in backend/tests/contract/test_control_center_contract.py
- [X] T016 Extend demo API contract implementation for additive dashboard fields and confirmed manager decision endpoint in backend/src/api/demo.py
- [X] T017 Update demo service composition to build extended dashboard state from shipments, assumptions, financials, eligibility, confidence, timeline, and existing persistence in backend/src/services/demo_service.py

**Checkpoint**: Typed contracts, Fahrenheit utility, centralized assumptions, financial formulas, eligibility/ranking rules, and additive API surface are ready for story work.

---

## Phase 3: User Story 1 - Review the Exception Queue (Priority: P1)

**Goal**: Site managers see shipments ordered worst first with urgency context, freshness, and change explanation.

**Independent Test**: Load mixed healthy, watch, at-risk, critical, approved, manual review, rejected, stale, and missing-data shipments; confirm ordering and queue row fields.

### Tests for User Story 1

- [X] T018 [P] [US1] Add backend queue ordering tests for risk, decision deadline, remaining shelf life, data freshness, approved/manual/rejected states, and tie-breakers in backend/tests/unit/test_control_center_queue.py
- [X] T019 [P] [US1] Add contract assertions for queue fields risk status, commodity, decision deadline, remaining shelf life, latest update, freshness, and change summary in backend/tests/contract/test_control_center_contract.py
- [X] T020 [P] [US1] Add frontend sorting/display tests for sortShipmentsByRisk and change/freshness labels in src/lib/api/display.test.ts

### Implementation for User Story 1

- [X] T021 [US1] Extend demo engine ordering and change summary generation for queue urgency in backend/src/simulation/demo_engine.py
- [X] T022 [US1] Extend dashboard state with sensor freshness, latest update, decision deadline, and change summary in backend/src/services/demo_service.py
- [X] T023 [US1] Update TypeScript queue rendering types and display helpers for status, freshness, deadline, shelf life, latest update, and change summary in src/lib/api/types.ts and src/lib/api/display.ts
- [X] T024 [US1] Update shipment queue UI while preserving the queue surface in src/app/dashboard/DashboardClient.tsx

**Checkpoint**: User Story 1 is independently testable from the queue without opening recommendation details.

---

## Phase 4: User Story 2 - Understand Shipment Condition (Priority: P1)

**Goal**: Site managers understand why a shipment is risky using Fahrenheit displays, shelf-life impact, strongest risk drivers, and provenance labels.

**Independent Test**: Open at-risk shipments with complete, stale, and missing signals; confirm temperatures, safe range, exposure, shelf life, top drivers, and Data unavailable behavior.

### Tests for User Story 2

- [X] T025 [P] [US2] Add frontend temperature display tests for shipment temperature, safe range, and technical Celsius exclusion in src/lib/api/display.test.ts
- [X] T026 [P] [US2] Add backend risk driver and unavailable signal tests in backend/tests/unit/test_risk_drivers.py
- [X] T027 [P] [US2] Add integration test for condition details with measured, calculated, simulated, assumed, and unavailable provenance labels in backend/tests/integration/test_control_center_condition.py

### Implementation for User Story 2

- [X] T028 [US2] Extend risk driver, exposure, severity, shelf-life-at-arrival, and unavailable signal derivation in backend/src/services/demo_service.py
- [X] T029 [US2] Extend demo scenario seed data with simulated condition metadata and missing/stale telemetry cases in backend/src/simulation/demo_scenarios.py
- [X] T030 [US2] Update truck visualization temperature and safe band display to use Fahrenheit helpers while preserving layout in src/app/dashboard/components/TrailerPalletVisualization.tsx
- [X] T031 [US2] Add primary risk driver, provenance, shelf-life-at-arrival, exposure, and Data unavailable sections to the central workspace in src/app/dashboard/DashboardClient.tsx

**Checkpoint**: User Story 2 can be verified by opening one shipment and reviewing condition evidence without using decision actions.

---

## Phase 5: User Story 3 - Receive a Clear Recommended Decision (Priority: P1)

**Goal**: Site managers see one prominent action-oriented recommendation in the main workspace and can confirm approve, manual review, or reject decisions with audit records.

**Independent Test**: Open a critical shipment with a viable response; confirm central recommendation, actions, confirmation, and approved decision state.

### Tests for User Story 3

- [X] T032 [P] [US3] Add recommendation summary contract tests for destination, rationale, deadline, travel time, condition at arrival, financial effect, confidence, and post-action risk in backend/tests/contract/test_control_center_contract.py
- [X] T033 [P] [US3] Add manager approval/manual review/rejection tests requiring confirmation and audit fields in backend/tests/integration/test_control_center_decisions.py
- [X] T034 [P] [US3] Add frontend client tests or typed request assertions for confirm manager decision payloads in src/lib/api/client.test.ts

### Implementation for User Story 3

- [X] T035 [US3] Generate action-oriented RecommendedDecision payloads from ranked options in backend/src/services/demo_service.py
- [X] T036 [US3] Implement confirmed manager decision handling using existing demo decision persistence and status transitions in backend/src/services/demo_service.py
- [X] T037 [US3] Add typed confirmDemoManagerDecision client call in src/lib/api/client.ts
- [X] T038 [US3] Move full Recommended Decision UI into the main workspace with approve, compare alternatives, manual review, and reject controls in src/app/dashboard/DashboardClient.tsx
- [X] T039 [US3] Add confirmation UI state and approved decision display for approver, timestamp, destination, expected value preserved, and shipment status in src/app/dashboard/DashboardClient.tsx

**Checkpoint**: User Story 3 is independently testable by confirming a decision on a critical shipment.

---

## Phase 6: User Story 8 - Preserve the Existing Visual Strengths (Priority: P1)

**Goal**: Preserve the recognizable control center, truck/pallet visualization, queue, emerald identity, simulation concept, responsive behavior, dark mode, and no-fake-map behavior.

**Independent Test**: Compare updated dashboard with existing states across desktop/mobile and dark mode; confirm protected surfaces remain.

### Tests for User Story 8

- [X] T040 [P] [US8] Add truck visualization preservation test for pallet slots, selected shipment behavior, and condition legend in frontend or documented visual regression checklist at specs/003-site-manager-control-center/visual-verification.md
- [X] T041 [P] [US8] Add no-fake-map assertion to quickstart/manual verification documentation in specs/003-site-manager-control-center/quickstart.md
- [X] T042 [P] [US8] Add dashboard route smoke test or documented responsive/dark mode checklist in specs/003-site-manager-control-center/visual-verification.md

### Implementation for User Story 8

- [X] T043 [US8] Refactor dashboard layout so truck visualization, queue, emerald identity, simulation controls, responsive behavior, and dark mode remain intact in src/app/dashboard/DashboardClient.tsx
- [X] T044 [US8] Keep route context as route, ETA, delay, and destination cards without map UI in src/app/dashboard/DashboardClient.tsx
- [X] T045 [US8] Update visual verification notes for preserved truck UI, queue, simulation concept, emerald identity, responsive behavior, dark mode, and no fake map in specs/003-site-manager-control-center/visual-verification.md

**Checkpoint**: User Story 8 is independently verifiable by visual/manual review of protected product surfaces.

---

## Phase 7: User Story 4 - Compare Response Options (Priority: P2)

**Goal**: Site managers compare viable and non-viable operational responses with clear tradeoffs.

**Independent Test**: Open a shipment with multiple possible responses and confirm options, viability labels, safety precedence, shelf-life cutoff, and compost rules.

### Tests for User Story 4

- [X] T046 [P] [US4] Add response option contract tests for all required option fields and viability labels in backend/tests/contract/test_control_center_contract.py
- [X] T047 [P] [US4] Add compost zero resale revenue and shelf-life expiration not-viable tests in backend/tests/unit/test_destination_eligibility.py
- [X] T048 [P] [US4] Add integration test for comparing continue delivery, secondary market, processor, compost, manual review, and reject/dispose options in backend/tests/integration/test_response_options.py

### Implementation for User Story 4

- [X] T049 [US4] Build response option generation for continue delivery, secondary market, processor, compost, manual review, and reject/dispose in backend/src/rules/reroute.py
- [X] T050 [US4] Add option viability reason and assumption output to dashboard payloads in backend/src/services/demo_service.py
- [X] T051 [US4] Add response option and viability display helpers in src/lib/api/display.ts
- [X] T052 [US4] Add Compare Response Options table/cards in the central workspace in src/app/dashboard/DashboardClient.tsx

**Checkpoint**: User Story 4 is independently testable by comparing options without approving a decision.

---

## Phase 8: User Story 5 - Understand the Financial Estimate (Priority: P2)

**Goal**: Site managers see how Estimated net value preserved is calculated and do not mistake assumptions for guaranteed savings.

**Independent Test**: Review financial impact for a shipment and confirm formula, breakdown, provenance labels, separate value recovery/cost avoidance, and decline as spoilage worsens.

### Tests for User Story 5

- [X] T053 [P] [US5] Add financial breakdown boundary tests for missing inputs, no guaranteed savings copy, expected unrecovered value, and recovery deterioration in backend/tests/unit/test_financial_calculations.py
- [X] T054 [P] [US5] Add frontend display tests replacing protected value copy with Estimated net value preserved in src/lib/api/display.test.ts
- [X] T055 [P] [US5] Add integration test verifying worsening spoilage lowers expected recovery or exposes an assumption explanation in backend/tests/integration/test_financial_progression.py

### Implementation for User Story 5

- [X] T056 [US5] Replace demo protected-value composition with FinancialBreakdown and estimated_net_value_preserved metrics in backend/src/services/demo_service.py
- [X] T057 [US5] Update seeded demo values to use destination assumptions and remove scattered protected-value assumptions in backend/src/simulation/demo_scenarios.py
- [X] T058 [US5] Replace manager-facing protected value labels with Estimated net value preserved and estimate disclaimer in src/lib/api/display.ts and src/app/dashboard/DashboardClient.tsx
- [X] T059 [US5] Add financial impact breakdown UI with original cargo value, acceptance, gross recovery, reroute cost, handling, fees, avoided disposal, unrecovered value, net preserved, and provenance labels in src/app/dashboard/DashboardClient.tsx

**Checkpoint**: User Story 5 is independently testable by reviewing financial detail without using simulation controls.

---

## Phase 9: User Story 6 - Use Multiple Spoilage Signals (Priority: P2)

**Goal**: Risk, recommendation rationale, and confidence reflect more than a single temperature reading when signals are available.

**Independent Test**: Evaluate shipments with different signal combinations and confirm unavailable signals are not fabricated, demo signals are simulated, and stale telemetry reduces confidence or triggers review.

### Tests for User Story 6

- [X] T060 [P] [US6] Add multi-signal risk tests for trend, duration, cumulative exposure, ETA, commodity tolerance, freshness, delays, destination acceptance, and capacity in backend/tests/unit/test_risk_drivers.py
- [X] T061 [P] [US6] Add confidence tests for missing/stale telemetry lowering confidence or requiring manual review in backend/tests/unit/test_confidence.py
- [X] T062 [P] [US6] Add integration test verifying material recommendation factors are visible and unavailable signals are disclosed in backend/tests/integration/test_multi_signal_recommendations.py

### Implementation for User Story 6

- [X] T063 [US6] Extend risk driver derivation to include available trend, duration, cumulative exposure, ETA, commodity tolerance, sensor freshness, delay, destination acceptance, and capacity signals in backend/src/services/demo_service.py
- [X] T064 [US6] Add confidence scoring logic using freshness, completeness, signal agreement, demo assumptions, and stale/missing telemetry in backend/src/rules/reroute.py
- [X] T065 [US6] Render material recommendation factors, confidence reason codes, and unavailable signal disclosures in src/app/dashboard/DashboardClient.tsx

**Checkpoint**: User Story 6 is independently testable by comparing confidence and rationale across complete and incomplete signal scenarios.

---

## Phase 10: User Story 7 - Monitor a Changing Disruption (Priority: P3)

**Goal**: Demo simulation updates condition, risk, option viability, financial estimates, confidence, recommendation destination, and what changed over time.

**Independent Test**: Run multiple simulation steps and confirm worsening conditions change risk, financials, options, confidence, and recommendation state.

### Tests for User Story 7

- [X] T066 [P] [US7] Add simulation progression tests for risk, option eligibility, acceptance rate, financial estimates, confidence, recommended destination, and change summaries in backend/tests/unit/test_demo_simulation.py
- [X] T067 [P] [US7] Add preserved value deterioration tests across simulation steps in backend/tests/integration/test_financial_progression.py
- [X] T068 [P] [US7] Add approved recommendation suppression test after simulation updates in backend/tests/integration/test_control_center_decisions.py

### Implementation for User Story 7

- [X] T069 [US7] Extend apply_simulation_step to recompute condition, risk, deadline, option eligibility, acceptance, financials, confidence, recommended destination, and change summaries in backend/src/simulation/demo_engine.py
- [X] T070 [US7] Persist and expose simulation financial changes, option viability changes, confidence changes, and recommendation destination changes in backend/src/services/demo_service.py
- [X] T071 [US7] Render latest simulated update and event timeline details in src/app/dashboard/DashboardClient.tsx
- [X] T072 [US7] Ensure approved, manual review, and rejected shipments do not show unapproved suggestions after simulation updates in backend/src/simulation/demo_engine.py

**Checkpoint**: User Story 7 is independently testable by running manual simulation steps after loading the demo scenario.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, contract cleanup, and full verification across the completed feature.

- [X] T073 Update docs/site-manager-control-center.md with unit handling, formulas, centralized assumptions, provenance labels, supported spoilage signals, unavailable integrations, recommendation ranking, and replacement of demo assumptions with real customer data
- [X] T074 Update specs/003-site-manager-control-center/quickstart.md with any final manual verification adjustments discovered during implementation
- [X] T075 Run npm run lint and record result in specs/003-site-manager-control-center/quickstart.md or implementation notes
- [X] T076 Run npm run build and record result in specs/003-site-manager-control-center/quickstart.md or implementation notes
- [X] T077 Run pytest backend/tests and record result in specs/003-site-manager-control-center/quickstart.md or implementation notes
- [X] T078 Confirm no credentials, API keys, real customer data, private partner data, or fabricated GPS coordinates were introduced in .env.example, .env.local.example, backend/src/config/destination_assumptions.py, and docs/site-manager-control-center.md
- [X] T079 Confirm all task checkboxes in specs/003-site-manager-control-center/tasks.md reflect actual implementation status before handoff

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **P1 stories (Phases 3-6)**: Depend on Foundational. US1, US2, US3, and US8 can proceed in parallel after shared models/services are ready, but dashboard file conflicts should be serialized.
- **P2 stories (Phases 7-9)**: Depend on relevant P1 model, recommendation, and dashboard surfaces.
- **P3 story (Phase 10)**: Depends on financial, eligibility, confidence, and decision state work from US3-US6.
- **Polish (Phase 11)**: Depends on all desired stories.

### User Story Dependencies

- **US1 Review the Exception Queue**: Can start after Foundational.
- **US2 Understand Shipment Condition**: Can start after Foundational; depends on Fahrenheit utility from T009.
- **US3 Receive a Clear Recommended Decision**: Can start after Foundational; depends on financial/ranking foundation from T012-T014.
- **US8 Preserve Existing Visual Strengths**: Can start after Foundational; coordinate dashboard edits with US1-US3.
- **US4 Compare Response Options**: Depends on T014 and US3 recommendation payloads.
- **US5 Understand the Financial Estimate**: Depends on T012 and US4 option financial fields.
- **US6 Use Multiple Spoilage Signals**: Depends on US2 risk driver model and US3 confidence payload.
- **US7 Monitor a Changing Disruption**: Depends on US4-US6 and US3 decision state behavior.

### Within Each User Story

- Tests must be written and fail before implementation tasks.
- Backend models/interfaces before service and UI work.
- Centralized rules/services before API or dashboard rendering.
- Contract/integration tests before endpoint/client changes.
- Dashboard edits in `src/app/dashboard/DashboardClient.tsx` should be sequenced to avoid same-file conflicts.

---

## Parallel Opportunities

- Setup tasks T003-T005 can run in parallel.
- Foundational model/type/config tests T006-T011 and T013/T015 can run in parallel by file.
- US1 tests T018-T020 can run in parallel before T021-T024.
- US2 tests T025-T027 can run in parallel before T028-T031.
- US3 tests T032-T034 can run in parallel before T035-T039.
- US8 verification tasks T040-T042 can run in parallel before T043-T045.
- US4 tests T046-T048 can run in parallel before T049-T052.
- US5 tests T053-T055 can run in parallel before T056-T059.
- US6 tests T060-T062 can run in parallel before T063-T065.
- US7 tests T066-T068 can run in parallel before T069-T072.

---

## Parallel Example: User Story 3

```bash
Task: "T032 [P] [US3] Add recommendation summary contract tests in backend/tests/contract/test_control_center_contract.py"
Task: "T033 [P] [US3] Add manager approval/manual review/rejection tests in backend/tests/integration/test_control_center_decisions.py"
Task: "T034 [P] [US3] Add frontend client tests or typed request assertions in src/lib/api/client.test.ts"
```

## Parallel Example: User Story 5

```bash
Task: "T053 [P] [US5] Add financial breakdown boundary tests in backend/tests/unit/test_financial_calculations.py"
Task: "T054 [P] [US5] Add frontend display tests in src/lib/api/display.test.ts"
Task: "T055 [P] [US5] Add integration test in backend/tests/integration/test_financial_progression.py"
```

---

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1, US2, US3, and US8 as the MVP because the highest-risk queue,
   credible condition explanation, central recommendation, and preserved visual
   strengths are all P1.
3. Stop and validate the dashboard can identify the highest-risk shipment,
   explain risk drivers, show the central recommendation, and preserve the truck
   visualization.

### Incremental Delivery

1. Foundation: typed contracts, Fahrenheit display, assumptions, financials,
   eligibility, API decision endpoint.
2. P1: queue triage, condition explanation, central recommendation, preserved
   product strengths.
3. P2: response option comparison, financial transparency, multi-signal risk.
4. P3: changing disruption simulation.
5. Polish: documentation, lint, production build, backend tests, and secrets/data audit.

### Format Validation

All task lines above use the required checklist format:

```text
- [X] T### [P?] [US?] Description with file path
```
