# Quickstart: Salvage Rerouting Dashboard

## Prerequisites

- Python 3.12 or newer
- A virtual environment in the repository root
- Dependencies installed from the implementation dependency file once created

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e .[dev]
```

## Run Backend

```powershell
uvicorn backend.src.main:app --reload
```

Expected result: the telemetry ingestion API is available locally and exposes
the contract described in `contracts/openapi.yaml`.

## Run Frontend

```powershell
streamlit run frontend/app.py
```

Expected result: farm logistics managers can view at-risk shipments, see
remaining shelf-life and reroute recommendations, and approve viable salvage
reroutes.

## Seed or Simulate Telemetry

```powershell
python -m backend.src.simulation.trailer_feed --scenario cooling-failure
```

Expected result: at least one in-transit shipment receives out-of-range
temperature readings, moves to an at-risk or salvage-recommended state, and
appears in the dashboard.

## Validate Feature

```powershell
pytest backend/tests frontend/tests
```

Expected checks:
- Telemetry ingestion validates required shipment and temperature fields.
- Commodity thermal profiles affect remaining shelf-life calculations.
- Missing profiles and stale telemetry route shipments to manual follow-up.
- Dashboard data lists urgent shipments before lower-risk shipments.
- Reroute approval records approver, timestamp, recommendation, and resulting
  destination.

Validation result recorded on 2026-06-15:

```text
27 passed, 1 warning
```

## Manual Pilot Flow

1. Start the backend.
2. Start the Streamlit dashboard.
3. Run the cooling-failure telemetry simulation.
4. Confirm the affected shipment appears before dock arrival with reduced shelf
   life.
5. Approve the recommended salvage reroute.
6. Confirm the shipment state changes to reroute approved and an approval record
   is visible in the shipment detail.
