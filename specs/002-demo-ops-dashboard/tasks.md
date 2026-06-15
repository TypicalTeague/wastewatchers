# Tasks: Demo Operations Dashboard

**Input**: Design documents from `/specs/002-demo-ops-dashboard/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/demo-openapi.yaml, quickstart.md
**Tests**: Required by feature specification SC-005 and quickstart validation.
**Organization**: Tasks are grouped by user story to keep each story independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete tasks
- **[Story]**: User story label for traceability
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing FastAPI, SQLite, pytest, and Streamlit project for additive demo work.

- [X] T001 Create demo backend module placeholders in backend/src/models/demo.py, backend/src/simulation/demo_scenarios.py, backend/src/simulation/demo_engine.py, backend/src/simulation/pallet_state.py, backend/src/services/demo_service.py, and backend/src/api/demo.py
- [X] T002 Create demo frontend component placeholders in frontend/components/control_center.py, frontend/components/pallet_visualization.py, frontend/components/telemetry_charts.py, and frontend/components/demo_controls.py
- [X] T003 [P] Create demo test placeholders in backend/tests/contract/test_demo_api_contract.py, backend/tests/integration/test_demo_scenario_flow.py, backend/tests/unit/test_demo_simulation.py, and frontend/tests/test_demo_dashboard_components.py
- [X] T004 [P] Add quickstart demo validation notes to docs/demo-ops-dashboard.md from specs/002-demo-ops-dashboard/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared data contracts, persistence, and API wiring that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Define DemoScenario, DemoShipmentState, DemoMetrics, SimulationStep, PresenterControlEvent, ManagerDecisionEvent, SimulationConfig, and ManagerDecisionRequest Pydantic models in backend/src/models/demo.py
- [X] T006 Extend backend/src/persistence/sqlite_store.py with demo scenario, shipment state, simulation step, presenter event, and manager decision persistence methods without changing existing shipment, telemetry, assessment, recommendation, or approval behavior
- [X] T007 Implement risk-level to pallet-color mapping and degraded telemetry visual state rules in backend/src/simulation/pallet_state.py
- [X] T008 Implement dashboard metric aggregation helpers for active, at-risk, critical, and value-protected totals in backend/src/services/demo_service.py
- [X] T009 Register additive /demo routes in backend/src/main.py through backend/src/api/demo.py without changing existing route behavior
- [X] T010 [P] Add demo API client method stubs for dashboard, scenario load/reset, simulation controls, presenter controls, and manager decisions in frontend/services/wastewatchers_client.py

**Checkpoint**: Foundation ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - Load a Complete Demo Scenario (Priority: P1) MVP

**Goal**: A presenter can load four realistic fictional shipments and never sees an empty raw table.

**Independent Test**: Start with no active demo records, load the scenario, and verify healthy, watch, at-risk, and critical salvage shipments appear with truck, trailer, pallet, crop, shelf-life, value, and destination details.

### Tests for User Story 1

- [X] T011 [P] [US1] Add contract tests for POST /demo/scenario/load, POST /demo/scenario/reset, and GET /demo/dashboard empty-state responses in backend/tests/contract/test_demo_api_contract.py
- [X] T012 [P] [US1] Add integration test for empty dashboard, scenario load, four distinct risk states, realistic shipment details, and reset behavior in backend/tests/integration/test_demo_scenario_flow.py
- [X] T013 [P] [US1] Add unit tests for deterministic seeded scenario generation and fictional data validation in backend/tests/unit/test_demo_scenarios.py
- [X] T014 [P] [US1] Add frontend tests for empty state, Load Demo Scenario action, control-center metrics, and four shipment cards in frontend/tests/test_demo_dashboard_components.py

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement deterministic four-shipment seed data with healthy, watch, at-risk, and critical salvage states in backend/src/simulation/demo_scenarios.py
- [X] T016 [US1] Implement load_demo_scenario, reset_demo_scenario, and get_dashboard_state service flows in backend/src/services/demo_service.py
- [X] T017 [US1] Implement POST /demo/scenario/load, POST /demo/scenario/reset, and GET /demo/dashboard endpoints in backend/src/api/demo.py
- [X] T018 [US1] Implement frontend client calls for load_demo_scenario, reset_demo_scenario, and get_demo_dashboard in frontend/services/wastewatchers_client.py
- [X] T019 [P] [US1] Implement logistics metrics and empty-state rendering helpers in frontend/components/control_center.py
- [X] T020 [P] [US1] Implement visual-only pallet condition rendering helpers in frontend/components/pallet_visualization.py
- [X] T021 [US1] Integrate empty state, Load Demo Scenario action, metrics, shipment cards, and pallet visualization into frontend/app.py

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Run Live Telemetry Simulation (Priority: P2)

**Goal**: A presenter can start live simulation with a configurable interval and judges can observe temperature, shelf-life, pallet-color, risk, and recommendation changes.

**Independent Test**: Load the demo scenario, start live simulation, and verify repeated steps generate readings, update history, recalculate shelf life, update pallet colors, cross risk thresholds, and refresh recommendations.

### Tests for User Story 2

- [ ] T022 [P] [US2] Add contract tests for POST /demo/simulation/start, POST /demo/simulation/pause, and POST /demo/simulation/step in backend/tests/contract/test_demo_api_contract.py
- [ ] T023 [P] [US2] Add integration test for live simulation interval changes, repeated state changes, and manual pause-plus-step fallback in backend/tests/integration/test_demo_simulation_flow.py
- [ ] T024 [P] [US2] Add unit tests for simulation ticks, shelf-life recalculation, temperature history growth, threshold crossings, and risk-to-color updates in backend/tests/unit/test_demo_simulation.py
- [ ] T025 [P] [US2] Add frontend tests for simulation controls, visible state refresh, safe temperature bands, and temperature history chart data in frontend/tests/test_demo_dashboard_components.py

### Implementation for User Story 2

- [ ] T026 [US2] Implement deterministic live and manual simulation step generation in backend/src/simulation/demo_engine.py
- [ ] T027 [US2] Integrate existing shelf-life and recommendation rules into simulation state updates in backend/src/services/demo_service.py
- [ ] T028 [US2] Persist simulation step history and generated telemetry readings through backend/src/persistence/sqlite_store.py
- [ ] T029 [US2] Implement start, pause, and advance-step simulation endpoints in backend/src/api/demo.py
- [ ] T030 [US2] Implement frontend client calls for start_demo_simulation, pause_demo_simulation, and advance_demo_simulation_step in frontend/services/wastewatchers_client.py
- [ ] T031 [P] [US2] Implement temperature history chart and safe-band rendering helpers in frontend/components/telemetry_charts.py
- [ ] T032 [US2] Integrate simulation controls, interval selector, manual refresh fallback, chart updates, and status messages into frontend/app.py

**Checkpoint**: User Stories 1 and 2 work independently.

---

## Phase 5: User Story 3 - Control Demo Conditions Manually (Priority: P3)

**Goal**: A presenter can trigger cooling failure, severe temperature spike, cooling recovery, telemetry outage, one-step advancement, pause, and reset with visible confirmations.

**Independent Test**: Load the demo scenario and use every manual control, verifying confirmation messages and shipment state changes after every action.

### Tests for User Story 3

- [ ] T033 [P] [US3] Add contract tests for POST /demo/controls/{shipment_id}/{control} valid controls and invalid control responses in backend/tests/contract/test_demo_api_contract.py
- [ ] T034 [P] [US3] Add integration test for cooling failure, temperature spike, restore cooling, telemetry outage, pause, advance step, and reset in backend/tests/integration/test_demo_presenter_controls.py
- [ ] T035 [P] [US3] Add unit tests for control-specific state transitions, telemetry outage manual-review mapping, and restore-cooling non-erasure of prior shelf-life damage in backend/tests/unit/test_demo_controls.py
- [ ] T036 [P] [US3] Add frontend tests for presenter control buttons, disabled states, and visible confirmation messages in frontend/tests/test_demo_controls.py

### Implementation for User Story 3

- [ ] T037 [US3] Implement presenter control transition handlers for cooling_failure, temperature_spike, restore_cooling, telemetry_outage, pause, advance_step, and reset in backend/src/simulation/demo_engine.py
- [ ] T038 [US3] Implement presenter control orchestration and event recording in backend/src/services/demo_service.py
- [ ] T039 [US3] Implement POST /demo/controls/{shipment_id}/{control} validation and response handling in backend/src/api/demo.py
- [ ] T040 [US3] Implement frontend client call for apply_demo_control in frontend/services/wastewatchers_client.py
- [ ] T041 [P] [US3] Implement presenter control button group, interval control, reset action, and confirmation rendering in frontend/components/demo_controls.py
- [ ] T042 [US3] Integrate presenter controls and degraded telemetry warning display into frontend/app.py

**Checkpoint**: User Stories 1, 2, and 3 work independently.

---

## Phase 6: User Story 4 - Act on Shipment Resolutions (Priority: P4)

**Goal**: A manager can approve reroutes, send shipments to manual review, or reject shipments with visible confirmation and updated metrics.

**Independent Test**: Select a shipment with an available recommendation, approve reroute, and verify confirmation messaging, changed shipment state, updated recommendation status, and refreshed control-center metrics.

### Tests for User Story 4

- [ ] T043 [P] [US4] Add contract tests for POST /demo/shipments/{shipment_id}/decision success and invalid recommendation cases in backend/tests/contract/test_demo_api_contract.py
- [ ] T044 [P] [US4] Add integration test for approve reroute, send manual review, reject shipment, confirmation messages, and metric refresh in backend/tests/integration/test_demo_manager_decisions.py
- [ ] T045 [P] [US4] Add unit tests for manager decision event records, prior/resulting status transitions, actor labels, and invalid-action guards in backend/tests/unit/test_demo_decisions.py
- [ ] T046 [P] [US4] Add frontend tests for manager action buttons, invalid-action disabled states, and updated recommendation panels in frontend/tests/test_demo_manager_actions.py

### Implementation for User Story 4

- [ ] T047 [US4] Implement approve_reroute, send_manual_review, and reject_shipment decision flows in backend/src/services/demo_service.py
- [ ] T048 [US4] Persist manager decision event history with actor label, timestamp, prior status, resulting status, and message in backend/src/persistence/sqlite_store.py
- [ ] T049 [US4] Implement POST /demo/shipments/{shipment_id}/decision endpoint validation and response handling in backend/src/api/demo.py
- [ ] T050 [US4] Implement frontend client call for apply_demo_manager_decision in frontend/services/wastewatchers_client.py
- [ ] T051 [P] [US4] Implement manager action controls and confirmation display in frontend/components/demo_controls.py
- [ ] T052 [US4] Integrate manager actions, recommendation status updates, and refreshed metrics into frontend/app.py

**Checkpoint**: All user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete demo flow and harden the implementation for a hackathon presentation.

- [ ] T053 [P] Add end-to-end quickstart coverage for the full demo flow in backend/tests/integration/test_demo_quickstart_flow.py
- [ ] T054 [P] Add frontend regression tests for no raw empty table, manual refresh fallback, and responsive dashboard layout in frontend/tests/test_demo_dashboard_components.py
- [ ] T055 Update README.md with demo dashboard run commands, API route summary, and reset guidance
- [ ] T056 Update docs/demo-ops-dashboard.md with presenter script, expected status transitions, and fallback manual-step procedure
- [ ] T057 Run python -m pytest backend/tests frontend/tests and fix failures in backend/src and frontend files
- [ ] T058 Run the quickstart backend and Streamlit demo flow from specs/002-demo-ops-dashboard/quickstart.md and document any environment-specific caveats in docs/demo-ops-dashboard.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; required for meaningful demo state and recommended MVP.
- **User Story 2 (P2)**: Starts after Foundational but needs seeded shipments from US1 for the normal demo path.
- **User Story 3 (P3)**: Starts after Foundational and is most useful after US1 seeded shipments exist.
- **User Story 4 (P4)**: Starts after Foundational and needs recommendation-bearing shipment state from US1/US2 for the primary approval path.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Models and simulation helpers before services.
- Services before API endpoints.
- API client methods before UI integration.
- Story complete before moving to the next priority checkpoint.

---

## Parallel Opportunities

- T003 and T004 can run in parallel with T001 and T002 once file ownership is clear.
- T010 can run in parallel with T005-T009 because it only adds client stubs.
- US1 tests T011-T014 can run in parallel before implementation.
- US1 implementation T015, T019, and T020 can run in parallel before T016-T018 and T021.
- US2 tests T022-T025 can run in parallel before implementation.
- US2 chart work T031 can run in parallel with backend simulation work T026-T029.
- US3 tests T033-T036 can run in parallel before implementation.
- US3 component work T041 can run in parallel with backend control work T037-T039.
- US4 tests T043-T046 can run in parallel before implementation.
- US4 manager action component work T051 can run in parallel with backend decision work T047-T049.
- Polish tasks T053 and T054 can run in parallel after the story phases are complete.

---

## Parallel Example: User Story 1

```powershell
# Launch US1 tests together:
Task: "T011 [P] [US1] Add contract tests for POST /demo/scenario/load, POST /demo/scenario/reset, and GET /demo/dashboard empty-state responses in backend/tests/contract/test_demo_api_contract.py"
Task: "T012 [P] [US1] Add integration test for empty dashboard, scenario load, four distinct risk states, realistic shipment details, and reset behavior in backend/tests/integration/test_demo_scenario_flow.py"
Task: "T013 [P] [US1] Add unit tests for deterministic seeded scenario generation and fictional data validation in backend/tests/unit/test_demo_scenarios.py"
Task: "T014 [P] [US1] Add frontend tests for empty state, Load Demo Scenario action, control-center metrics, and four shipment cards in frontend/tests/test_demo_dashboard_components.py"

