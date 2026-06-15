---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Behavior changes require test or verification tasks before implementation. Use automated tests when available; document manual verification only when automation is not yet practical.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/` for FastAPI ingestion, Pydantic models, telemetry simulation, rules, and orchestration
- **Frontend**: `frontend/` for Streamlit UI, components, and service clients
- **Tests**: `backend/tests/` and `frontend/tests/`
- Paths shown below assume the required FastAPI + Streamlit structure - adjust only with constitution-approved justification in plan.md

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create FastAPI/Streamlit project structure per implementation plan
- [ ] T002 Initialize Python 3.12+ project with FastAPI, Streamlit, Pydantic, pytest dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup FastAPI routing and middleware structure in backend/src/api/
- [ ] T007 Create base Pydantic models/entities in backend/src/models/ that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management
- [ ] T010 Define data validation, access, retention, and privacy safeguards
- [ ] T011 Create separate telemetry simulation, rules engine, and Streamlit UI module boundaries

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Contract test for [endpoint] in backend/tests/contract/test_[name].py
- [ ] T013 [P] [US1] Integration test for [user journey] in backend/tests/integration/test_[name].py

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create [Entity1] Pydantic model in backend/src/models/[entity1].py
- [ ] T015 [P] [US1] Create [Entity2] Pydantic model in backend/src/models/[entity2].py
- [ ] T016 [US1] Implement rules/business logic in backend/src/rules/[rule].py (depends on T014, T015)
- [ ] T017 [US1] Implement FastAPI endpoint in backend/src/api/[route].py
- [ ] T018 [US1] Implement Streamlit UI/service client in frontend/[location]/[file].py
- [ ] T019 [US1] Add validation, error handling, logging, and recovery behavior

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2

- [ ] T020 [P] [US2] Contract test for [endpoint] in backend/tests/contract/test_[name].py
- [ ] T021 [P] [US2] Integration test for [user journey] in backend/tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create [Entity] Pydantic model in backend/src/models/[entity].py
- [ ] T023 [US2] Implement rules/business logic in backend/src/rules/[rule].py
- [ ] T024 [US2] Implement FastAPI endpoint in backend/src/api/[route].py
- [ ] T025 [US2] Integrate Streamlit UI/service client with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3

- [ ] T026 [P] [US3] Contract test for [endpoint] in backend/tests/contract/test_[name].py
- [ ] T027 [P] [US3] Integration test for [user journey] in backend/tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T028 [P] [US3] Create [Entity] Pydantic model in backend/src/models/[entity].py
- [ ] T029 [US3] Implement rules/business logic in backend/src/rules/[rule].py
- [ ] T030 [US3] Implement FastAPI endpoint or Streamlit UI in the appropriate separated module

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in backend/tests/unit/ or frontend/tests/
- [ ] TXXX Security hardening
- [ ] TXXX Privacy and data retention review
- [ ] TXXX Observability and recovery review
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests or documented verification MUST be written before implementation
- Pydantic models before services, rules, endpoints, or UI clients
- Rules and services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Contract test for [endpoint] in backend/tests/contract/test_[name].py"
Task: "Integration test for [user journey] in backend/tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] Pydantic model in backend/src/models/[entity1].py"
Task: "Create [Entity2] Pydantic model in backend/src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Do not pass typed API, telemetry, rules, or UI data as raw dictionaries
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
