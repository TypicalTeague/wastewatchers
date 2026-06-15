# Implementation Plan: Salvage Rerouting Dashboard

**Branch**: `001-salvage-rerouting-dashboard` | **Date**: 2026-06-15 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-salvage-rerouting-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build WasteWatchers as a FastAPI telemetry ingestion backend plus Streamlit
logistics dashboard. The backend accepts live trailer temperature events,
validates them as typed payloads, evaluates shipments against commodity thermal
profiles, calculates remaining crop shelf life, and produces salvage reroute
recommendations. The frontend shows farm logistics managers at-risk shipments
and lets them approve a viable reroute with one deliberate action.

## Technical Context

**Language/Version**: Python 3.12+  
**Primary Dependencies**: FastAPI, Streamlit, Pydantic, pytest, httpx, uvicorn  
**Storage**: SQLite for local pilot persistence via repository modules; schema kept replaceable for PostgreSQL later  
**Testing**: pytest, FastAPI TestClient/httpx, Streamlit smoke tests for import and service-client behavior  
**Target Platform**: Local development and single-host pilot deployment  
**Project Type**: FastAPI telemetry ingestion backend + Streamlit logistics frontend  
**Performance Goals**: Process 95% of telemetry submissions and dashboard refreshes within 2 seconds in pilot scale; support at least 100 active shipments and 10,000 telemetry readings during local validation  
**Constraints**: Pydantic models for all API and internal data passing; no raw dictionaries for typed data; simulation, rules, API, shared schemas, and UI stay in separate modules  
**Scale/Scope**: Pilot for farm logistics managers monitoring in-transit crop shipments with live or simulated trailer temperature telemetry

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- User-value slices: PASS. The spec has three independently testable stories:
  detect at-risk shipments, review resolution options, and approve rerouting.
- Test-first confidence: PASS. Contract, integration, and rules tests will be
  created before implementation tasks.
- Data and privacy boundaries: PASS. Data model defines shipment, telemetry,
  commodity profile, shelf-life, recommendation, and approval records; all
  contracts use Pydantic-compatible schemas.
- Observable and recoverable operations: PASS. Research and design define
  handling for telemetry gaps, missing profiles, stale calculations, failed
  recommendations, and unsafe approvals.
- Simplicity and traceability: PASS. Single backend, single frontend, SQLite
  pilot storage, and direct service modules are sufficient for the current spec.
- Modular separation: PASS. Telemetry simulation, rules/business logic, API
  ingestion, shared schemas, persistence, and Streamlit UI have separate paths.

Post-design re-check: PASS. The generated data model, OpenAPI contract, and
quickstart preserve all gates without unresolved violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-salvage-rerouting-dashboard/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- openapi.yaml
`-- tasks.md
```

### Source Code (repository root)

```text
backend/
|-- src/
|   |-- models/
|   |   |-- telemetry.py
|   |   |-- commodity.py
|   |   |-- shipment.py
|   |   |-- assessment.py
|   |   `-- approval.py
|   |-- simulation/
|   |   `-- trailer_feed.py
|   |-- rules/
|   |   |-- shelf_life.py
|   |   `-- reroute.py
|   |-- api/
|   |   |-- telemetry.py
|   |   |-- shipments.py
|   |   `-- approvals.py
|   |-- services/
|   |   |-- shipment_service.py
|   |   |-- telemetry_service.py
|   |   `-- recommendation_service.py
|   |-- persistence/
|   |   `-- sqlite_store.py
|   `-- main.py
`-- tests/
    |-- contract/
    |-- integration/
    `-- unit/

frontend/
|-- app.py
|-- components/
|   |-- shipment_table.py
|   `-- recommendation_panel.py
|-- services/
|   `-- wastewatchers_client.py
`-- tests/
```

**Structure Decision**: Use the constitution-mandated FastAPI backend and
Streamlit frontend with explicit modules for schemas, simulation, rules, API,
services, persistence, and UI. SQLite is intentionally scoped to pilot storage
and hidden behind persistence modules so later PostgreSQL migration does not
change business rules or API contracts.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
