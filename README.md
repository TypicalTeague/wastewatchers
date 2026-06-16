# WasteWatchers

WasteWatchers is an agriculture logistics decision support platform for
refrigerated produce shipments. It helps logistics and site managers understand
which loads are at risk, why the risk matters, what reroute or review action is
recommended, and what that action is expected to cost or recover.

## Architecture

- `backend/`: FastAPI backend with Pydantic models, simulation, rules, services,
  persistence, and API routes.
- `src/`: Next.js dashboard experience, including the current dashboard and
  truck/pallet visualization.
- `frontend/`: Maintained legacy Streamlit demo surfaces and tests.
- `specs/`: Spec Kit feature artifacts.

## Governance

All specifications, plans, tasks, and implementations are governed by
`.specify/memory/constitution.md`.

Key constraints:

- Preserve the current truck/pallet visualization, shipment queue, emerald
  identity, simulation workflow, responsive behavior, and dark mode unless an
  implementation plan records explicit approval to change them.
- Keep Celsius as the backend/internal calculation unit and display
  manager-facing temperatures in degrees Fahrenheit through shared utilities.
- Label operational and financial values by provenance: measured, calculated,
  simulated, demo assumption, manager entered, or unavailable.
- Use centralized, documented, tested formulas for financial estimates, risk,
  shelf life, recommendations, and confidence.
- Require explicit manager confirmation and audit records for consequential
  decisions such as reroutes, manual reviews, and rejections.

## Development

Install frontend dependencies:

```bash
npm install
```

Run the Next.js dashboard:

```bash
npm run dev
```

Run the FastAPI backend:

```bash
uvicorn backend.src.main:app --reload
```

Run the legacy Streamlit demo surface when needed:

```bash
streamlit run frontend/app.py
```

## Verification

Frontend changes should run:

```bash
npm run lint
npm run build
```

Backend changes should run:

```bash
pytest backend/tests
```
