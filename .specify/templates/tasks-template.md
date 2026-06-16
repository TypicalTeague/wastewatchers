---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED for every material calculation and manager
workflow. Include happy path, boundary, and failure path tests before
implementation tasks for temperature conversion, financial calculations,
recommendation eligibility, risk changes, simulation behavior, approval state
transitions, and any touched protected dashboard surface.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Next.js dashboard**: `src/app/`, `src/lib/`
- **Legacy Streamlit demo**: `frontend/`
- **Feature docs**: `specs/[###-feature-name]/`

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  - WasteWatchers constitution requirements for provenance, calculations,
    Fahrenheit display, approval audit, preservation, and testing

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Confirm existing backend, Next.js dashboard, and affected legacy Streamlit paths
- [ ] T002 Confirm relevant Next.js docs in node_modules/next/dist/docs/ before editing Next.js code
- [ ] T003 [P] Configure or verify linting, formatting, and test commands

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Create or update typed Pydantic models and TypeScript interfaces shared by all stories
- [ ] T005 [P] Create or update shared Celsius-to-Fahrenheit display utility
- [ ] T006 [P] Create or update centralized calculation utilities for financials, risk, shelf life, ranking, or confidence
- [ ] T007 Create or update provenance model fields and unavailable-value handling
- [ ] T008 Configure error handling, logging, and manager-visible recovery paths
- [ ] T009 Setup or update approval audit state handling
- [ ] T010 Confirm no secrets, customer data, API keys, or private partner data are introduced

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Contract test for [endpoint] in backend/tests/contract/test_[name].py
- [ ] T012 [P] [US1] Integration test for [user journey] in backend/tests/integration/test_[name].py
- [ ] T013 [P] [US1] Unit tests for [temperature/financial/risk/recommendation/approval] happy, boundary, and failure paths in backend/tests/unit/test_[name].py
- [ ] T014 [P] [US1] Frontend test or documented verification for touched truck, queue, simulation, emerald, dark mode, or responsive behavior

### Implementation for User Story 1

- [ ] T015 [P] [US1] Create or update typed model/interface in [exact path]
- [ ] T016 [US1] Implement centralized service/rule/calculation in [exact path]
- [ ] T017 [US1] Implement API or frontend workflow in [exact path]
- [ ] T018 [US1] Add provenance labeling and unavailable-value behavior
- [ ] T019 [US1] Add explicit approval/audit behavior when the story includes a consequential decision
- [ ] T020 [US1] Preserve or extend protected UI/workflow surface when affected

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2

- [ ] T021 [P] [US2] Contract test for [endpoint] in backend/tests/contract/test_[name].py
- [ ] T022 [P] [US2] Integration test for [user journey] in backend/tests/integration/test_[name].py
- [ ] T023 [P] [US2] Unit tests for relevant happy, boundary, and failure paths in backend/tests/unit/test_[name].py
- [ ] T024 [P] [US2] Frontend test or documented preservation verification when UI is touched

### Implementation for User Story 2

- [ ] T025 [P] [US2] Create or update typed model/interface in [exact path]
- [ ] T026 [US2] Implement centralized service/rule/calculation in [exact path]
- [ ] T027 [US2] Implement API or frontend workflow in [exact path]
- [ ] T028 [US2] Integrate with User Story 1 components without breaking independent testability

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3

- [ ] T029 [P] [US3] Contract test for [endpoint] in backend/tests/contract/test_[name].py
- [ ] T030 [P] [US3] Integration test for [user journey] in backend/tests/integration/test_[name].py
- [ ] T031 [P] [US3] Unit tests for relevant happy, boundary, and failure paths in backend/tests/unit/test_[name].py
- [ ] T032 [P] [US3] Frontend test or documented preservation verification when UI is touched

### Implementation for User Story 3

- [ ] T033 [P] [US3] Create or update typed model/interface in [exact path]
- [ ] T034 [US3] Implement centralized service/rule/calculation in [exact path]
- [ ] T035 [US3] Implement API or frontend workflow in [exact path]

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit, integration, contract, or frontend tests required by the constitution in tests/
- [ ] TXXX Security hardening
- [ ] TXXX Confirm no secrets, real customer data, API keys, or private partner data are committed
- [ ] TXXX Run frontend linting
- [ ] TXXX Run frontend production build
- [ ] TXXX Run all available backend tests
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 -> P2 -> P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Required tests MUST be written and FAIL before implementation
- Models and interfaces before services
- Services and centralized rules before endpoints or UI workflow code
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models/interfaces within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Contract test for [endpoint] in backend/tests/contract/test_[name].py"
Task: "Integration test for [user journey] in backend/tests/integration/test_[name].py"
Task: "Unit tests for [calculation/workflow] in backend/tests/unit/test_[name].py"

# Launch model/interface work together:
Task: "Update Pydantic model in backend/src/models/[entity].py"
Task: "Update TypeScript interface in src/lib/api/types.ts"
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

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test independently -> Deploy/Demo
3. Add User Story 2 -> Test independently -> Deploy/Demo
4. Add User Story 3 -> Test independently -> Deploy/Demo
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
- Verify required tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
