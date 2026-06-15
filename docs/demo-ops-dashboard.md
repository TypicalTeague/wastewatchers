# Demo Operations Dashboard

## Quickstart Validation

Run the backend and Streamlit dashboard for the demo flow:

```powershell
uvicorn backend.src.main:app --reload
streamlit run frontend/app.py
```

Validation scope for the shared setup, foundation, and User Story 1:

- Open the dashboard before loading a demo scenario.
- Confirm the demo area shows a helpful empty state instead of an empty raw table.
- Select Load Demo Scenario.
- Confirm four fictional shipments appear with healthy, watch, at-risk, and critical statuses.
- Confirm truck, trailer, pallet, crop, shelf-life, value, destination, and pallet condition details are visible.
- Reset the demo and confirm the empty state returns.
