from __future__ import annotations

import importlib

from backend.src.simulation.trailer_feed import scenario_readings


def test_quickstart_imports_and_simulation_flow():
    app_module = importlib.import_module("backend.src.main")
    frontend_module = importlib.import_module("frontend.app")
    readings = scenario_readings("cooling-failure")

    assert app_module.app is not None
    assert hasattr(frontend_module, "main")
    assert readings
    assert any(reading.temperature_c > 8 for reading in readings)

