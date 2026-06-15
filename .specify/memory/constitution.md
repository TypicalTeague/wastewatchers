<!--
Sync Impact Report
Version change: 0.0.0 -> 1.0.0
Modified principles:
- Placeholder principles -> I. User-Value Slices
- Placeholder principles -> II. Test-First Confidence
- Placeholder principles -> III. Explicit Data and Privacy Boundaries
- Placeholder principles -> IV. Observable and Recoverable Operations
- Placeholder principles -> V. Simplicity and Spec Traceability
Added sections:
- Product and Technical Constraints
- Development Workflow
Removed sections:
- None
Templates requiring updates:
- Updated: .specify/templates/plan-template.md
- Updated: .specify/templates/spec-template.md
- Updated: .specify/templates/tasks-template.md
- Not present: .specify/templates/commands/*.md
Follow-up TODOs:
- None
-->
# WasteWatchers Constitution

## Core Principles

### I. User-Value Slices
Every feature MUST be specified as independently deliverable user stories ordered
by user value. Each P1 story MUST be demonstrable without depending on optional
later stories, and every story MUST include an independent test method and
acceptance scenarios. Rationale: the project must stay focused on working
capabilities rather than broad, unfinished scaffolding.

### II. Test-First Confidence
Every code change that implements behavior MUST start with a failing automated
test or a documented manual verification when automation is not yet available.
Contract and integration tests MUST cover external interfaces, persistence
behavior, and cross-component workflows. Rationale: waste tracking workflows can
affect operational decisions, so behavior must be reproducible before it is
trusted.

### III. Explicit Data and Privacy Boundaries
Plans and specs MUST identify persisted data, retention expectations, access
rules, and any personal, household, location, vendor, or operational data
handled by the feature. Features MUST minimize collected data and MUST not add
new sensitive fields without a stated purpose and validation rule. All API
requests and internal data transfer between modules MUST use Pydantic models;
raw dictionaries MUST NOT be used for typed domain or request data. Rationale:
the domain can combine routine activity data into sensitive behavioral records,
and strict models keep validation behavior explicit.

### IV. Observable and Recoverable Operations
Features that perform imports, exports, synchronization, background work,
notifications, or irreversible state changes MUST define logging, error
handling, retry or rollback behavior, and user-visible recovery paths. Rationale:
operators and users need clear evidence of what happened and a practical way to
recover from failures.

### V. Simplicity and Spec Traceability
Implementation MUST use the smallest architecture that satisfies the current
spec and MUST trace code, tests, and tasks back to requirements and user
stories. New frameworks, services, background jobs, and abstractions MUST be
justified in the implementation plan with a rejected simpler alternative.
Rationale: early project momentum depends on avoiding speculative architecture
while preserving accountability from specification to delivery.

## Product and Technical Constraints

The project MUST keep feature specs technology-agnostic until the implementation
plan records the selected stack, runtime, storage, test tools, and deployment
target. Any feature that stores or transmits data MUST define entity ownership,
validation rules, and error states before implementation begins.

The implementation stack is Python 3.12 or newer. The telemetry ingestion
backend MUST use FastAPI. The logistics frontend MUST use Streamlit. API
requests, API responses, telemetry payloads, rule-engine inputs, rule-engine
outputs, and UI-facing data contracts MUST be represented as Pydantic models
instead of raw dictionaries.

The architecture MUST remain modular with strict separation of concerns.
Telemetry simulation, business logic and rules, API ingestion, shared schemas,
and UI code MUST live in separate files or modules. A feature plan MUST identify
the concrete files or modules that own each concern before implementation.

The repository currently uses Spec Kit with Codex integration and sequential git
feature branch numbering. Generated feature artifacts MUST live under
`specs/[###-feature-name]/`, and plans MUST replace template option blocks with
the actual source and test paths chosen for the feature.

## Development Workflow

Work MUST proceed through specification, planning, task generation, and
implementation unless a change is explicitly documentation-only or operational.
The Constitution Check in each plan MUST pass before Phase 0 research and MUST
be re-checked after Phase 1 design.

Tasks MUST be grouped by user story, preserve MVP-first delivery, and include
test or verification tasks before implementation tasks for each story. Cross-
cutting concerns such as privacy, observability, migration, and recovery MUST be
represented as explicit tasks when applicable.

## Governance

This constitution supersedes conflicting project practices, templates, and
informal workflow notes. Amendments MUST update this file, include a Sync Impact
Report, and propagate any changed requirements to affected templates and runtime
guidance.

Versioning follows semantic versioning:
- MAJOR for removing or redefining principles in a way that invalidates prior
  compliant work.
- MINOR for adding principles, sections, or materially expanded governance.
- PATCH for clarifications, wording improvements, and non-semantic corrections.

Every implementation plan MUST document constitution compliance. Reviewers MUST
block work that lacks required user-story tests or verification, data boundary
analysis, recovery behavior, or complexity justification. Exceptions MUST be
recorded in the plan's Complexity Tracking table with a rationale and a simpler
alternative that was considered.

**Version**: 1.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15
