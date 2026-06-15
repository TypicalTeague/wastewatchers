from __future__ import annotations

from typing import Any

import httpx
from pydantic import BaseModel, TypeAdapter

from backend.src.models.approval import ApprovalCreate, ApprovalRecord
from backend.src.models.demo import DemoDashboardState, ManagerDecisionRequest, SimulationConfig
from backend.src.models.telemetry import TelemetryIngestResult, TrailerTelemetryReading


class ClientError(Exception):
    def __init__(self, status_code: int, message: str) -> None:
        self.status_code = status_code
        super().__init__(message)


class DashboardShipment(BaseModel):
    shipment_id: str
    trailer_id: str
    commodity_name: str
    decision_state: str
    remaining_shelf_life_hours: float
    urgency: str
    expected_arrival_at: str
    recommended_destination: str | None = None


class DashboardShipmentDetail(DashboardShipment):
    assessment: dict[str, Any]
    recommendation: dict[str, Any] | None = None
    recovery_reason: str | None = None


class WasteWatchersClient:
    def __init__(self, base_url: str = "http://127.0.0.1:8000") -> None:
        self.base_url = base_url.rstrip("/")

    def ingest_reading(self, reading: TrailerTelemetryReading) -> TelemetryIngestResult:
        payload = self._request("POST", "/telemetry/readings", json=reading.model_dump(mode="json"))
        return TelemetryIngestResult.model_validate(payload)

    def list_at_risk_shipments(self, include_watch: bool = True) -> list[DashboardShipment]:
        payload = self._request("GET", f"/shipments/at-risk?include_watch={str(include_watch).lower()}")
        return TypeAdapter(list[DashboardShipment]).validate_python(payload)

    def get_shipment_detail(self, shipment_id: str) -> DashboardShipmentDetail:
        payload = self._request("GET", f"/shipments/{shipment_id}")
        return DashboardShipmentDetail.model_validate(payload)

    def approve_recommendation(self, recommendation_id: str, approval: ApprovalCreate) -> ApprovalRecord:
        payload = self._request(
            "POST",
            f"/recommendations/{recommendation_id}/approve",
            json=approval.model_dump(mode="json"),
        )
        return ApprovalRecord.model_validate(payload)

    def get_demo_dashboard(self) -> DemoDashboardState:
        payload = self._request("GET", "/demo/dashboard")
        return DemoDashboardState.model_validate(payload)

    def load_demo_scenario(self) -> DemoDashboardState:
        payload = self._request("POST", "/demo/scenario/load")
        return DemoDashboardState.model_validate(payload)

    def reset_demo_scenario(self) -> DemoDashboardState:
        payload = self._request("POST", "/demo/scenario/reset")
        return DemoDashboardState.model_validate(payload)

    def start_demo_simulation(self, config: SimulationConfig) -> DemoDashboardState:
        payload = self._request("POST", "/demo/simulation/start", json=config.model_dump(mode="json"))
        return DemoDashboardState.model_validate(payload)

    def pause_demo_simulation(self) -> DemoDashboardState:
        payload = self._request("POST", "/demo/simulation/pause")
        return DemoDashboardState.model_validate(payload)

    def advance_demo_simulation_step(self) -> DemoDashboardState:
        payload = self._request("POST", "/demo/simulation/step")
        return DemoDashboardState.model_validate(payload)

    def apply_demo_control(self, shipment_id: str, control: str) -> DemoDashboardState:
        payload = self._request("POST", f"/demo/controls/{shipment_id}/{control}")
        return DemoDashboardState.model_validate(payload)

    def apply_demo_manager_decision(
        self,
        shipment_id: str,
        decision: ManagerDecisionRequest,
    ) -> DemoDashboardState:
        payload = self._request(
            "POST",
            f"/demo/shipments/{shipment_id}/decision",
            json=decision.model_dump(mode="json"),
        )
        return DemoDashboardState.model_validate(payload)

    def _request(self, method: str, path: str, **kwargs: Any) -> Any:
        with httpx.Client(base_url=self.base_url, timeout=10) as client:
            response = client.request(method, path, **kwargs)
        if response.status_code >= 400:
            raise ClientError(response.status_code, response.text)
        return response.json()