# Launch independent implementation work:
Task: "T015 [P] [US1] Implement deterministic four-shipment seed data with healthy, watch, at-risk, and critical salvage states in backend/src/simulation/demo_scenarios.py"
Task: "T019 [P] [US1] Implement logistics metrics and empty-state rendering helpers in frontend/components/control_center.py"
Task: "T020 [P] [US1] Implement visual-only pallet condition rendering helpers in frontend/components/pallet_visualization.py"
```

## Parallel Example: User Story 2

```powershell
Task: "T022 [P] [US2] Add contract tests for POST /demo/simulation/start, POST /demo/simulation/pause, and POST /demo/simulation/step in backend/tests/contract/test_demo_api_contract.py"
Task: "T024 [P] [US2] Add unit tests for simulation ticks, shelf-life recalculation, temperature history growth, threshold crossings, and risk-to-color updates in backend/tests/unit/test_demo_simulation.py"
Task: "T031 [P] [US2] Implement temperature history chart and safe-band rendering helpers in frontend/components/telemetry_charts.py"
```

## Parallel Example: User Story 3

```powershell
Task: "T033 [P] [US3] Add contract tests for POST /demo/controls/{shipment_id}/{control} valid controls and invalid control responses in backend/tests/contract/test_demo_api_contract.py"
Task: "T035 [P] [US3] Add unit tests for control-specific state transitions, telemetry outage manual-review mapping, and restore-cooling non-erasure of prior shelf-life damage in backend/tests/unit/test_demo_controls.py"
Task: "T041 [P] [US3] Implement presenter control button group, interval control, reset action, and confirmation rendering in frontend/components/demo_controls.py"
```

## Parallel Example: User Story 4

```powershell
Task: "T043 [P] [US4] Add contract tests for POST /demo/shipments/{shipment_id}/decision success and invalid recommendation cases in backend/tests/contract/test_demo_api_contract.py"
Task: "T045 [P] [US4] Add unit tests for manager decision event records, prior/resulting status transitions, actor labels, and invalid-action guards in backend/tests/unit/test_demo_decisions.py"
Task: "T051 [P] [US4] Implement manager action controls and confirmation display in frontend/components/demo_controls.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the independent test: empty dashboard, load scenario, four distinct shipment states, and reset.
5. Demo the MVP if judges only need the seeded logistics-control-center view.

### Incremental Delivery

1. Complete Setup and Foundational work.
2. Add User Story 1, test independently, and demo seeded scenario loading.
3. Add User Story 2, test independently, and demo live telemetry changes.
4. Add User Story 3, test independently, and demo presenter-controlled failure and recovery.
5. Add User Story 4, test independently, and demo the manager decision loop.

### Parallel Team Strategy

1. Team completes Setup and Foundational tasks together.
2. Backend owner implements simulation/service/API tasks while frontend owner implements component/client tasks.
3. Test owner writes contract, integration, and UI tests ahead of implementation in each story.
4. Integrate per story at the checkpoint before starting the next priority.

---

## Notes

- [P] tasks use different files or independent test files.
- Tests are required because the feature specification explicitly requires automated coverage.
- Demo simulation, state transitions, risk/color mapping, and seeded data stay outside Streamlit UI components.
- Existing API behavior must remain intact; all new routes are additive under /demo.
