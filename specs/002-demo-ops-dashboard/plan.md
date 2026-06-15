# Implementation Plan: Demo Operations Dashboard

**Branch**: `002-demo-ops-dashboard` | **Date**: 2026-06-15 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-demo-ops-dashboard/spec.md`

**Note**: This plan extends the existing WasteWatchers FastAPI backend,
Pydantic models, SQLite persistence, services, and Streamlit frontend.

## Summary

Build a polished hackathon-ready logistics control center on top of the existing
WasteWatchers salvage rerouting system. The feature adds deterministic demo
scenario loading, live and manual telemetry simulation, presenter controls,
pallet-state visualization, automatic shelf-life/risk/recommendation updates,
manager decision actions, helpful empty states, and reliable manual refresh
fallbacks. Existing API behavior remains intact; new contracts are additive.

## Technical Context

**Language/Version**: Python 3.12+  
**Primary Dependencies**: Existing FastAPI, Streamlit, Pydantic, SQLite, pytest, httpx, uvicorn  
**Storage**: Existing SQLite persistence extended with demo scenario state, simulation event history, and manager decision events  
**Testing**: pytest, FastAPI TestClient/httpx, deterministic simulation unit tests, Streamlit component/service tests  
**Target Platform**: Local hackathon demonstration and single-host pilot demo  
**Project Type**: FastAPI telemetry ingestion backend + Streamlit logistics frontend  
**Performance Goals**: Load four-shipment scenario in under 10 seconds; presenter actions update visible state within 2 seconds; show at least three visible simulation changes within 60 seconds  
**Constraints**: Reuse existing backend models/services/persistence; preserve existing API behavior; no duplicated business logic in Streamlit; Pydantic models for all demo and simulation data; simulation, demo data, risk/color mapping, and state transitions stay outside UI components  
**Scale/Scope**: Deterministic hackathon demo with four seeded shipments, live/step simulation, presenter controls, dashboard visuals, and manager actions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- User-value slices: PASS. Stories are independently testable: load scenario,
  live simulation, manual controls, and manager actions.
- Test-first confidence: PASS. Plan requires tests for seeded data generation,
  state transitions, risk-to-color mapping, shelf-life recalculation, cooling
  failure/recovery, telemetry outage, approval updates, and reset behavior.
- Data and privacy boundaries: PASS. Demo data is fictional, Pydantic-modeled,
  persisted via existing SQLite boundaries, and isolated from production data.
- Observable and recoverable operations: PASS. Simulation controls, outages,
  reset, action confirmations, and fallback refresh behavior are explicit.
- Simplicity and traceability: PASS. Extends existing FastAPI/Streamlit modules
  with additive services and endpoints; no new framework or background worker.
- Modular separation: PASS. Demo seeding, simulation, risk/color mapping, state
  transitions, API, service clients, and UI components have separate modules.

Post-design re-check: PASS. The research, data model, additive contracts, and
quickstart preserve existing contracts and keep UI free of business logic.

## Project Structure

### Documentation (this feature)

```text
specs/002-demo-ops-dashboard/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- demo-openapi.yaml
`-- tasks.md
```

### Source Code (repository root)

```text
backend/
|-- src/
|   |-- models/
|   |   `-- demo.py              # DemoScenario, DemoShipmentState, SimulationStep, event models
|   |-- simulation/
|   |   |-- demo_scenarios.py    # Deterministic seeded demo data
|   |   |-- demo_engine.py       # Live/manual step simulation
|   |   `-- pallet_state.py      # Risk-to-color and pallet visualization state mapping
|   |-- services/
|   |   `-- demo_service.py      # Scenario load/reset, controls, manager actions
|   |-- api/
|   |   `-- demo.py              # Additive demo endpoints
|   `-- persistence/
|       `-- sqlite_store.py      # Extend existing store with demo event/state persistence
`-- tests/
    |-- contract/
    |-- integration/
    `-- unit/

frontend/
|-- app.py                       # Uses services/components; no business rules
|-- components/
|   |-- control_center.py        # Metrics/cards layout
|   |-- pallet_visualization.py  # Visual-only pallet rendering helpers
|   |-- telemetry_charts.py      # Chart data shaping and rendering helpers
|   `-- demo_controls.py         # Presenter/manager controls
|-- services/
|   `-- wastewatchers_client.py  # Add demo API client methods
`-- tests/
```

**Structure Decision**: Extend the current backend and frontend. Additive demo
API endpoints sit under `/demo/*`, while existing telemetry, shipment, and
approval endpoints keep their behavior. Demo state and simulation transitions
are implemented in backend service/simulation modules; Streamlit renders typed
view models and sends control actions only.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

