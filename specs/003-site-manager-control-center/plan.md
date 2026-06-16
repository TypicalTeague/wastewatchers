# Implementation Plan: WasteWatchers Site Manager Control Center

**Branch**: `004-site-manager-control-center` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-site-manager-control-center/spec.md`

**Note**: This plan preserves the existing WasteWatchers Next.js dashboard and
FastAPI backend. It is a planning artifact only; implementation is intentionally
deferred to task generation and execution.

## Summary

Build the Site Manager Control Center by extending the existing demo dashboard,
typed API client, FastAPI demo models, simulation engine, demo service,
persistence layer, recommendation service, reroute rules, and approval workflow.
The feature adds transparent provenance, Fahrenheit manager display, centralized
financial assumptions and formulas, richer response option comparison,
multi-signal risk and confidence, and a central recommended-decision workspace
while preserving the truck/pallet visualization, shipment queue, emerald visual
identity, simulation workflow, responsive behavior, and dark mode.

## Technical Context

**Language/Version**: Python 3.12+, TypeScript 5  
**Primary Dependencies**: Existing FastAPI, Pydantic, SQLite persistence, pytest, Next.js 16.2.9, React 19.2.4, ESLint  
**Storage**: Existing SQLite persistence and JSON payload tables; extend stored Pydantic payloads additively where practical  
**Testing**: pytest backend unit/integration/contract tests; frontend lint, production build, and focused TypeScript utility tests for display formatting  
**Target Platform**: Local demo and single-host pilot dashboard for browser-based site manager workflow  
**Project Type**: FastAPI backend + Next.js dashboard with maintained legacy Streamlit demo surfaces not targeted by this feature  
**Performance Goals**: Manager identifies highest-risk load in under 10 seconds; central workspace shows recommendation, deadline, and financial effect in under 15 seconds; simulation updates visible condition, options, confidence, and financial estimates within the existing polling cadence  
**Constraints**: Preserve current Next.js/TypeScript frontend, FastAPI/Pydantic backend, API client structure, dashboard route, demo service, simulation engine, persistence layer, recommendation service, approval workflow, and truck/pallet visualization where practical; Celsius remains backend canonical; Fahrenheit is manager-facing display only through shared frontend formatting utility; no external paid services, credentials, fake maps, fabricated GPS, or scattered recovery/cost constants  
**Scale/Scope**: Demo/pilot control center for active refrigerated produce shipments, response option comparison, manager decisions, simulation progression, and documented assumptions; no real partner pricing, weather, traffic, or route-coordinate integrations unless already configured

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Decision clarity: PASS. Plan centers recommendation, response options, risk
  drivers, and financial impact in the main shipment workspace.
- Protected product strengths: PASS. Truck/pallet visualization, queue,
  emerald identity, simulation workflow, responsive behavior, and dark mode are
  explicit preservation constraints.
- Data provenance: PASS. Models add provenance labels for operational,
  financial, route, partner, and simulation signals.
- Transparent calculations: PASS. Financial, eligibility, ranking, confidence,
  and risk updates are centralized in backend services/rules and documented in
  research and data model artifacts.
- Temperature units: PASS. Backend remains Celsius canonical; manager-facing
  Fahrenheit conversion is isolated to a shared frontend display utility.
- Type safety: PASS. Frontend contracts extend `src/lib/api/types.ts`; backend
  contracts extend Pydantic models rather than raw dictionaries.
- Backward compatibility: PASS. Existing `/demo/*` dashboard flow and Next.js
  `/api/wastewatchers` rewrite are preserved with additive response fields and
  endpoints where possible.
- Testability: PASS. Plan includes happy, boundary, and failure tests for
  temperature conversion, financial calculations, eligibility, ranking,
  simulation progression, approval state, and contracts.
- Simplicity: PASS. No new frameworks, databases, queues, paid services, or
  external credentials are introduced.
- Human approval and audit: PASS. Final approve, manual review, and rejection
  decisions use explicit confirmation and existing approval/demo decision
  persistence where practical.
- Secrets: PASS. Destination assumptions are demo configuration values; no
  credentials or private partner data are introduced.
- Brownfield discipline: PASS. Existing files inspected and accounted for:
  `src/app/dashboard/DashboardClient.tsx`,
  `src/app/dashboard/components/TrailerPalletVisualization.tsx`,
  `src/lib/api/types.ts`, `src/lib/api/display.ts`,
  `backend/src/models/demo.py`, `backend/src/simulation/demo_scenarios.py`,
  `backend/src/simulation/demo_engine.py`,
  `backend/src/services/demo_service.py`, `backend/src/rules/reroute.py`, and
  `backend/src/services/recommendation_service.py`.
- Next.js docs check: PASS. Local Next.js docs reviewed for Server/Client
  Components, Route Handlers, and Error Handling before planning dashboard work.

Post-design re-check: PASS. Research, data model, contract, and quickstart keep
the architecture additive, preserve protected surfaces, document formulas and
assumptions, and avoid unresolved clarifications or gate violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-site-manager-control-center/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- control-center-openapi.yaml
`-- checklists/
    `-- requirements.md
```

### Source Code (repository root)

```text
backend/
|-- src/
|   |-- models/
|   |   |-- demo.py              # Extend demo dashboard, shipment, options, financials, provenance, decisions
|   |   `-- approval.py          # Reuse existing approval record model where practical
|   |-- rules/
|   |   |-- reroute.py           # Extend eligibility/ranking rules
|   |   |-- shelf_life.py        # Reuse and extend shelf-life-at-arrival inputs
|   |   `-- financials.py        # New centralized financial formulas
|   |-- services/
|   |   |-- demo_service.py      # Compose dashboard state, manager decisions, simulation updates
|   |   |-- recommendation_service.py # Preserve existing real recommendation approval workflow
|   |   `-- financial_service.py # New financial calculation service wrapper
|   |-- simulation/
|   |   |-- demo_scenarios.py    # Seed demo values using centralized assumptions
|   |   `-- demo_engine.py       # Update risk, options, financials, confidence over time
|   |-- config/
|   |   `-- destination_assumptions.py # New documented demo assumptions
|   |-- persistence/
|   |   `-- sqlite_store.py      # Reuse existing JSON payload tables additively
|   `-- api/
|       `-- demo.py              # Additive control-center decision endpoints
`-- tests/
    |-- contract/
    |-- integration/
    `-- unit/

src/
|-- app/
|   `-- dashboard/
|       |-- DashboardClient.tsx  # Reorganize central workspace, keep route and queue
|       `-- components/
|           |-- TrailerPalletVisualization.tsx # Preserve visualization
|           `-- SimulationControls.tsx
`-- lib/
    `-- api/
        |-- client.ts            # Preserve client structure and add typed calls
        |-- display.ts           # Shared Fahrenheit/currency/provenance formatting
        |-- trailer.ts
        `-- types.ts             # Extend typed API contracts

docs/
`-- site-manager-control-center.md # New formulas, assumptions, provenance, integrations guidance
```

**Structure Decision**: Use the existing FastAPI + Next.js architecture. Add a
small backend `config` module for demo destination assumptions and backend
financial/ranking rules; extend existing Pydantic and TypeScript models
additively. Keep the dashboard route and truck visualization component in
place, moving the full recommendation into the central workspace rather than
relying on the existing narrow decision summary placeholder.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
