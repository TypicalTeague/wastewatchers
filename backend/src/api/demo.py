from __future__ import annotations

from fastapi import APIRouter, Depends

from backend.src.main import get_store
from backend.src.models.demo import DemoDashboardState
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.services.demo_service import DemoService

router = APIRouter(prefix="/demo", tags=["demo"])


@router.get("/dashboard", response_model=DemoDashboardState)
def get_demo_dashboard(store: SQLiteStore = Depends(get_store)) -> DemoDashboardState:
    return DemoService(store).get_dashboard_state()


@router.post("/scenario/load", response_model=DemoDashboardState)
def load_demo_scenario(store: SQLiteStore = Depends(get_store)) -> DemoDashboardState:
    return DemoService(store).load_demo_scenario()


@router.post("/scenario/reset", response_model=DemoDashboardState)
def reset_demo_scenario(store: SQLiteStore = Depends(get_store)) -> DemoDashboardState:
    return DemoService(store).reset_demo_scenario()
