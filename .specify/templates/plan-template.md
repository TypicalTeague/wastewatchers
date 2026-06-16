# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.12+, TypeScript 5, or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, Pydantic, Next.js, React, or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., SQLite, PostgreSQL, files, browser state, or N/A]  
**Testing**: [e.g., pytest, frontend lint/build, component tests, or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., local demo, single-host pilot, browser dashboard, or NEEDS CLARIFICATION]
**Project Type**: [e.g., FastAPI backend + Next.js dashboard, backend-only, frontend-only, or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., dashboard updates within 2 seconds or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., preserve truck UI, Fahrenheit display, no new services or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., demo scenario, pilot operations, active shipment count or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Decision clarity: PASS/FAIL. The plan identifies what is wrong, why it
  matters, recommended action, option tradeoffs, and cost or recovery impact for
  every manager workflow.
- Protected product strengths: PASS/FAIL. The plan preserves truck/pallet
  visualization, risk queue, emerald identity, simulation workflow, responsive
  behavior, and dark mode, or documents explicit approval for any change.
- Data provenance: PASS/FAIL. Operational and financial values are labeled as
  measured, calculated, simulated, demo assumption, manager entered, or
  unavailable.
- Transparent calculations: PASS/FAIL. Financial estimates, spoilage risk,
  shelf life, rankings, and confidence scores use centralized documented
  formulas with tests.
- Temperature units: PASS/FAIL. Celsius remains internal; manager-facing
  temperatures use shared Fahrenheit conversion and clear degrees Fahrenheit
  labels.
- Type safety: PASS/FAIL. Stable frontend contracts use typed TypeScript
  interfaces and backend contracts use Pydantic models.
- Backward compatibility: PASS/FAIL. Existing APIs and demo behavior are
  preserved where practical; breaks are listed with migration or compatibility
  handling.
- Testability: PASS/FAIL. Happy path, boundary, and failure tests are planned
  for material calculations and manager workflows.
- Simplicity: PASS/FAIL. The plan extends existing architecture and justifies
  any new framework, service, database, or abstraction.
- Human approval and audit: PASS/FAIL. Reroutes, manual reviews, and rejection
  decisions require explicit confirmation and an audit record.
- Secrets: PASS/FAIL. No credentials, API keys, customer data, or private
  partner data are introduced in source control.
- Brownfield discipline: PASS/FAIL. Existing services, models, components,
  utilities, and approval workflows were inspected and reused where practical.
- Next.js docs check: PASS/FAIL/N/A. If editing Next.js code, relevant
  `node_modules/next/dist/docs/` guidance was read before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
|-- plan.md              # This file (/speckit-plan command output)
|-- research.md          # Phase 0 output (/speckit-plan command)
|-- data-model.md        # Phase 1 output (/speckit-plan command)
|-- quickstart.md        # Phase 1 output (/speckit-plan command)
|-- contracts/           # Phase 1 output (/speckit-plan command)
`-- tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths. The delivered plan must not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Backend or library change
backend/
|-- src/
|   |-- models/
|   |-- rules/
|   |-- services/
|   |-- simulation/
|   |-- persistence/
|   `-- api/
`-- tests/
    |-- contract/
    |-- integration/
    `-- unit/

# [REMOVE IF UNUSED] Option 2: Next.js dashboard change
src/
|-- app/
|   |-- dashboard/
|   `-- [routes]/
`-- lib/
    `-- api/

# [REMOVE IF UNUSED] Option 3: Legacy Streamlit demo surface
frontend/
|-- app.py
|-- components/
|-- services/
`-- tests/
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., replacing truck visualization] | [current need] | [why preserving/extending it is insufficient] |
| [e.g., new data store] | [specific problem] | [why existing SQLite/persistence boundary insufficient] |
