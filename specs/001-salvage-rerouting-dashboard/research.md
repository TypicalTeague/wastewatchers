# Phase 0 Research: Salvage Rerouting Dashboard

## Decision: Use SQLite for Pilot Persistence Behind Repository Modules

**Rationale**: The feature needs durable shipment state, telemetry summaries,
commodity profiles, recommendations, and approval records during local and pilot
use. SQLite keeps setup lightweight while still allowing transactional updates
for approval records. A repository module keeps persistence separate from rules
and API handlers.

**Alternatives considered**:
- In-memory storage: too fragile for approval audit records and restart
  recovery.
- PostgreSQL immediately: appropriate later, but unnecessary operational
  overhead before pilot scale is proven.
- Flat files: simple for fixtures, but weaker for state transitions and
  concurrent dashboard/API access.

## Decision: Use Pydantic Models as the Single Data Contract Layer

**Rationale**: The constitution requires strict typed data passing and no raw
dictionaries for business data. Pydantic models give one validation vocabulary
for incoming telemetry, internal shelf-life inputs and outputs, dashboard
records, and approval commands.

**Alternatives considered**:
- Dataclasses plus custom validation: more duplicated validation work.
- Raw dictionaries validated at boundaries only: violates the constitution and
  lets malformed data move between modules.
- ORM models as contracts: couples persistence to API and rules layers too
  early.

## Decision: Keep Shelf-Life and Reroute Rules Pure and Isolated

**Rationale**: Commodity thermal evaluation and reroute eligibility must be
testable without API, UI, persistence, or telemetry simulation dependencies.
Pure rules modules allow deterministic unit tests for temperature excursions,
missing profiles, stale readings, and approval eligibility.

**Alternatives considered**:
- Compute inside API route handlers: faster to prototype but violates modular
  separation and makes rule testing brittle.
- Compute inside Streamlit UI: would hide core business decisions in presentation
  code.
- Background worker first: unnecessary before the pilot requires asynchronous
  batch processing.

## Decision: Expose a Small REST Contract for Telemetry, Dashboard, and Approvals

**Rationale**: The feature is described as a middleware bridge and dashboard.
Three interface groups are sufficient for planning: telemetry ingestion,
shipment decision views, and reroute approval. This supports contract tests
without inventing extra services.

**Alternatives considered**:
- Event broker first: useful at scale but heavier than needed for pilot.
- Direct database writes from telemetry adapters: bypasses validation and
  recovery behavior.
- UI-only prototype: cannot validate middleware bridge behavior.

## Decision: Test with Contract, Integration, and Focused Rules Tests

**Rationale**: Contract tests verify external behavior, integration tests cover
the end-to-end journey from telemetry to dashboard to approval, and unit tests
lock down shelf-life and reroute rules. Tests are written before implementation
per constitution.

**Alternatives considered**:
- Manual dashboard-only checks: insufficient for telemetry and approval edge
  cases.
- Unit tests only: misses cross-module data contract failures.
- Full browser automation first: useful later, but heavier than needed before UI
  behavior stabilizes.

## Decision: Route Recoverable Failures to Manual Follow-Up

**Rationale**: Missing commodity profiles, telemetry gaps, stale calculations,
and unsafe approval attempts must be visible instead of silently ignored. The
system will preserve affected shipment records with a manual follow-up state and
an operator-facing reason.

**Alternatives considered**:
- Reject all problematic records: loses operational visibility.
- Automatically approve fallback reroutes: unsafe for crop and logistics
  decisions.
- Hide incomplete shipments from dashboard: recreates the late-discovery
  problem the feature is meant to solve.
