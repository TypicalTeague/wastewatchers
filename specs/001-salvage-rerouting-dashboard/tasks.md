# Tasks: Salvage Rerouting Dashboard

**Input**: Design documents from `/specs/001-salvage-rerouting-dashboard/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Required by the constitution and implementation plan. Contract, integration, and rules tests must be written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/` for FastAPI ingestion, Pydantic models, telemetry simulation, rules, services, and persistence
- **Frontend**: `frontend/` for Streamlit UI, components, and service clients
- **Tests**: `backend/tests/` and `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the Python project skeleton, dependency metadata, and module boundaries.

- [X] T001 Create Python package and app directory structure in `backend/src/`, `backend/tests/`, `frontend/`, and `frontend/tests/`
- [X] T002 Create project dependency metadata with Python 3.12+, FastAPI, Streamlit, Pydantic, pytest, httpx, and uvicorn in `pyproject.toml`
- [X] T003 [P] Create backend package initializers in `backend/__init__.py`, `backend/src/__init__.py`, `backend/src/models/__init__.py`, `backend/src/api/__init__.py`, `backend/src/rules/__init__.py`, `backend/src/services/__init__.py`, `backend/src/persistence/__init__.py`, and `backend/src/simulation/__init__.py`
- [X] T004 [P] Create frontend package initializers in `frontend/__init__.py`, `frontend/components/__init__.py`, `frontend/services/__init__.py`, and `frontend/tests/__init__.py`
- [X] T005 [P] Configure pytest path and test discovery in `pytest.ini`
- [X] T006 [P] Create sample environment configuration documentation in `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared contracts, persistence, fixtures, and app bootstrap required before any user story can run.

**Critical**: No user story work can begin until this phase is complete.

- [X] T007 Create shared enum and constrained scalar models for decision state, urgency, transit state, temperature range, and timestamps in `backend/src/models/common.py`
- [X] T008 [P] Create Shipment and CommodityThermalProfile Pydantic models in `backend/src/models/shipment.py` and `backend/src/models/commodity.py`
- [X] T009 [P] Create TrailerTelemetryReading and TelemetryIngestResult Pydantic models in `backend/src/models/telemetry.py`
- [X] T010 [P] Create ShelfLifeAssessment Pydantic model in `backend/src/models/assessment.py`
- [X] T011 [P] Create RerouteRecommendation, ApprovalCreate, and ApprovalRecord Pydantic models in `backend/src/models/approval.py`
- [X] T012 Create SQLite repository interface and schema initialization for shipments, telemetry, profiles, assessments, recommendations, and approvals in `backend/src/persistence/sqlite_store.py`
- [X] T013 Create deterministic seed commodity profiles and pilot shipment fixtures in `backend/src/persistence/seed_data.py`
- [X] T014 Create FastAPI application bootstrap with router registration and dependency wiring in `backend/src/main.py`
- [X] T015 Create shared API error response handling for validation, not found, conflict, and manual follow-up conditions in `backend/src/api/errors.py`
- [X] T016 [P] Create backend test fixtures for in-memory SQLite, sample shipments, commodity profiles, and telemetry readings in `backend/tests/conftest.py`
- [X] T017 [P] Create frontend service client base with typed response parsing and error handling in `frontend/services/wastewatchers_client.py`

**Checkpoint**: Foundation ready; user story implementation can begin.

---

## Phase 3: User Story 1 - Detect At-Risk Shipments (Priority: P1)

**Goal**: Ingest trailer temperature telemetry, evaluate it against commodity thermal profiles, and classify shipment risk with remaining shelf life.

**Independent Test**: Feed a shipment with live trailer temperature readings and a known commodity profile, then verify the shipment is classified with an updated remaining shelf-life estimate and risk status.

### Tests for User Story 1

- [X] T018 [P] [US1] Write contract tests for `POST /telemetry/readings` success and validation errors in `backend/tests/contract/test_telemetry_ingest_contract.py`
- [X] T019 [P] [US1] Write unit tests for shelf-life calculations covering in-range, out-of-range, severe excursion, stale reading, and missing profile cases in `backend/tests/unit/test_shelf_life_rules.py`
- [X] T020 [P] [US1] Write integration test for telemetry ingestion updating shipment risk and assessment records in `backend/tests/integration/test_detect_at_risk_shipments.py`

### Implementation for User Story 1

