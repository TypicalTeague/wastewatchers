# Quickstart: Demo Operations Dashboard

## Prerequisites

- Python 3.12+
- Existing WasteWatchers dependencies installed with `python -m pip install -e .[dev]`

## Run Backend

```powershell
uvicorn backend.src.main:app --reload
```

## Run Dashboard

```powershell
streamlit run frontend/app.py
```

## Demo Flow

1. Open the Streamlit dashboard.
2. Confirm the helpful empty state is visible and no raw empty table is shown.
3. Select **Load Demo Scenario**.
4. Confirm four shipments appear: healthy, watch, at-risk, and critical salvage.
5. Start live simulation with a 2-5 second interval.
6. Watch temperature history, shelf life, pallet colors, and recommendations
   change over time.
7. Pause live mode and use **Advance One Step** if automatic refresh is unstable.
8. Trigger cooling failure, severe temperature spike, restore cooling, and
   telemetry outage from presenter controls.
9. Approve reroute, send to manual review, and reject shipment from manager
   actions.
10. Reset the demo and confirm the dashboard returns to the empty state.

## Validation

```powershell
python -m pytest backend/tests frontend/tests
```

Expected coverage:
- seeded demo data generation
- simulation state transitions
- risk-to-color mapping
- shelf-life recalculation
- cooling failure and recovery behavior
- telemetry outage behavior
- approval, rejection, and manual-review state updates
- reset behavior

