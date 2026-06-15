from __future__ import annotations

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from backend.src.main import create_app, get_store
from backend.src.persistence.seed_data import seed_profiles, seed_shipments
from backend.src.persistence.sqlite_store import SQLiteStore


@pytest.fixture
def store() -> Iterator[SQLiteStore]:
    test_store = SQLiteStore(":memory:")
    test_store.seed(seed_profiles(), seed_shipments())
    yield test_store
    test_store.close()


@pytest.fixture
def client(store: SQLiteStore) -> Iterator[TestClient]:
    get_store.cache_clear()
    app = create_app()
    app.dependency_overrides[get_store] = lambda: store
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    get_store.cache_clear()