- [X] T021 [P] [US1] Implement shelf-life calculation rules using CommodityThermalProfile and TrailerTelemetryReading models in `backend/src/rules/shelf_life.py`
- [X] T022 [P] [US1] Implement telemetry simulation scenarios for healthy, cooling-failure, duplicate, and out-of-order readings in `backend/src/simulation/trailer_feed.py`
- [X] T023 [US1] Implement telemetry persistence and idempotent reading ingestion in `backend/src/services/telemetry_service.py`
- [X] T024 [US1] Implement shipment assessment orchestration and decision-state updates in `backend/src/services/shipment_service.py`
- [X] T025 [US1] Implement `POST /telemetry/readings` endpoint in `backend/src/api/telemetry.py`
- [X] T026 [US1] Register telemetry routes and startup seed loading in `backend/src/main.py`
- [X] T027 [US1] Add manual follow-up recovery for missing profiles, stale telemetry, and invalid calculations in `backend/src/services/shipment_service.py`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Review Resolution Options (Priority: P2)

**Goal**: Present a dashboard-ready view of at-risk shipments, remaining shelf life, urgency, and salvage recommendations.

**Independent Test**: Create multiple at-risk shipments with different commodities and shelf-life outcomes, then verify the dashboard ranks or groups them by urgency and displays the available salvage resolution for each.

### Tests for User Story 2

- [X] T028 [P] [US2] Write contract tests for `GET /shipments/at-risk` and `GET /shipments/{shipment_id}` in `backend/tests/contract/test_dashboard_shipments_contract.py`
- [X] T029 [P] [US2] Write unit tests for reroute recommendation eligibility, urgency, expiration, and not-viable outcomes in `backend/tests/unit/test_reroute_rules.py`
- [X] T030 [P] [US2] Write integration test for dashboard records ordering urgent shipments before lower-risk shipments in `backend/tests/integration/test_resolution_dashboard.py`
- [X] T031 [P] [US2] Write Streamlit component smoke tests for shipment table and recommendation panel rendering typed dashboard records in `frontend/tests/test_dashboard_components.py`

### Implementation for User Story 2

- [X] T032 [P] [US2] Implement reroute recommendation rules using ShelfLifeAssessment and Shipment models in `backend/src/rules/reroute.py`
- [X] T033 [US2] Implement recommendation generation and persistence in `backend/src/services/recommendation_service.py`
- [X] T034 [US2] Implement dashboard query methods for at-risk shipment summaries and shipment detail in `backend/src/services/shipment_service.py`
- [X] T035 [US2] Implement `GET /shipments/at-risk` and `GET /shipments/{shipment_id}` endpoints in `backend/src/api/shipments.py`
- [X] T036 [US2] Add typed frontend client methods for at-risk shipment list and shipment detail in `frontend/services/wastewatchers_client.py`
- [X] T037 [P] [US2] Implement shipment urgency table component in `frontend/components/shipment_table.py`
- [X] T038 [P] [US2] Implement recommendation detail panel component in `frontend/components/recommendation_panel.py`
- [X] T039 [US2] Implement Streamlit dashboard page showing at-risk shipments and selected recommendation details in `frontend/app.py`

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - Approve Salvage Rerouting (Priority: P3)

**Goal**: Allow a farm logistics manager to approve a viable salvage reroute in one deliberate action and record an auditable decision.

**Independent Test**: Select an at-risk shipment with a recommended reroute, approve the resolution, and verify the shipment changes to an approved reroute state with an auditable decision record.

### Tests for User Story 3

- [X] T040 [P] [US3] Write contract tests for `POST /recommendations/{recommendation_id}/approve` success, not found, and conflict responses in `backend/tests/contract/test_approval_contract.py`
- [X] T041 [P] [US3] Write unit tests for approval eligibility before arrival, expired recommendation rejection, duplicate approval rejection, and missing destination handling in `backend/tests/unit/test_approval_rules.py`
- [X] T042 [P] [US3] Write integration test for approving a reroute and recording approval state in `backend/tests/integration/test_approve_reroute.py`
- [X] T043 [P] [US3] Write frontend service client test for approval success and conflict error handling in `frontend/tests/test_approval_client.py`

### Implementation for User Story 3

