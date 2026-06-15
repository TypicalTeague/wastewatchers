from __future__ import annotations

import os
from functools import lru_cache

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from backend.src.api.errors import AppError
from backend.src.persistence.seed_data import seed_profiles, seed_shipments
from backend.src.persistence.sqlite_store import SQLiteStore


@lru_cache(maxsize=1)
def get_store() -> SQLiteStore:
    store = SQLiteStore(os.getenv("WASTEWATCHERS_DB_PATH", ".wastewatchers.sqlite3"))
    store.seed(seed_profiles(), seed_shipments())
    return store


def create_app() -> FastAPI:
    app = FastAPI(title="WasteWatchers Salvage Rerouting API", version="0.1.0")

    @app.exception_handler(AppError)
    async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content=exc.response.model_dump())

    from backend.src.api import approvals, demo, shipments, telemetry

    app.include_router(telemetry.router)
    app.include_router(shipments.router)
    app.include_router(approvals.router)
    app.include_router(demo.router)
    return app


app = create_app()