- [X] T044 [US3] Implement approval validation and state transition logic in `backend/src/services/recommendation_service.py`
- [X] T045 [US3] Implement approval record persistence and one-approval-per-recommendation constraint in `backend/src/persistence/sqlite_store.py`
- [X] T046 [US3] Implement `POST /recommendations/{recommendation_id}/approve` endpoint in `backend/src/api/approvals.py`
- [X] T047 [US3] Register approval routes in `backend/src/main.py`
- [X] T048 [US3] Add typed frontend client method for approval submission in `frontend/services/wastewatchers_client.py`
- [X] T049 [US3] Add one-click approval action and conflict/manual-follow-up messaging to `frontend/components/recommendation_panel.py`
- [X] T050 [US3] Wire dashboard approval refresh behavior in `frontend/app.py`

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate quickstart, improve operational quality, and close traceability gaps.

- [X] T051 [P] Add README usage notes linking to the feature quickstart in `README.md`
- [X] T052 [P] Add structured logging around telemetry ingestion, assessment generation, recommendation generation, and approvals in `backend/src/services/telemetry_service.py`, `backend/src/services/shipment_service.py`, and `backend/src/services/recommendation_service.py`
- [X] T053 [P] Add retention and privacy notes for telemetry, shipment, and approval records in `docs/data-retention.md`
- [X] T054 Add quickstart validation test or script covering backend startup import, simulation command import, and frontend import in `backend/tests/integration/test_quickstart_flow.py`
- [X] T055 Run full test suite and record validation outcome in `specs/001-salvage-rerouting-dashboard/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundation; delivers MVP risk detection.
- **User Story 2 (Phase 4)**: Depends on Foundation and benefits from US1 assessment behavior; dashboard can be validated with fixtures.
- **User Story 3 (Phase 5)**: Depends on US2 recommendation behavior.
- **Polish (Phase 6)**: Depends on all desired user stories.

### User Story Dependencies

- **US1 Detect At-Risk Shipments**: MVP and prerequisite for real telemetry-driven dashboard data.
- **US2 Review Resolution Options**: Uses US1 assessments and can be developed with seeded at-risk fixtures.
- **US3 Approve Salvage Rerouting**: Requires recommendations from US2.

### Within Each User Story

- Tests first; confirm failures before implementation.
- Pydantic models and repository behavior before services.
- Rules before service orchestration.
- Services before endpoints.
- Backend contracts before frontend integration.

---

## Parallel Opportunities

- T003-T006 can run in parallel after T001.
- T008-T011, T016, and T017 can run in parallel after T007.
- US1 tests T018-T020 can run in parallel.
- US1 implementation T021 and T022 can run in parallel after tests are written.
- US2 tests T028-T031 can run in parallel.
- US2 implementation T032, T037, and T038 can run in parallel after tests are written.
- US3 tests T040-T043 can run in parallel.
- Polish tasks T051-T053 can run in parallel after story implementation.

## Parallel Example: User Story 1

```bash
Task: "T018 [P] [US1] Write contract tests for POST /telemetry/readings in backend/tests/contract/test_telemetry_ingest_contract.py"
Task: "T019 [P] [US1] Write unit tests for shelf-life calculations in backend/tests/unit/test_shelf_life_rules.py"
Task: "T020 [P] [US1] Write integration test for telemetry ingestion in backend/tests/integration/test_detect_at_risk_shipments.py"
```

## Parallel Example: User Story 2

```bash
Task: "T028 [P] [US2] Write contract tests for dashboard endpoints in backend/tests/contract/test_dashboard_shipments_contract.py"
Task: "T029 [P] [US2] Write unit tests for reroute rules in backend/tests/unit/test_reroute_rules.py"
Task: "T031 [P] [US2] Write Streamlit component smoke tests in frontend/tests/test_dashboard_components.py"
```

## Parallel Example: User Story 3

```bash
Task: "T040 [P] [US3] Write approval endpoint contract tests in backend/tests/contract/test_approval_contract.py"
Task: "T041 [P] [US3] Write approval rules tests in backend/tests/unit/test_approval_rules.py"
Task: "T043 [P] [US3] Write frontend approval client tests in frontend/tests/test_approval_client.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for telemetry ingestion and at-risk shipment detection.
3. Validate US1 independently with contract, unit, and integration tests.
4. Demo telemetry ingestion moving a shipment into watch, at-risk, or manual follow-up.

### Incremental Delivery

1. Deliver US1 risk detection.
2. Add US2 dashboard review and salvage recommendation visibility.
3. Add US3 approval and audit record behavior.
4. Run quickstart and full test suite after each increment.

### Format Validation

- All tasks use `- [ ] T###` checklist format.
- All user story phase tasks include `[US1]`, `[US2]`, or `[US3]`.
- All task descriptions include concrete file paths.
- Tests precede implementation in each user story.
