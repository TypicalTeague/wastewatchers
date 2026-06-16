from __future__ import annotations

import json
import sqlite3
from collections.abc import Iterable
from pathlib import Path
from typing import TypeVar

from pydantic import BaseModel

from backend.src.models.approval import ApprovalRecord, RerouteRecommendation
from backend.src.models.assessment import ShelfLifeAssessment
from backend.src.models.commodity import CommodityThermalProfile
from backend.src.models.demo import (
    DemoScenario,
    DemoShipmentState,
    ManagerDecisionEvent,
    PresenterControlEvent,
    SimulationStep,
)
from backend.src.models.shipment import Shipment
from backend.src.models.telemetry import TrailerTelemetryReading

T = TypeVar("T", bound=BaseModel)


class SQLiteStore:
    def __init__(self, db_path: str | Path = ":memory:") -> None:
        self.db_path = str(db_path)
        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.initialize()

    def initialize(self) -> None:
        self.conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS shipments (
                shipment_id TEXT PRIMARY KEY,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS commodity_profiles (
                commodity_id TEXT PRIMARY KEY,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS telemetry_readings (
                reading_id TEXT PRIMARY KEY,
                shipment_id TEXT NOT NULL,
                trailer_id TEXT NOT NULL,
                recorded_at TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS assessments (
                assessment_id TEXT PRIMARY KEY,
                shipment_id TEXT NOT NULL,
                calculated_at TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS recommendations (
                recommendation_id TEXT PRIMARY KEY,
                shipment_id TEXT NOT NULL,
                assessment_id TEXT NOT NULL,
                status TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS approvals (
                approval_id TEXT PRIMARY KEY,
                recommendation_id TEXT NOT NULL UNIQUE,
                shipment_id TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS demo_scenarios (
                scenario_id TEXT PRIMARY KEY,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS demo_shipments (
                scenario_id TEXT NOT NULL,
                shipment_id TEXT NOT NULL,
                payload TEXT NOT NULL,
                PRIMARY KEY (scenario_id, shipment_id)
            );
            CREATE TABLE IF NOT EXISTS demo_simulation_steps (
                step_id TEXT PRIMARY KEY,
                scenario_id TEXT NOT NULL,
                step_number INTEGER NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS demo_presenter_events (
                event_id TEXT PRIMARY KEY,
                scenario_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS demo_manager_decisions (
                event_id TEXT PRIMARY KEY,
                scenario_id TEXT NOT NULL,
                shipment_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            """
        )
        self.conn.commit()

    def reset(self) -> None:
        self.conn.executescript(
            """
            DELETE FROM approvals;
            DELETE FROM recommendations;
            DELETE FROM assessments;
            DELETE FROM telemetry_readings;
            DELETE FROM shipments;
            DELETE FROM commodity_profiles;
            DELETE FROM demo_manager_decisions;
            DELETE FROM demo_presenter_events;
            DELETE FROM demo_simulation_steps;
            DELETE FROM demo_shipments;
            DELETE FROM demo_scenarios;
            """
        )
        self.conn.commit()

    def close(self) -> None:
        self.conn.close()

    def save_shipment(self, shipment: Shipment) -> None:
        self._upsert("shipments", "shipment_id", shipment.shipment_id, shipment)

    def get_shipment(self, shipment_id: str) -> Shipment | None:
        return self._get("shipments", "shipment_id", shipment_id, Shipment)

    def list_shipments(self) -> list[Shipment]:
        return self._list("shipments", Shipment)

    def save_profile(self, profile: CommodityThermalProfile) -> None:
        self._upsert("commodity_profiles", "commodity_id", profile.commodity_id, profile)

    def get_profile(self, commodity_id: str) -> CommodityThermalProfile | None:
        return self._get("commodity_profiles", "commodity_id", commodity_id, CommodityThermalProfile)

    def list_profiles(self) -> list[CommodityThermalProfile]:
        return self._list("commodity_profiles", CommodityThermalProfile)

    def save_reading(self, reading: TrailerTelemetryReading) -> bool:
        assert reading.reading_id is not None
        try:
            self.conn.execute(
                """
                INSERT INTO telemetry_readings (reading_id, shipment_id, trailer_id, recorded_at, payload)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    reading.reading_id,
                    reading.shipment_id,
                    reading.trailer_id,
                    reading.recorded_at.isoformat(),
                    self._payload(reading),
                ),
            )
            self.conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False

    def list_readings_for_shipment(self, shipment_id: str) -> list[TrailerTelemetryReading]:
        rows = self.conn.execute(
            "SELECT payload FROM telemetry_readings WHERE shipment_id = ? ORDER BY recorded_at",
            (shipment_id,),
        ).fetchall()
        return [TrailerTelemetryReading.model_validate_json(row["payload"]) for row in rows]

    def save_assessment(self, assessment: ShelfLifeAssessment) -> None:
        self.conn.execute(
            """
            INSERT OR REPLACE INTO assessments (assessment_id, shipment_id, calculated_at, payload)
            VALUES (?, ?, ?, ?)
            """,
            (
                assessment.assessment_id,
                assessment.shipment_id,
                assessment.calculated_at.isoformat(),
                self._payload(assessment),
            ),
        )
        self.conn.commit()

    def latest_assessment(self, shipment_id: str) -> ShelfLifeAssessment | None:
        row = self.conn.execute(
            """
            SELECT payload FROM assessments
            WHERE shipment_id = ?
            ORDER BY calculated_at DESC
            LIMIT 1
            """,
            (shipment_id,),
        ).fetchone()
        return ShelfLifeAssessment.model_validate_json(row["payload"]) if row else None

    def save_recommendation(self, recommendation: RerouteRecommendation) -> None:
        self.conn.execute(
            """
            INSERT OR REPLACE INTO recommendations (recommendation_id, shipment_id, assessment_id, status, payload)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                recommendation.recommendation_id,
                recommendation.shipment_id,
                recommendation.assessment_id,
                recommendation.status.value,
                self._payload(recommendation),
            ),
        )
        self.conn.commit()

    def get_recommendation(self, recommendation_id: str) -> RerouteRecommendation | None:
        return self._get("recommendations", "recommendation_id", recommendation_id, RerouteRecommendation)

    def latest_recommendation(self, shipment_id: str) -> RerouteRecommendation | None:
        row = self.conn.execute(
            """
            SELECT payload FROM recommendations
            WHERE shipment_id = ?
            ORDER BY rowid DESC
            LIMIT 1
            """,
            (shipment_id,),
        ).fetchone()
        return RerouteRecommendation.model_validate_json(row["payload"]) if row else None

    def list_recommendations(self) -> list[RerouteRecommendation]:
        return self._list("recommendations", RerouteRecommendation)

    def save_approval(self, approval: ApprovalRecord) -> None:
        self.conn.execute(
            """
            INSERT INTO approvals (approval_id, recommendation_id, shipment_id, payload)
            VALUES (?, ?, ?, ?)
            """,
            (
                approval.approval_id,
                approval.recommendation_id,
                approval.shipment_id,
                self._payload(approval),
            ),
        )
        self.conn.commit()

    def get_approval_for_recommendation(self, recommendation_id: str) -> ApprovalRecord | None:
        row = self.conn.execute(
            "SELECT payload FROM approvals WHERE recommendation_id = ?",
            (recommendation_id,),
        ).fetchone()
        return ApprovalRecord.model_validate_json(row["payload"]) if row else None

    def seed(self, profiles: Iterable[CommodityThermalProfile], shipments: Iterable[Shipment]) -> None:
        for profile in profiles:
            self.save_profile(profile)
        for shipment in shipments:
            self.save_shipment(shipment)

    def save_demo_scenario(self, scenario: DemoScenario) -> None:
        self._upsert("demo_scenarios", "scenario_id", scenario.scenario_id, scenario)

    def get_demo_scenario(self, scenario_id: str) -> DemoScenario | None:
        return self._get("demo_scenarios", "scenario_id", scenario_id, DemoScenario)

    def save_demo_shipment(self, scenario_id: str, shipment: DemoShipmentState) -> None:
        self.conn.execute(
            """
            INSERT OR REPLACE INTO demo_shipments (scenario_id, shipment_id, payload)
            VALUES (?, ?, ?)
            """,
            (scenario_id, shipment.shipment_id, self._payload(shipment)),
        )
        self.conn.commit()

    def list_demo_shipments(self, scenario_id: str) -> list[DemoShipmentState]:
        rows = self.conn.execute(
            "SELECT payload FROM demo_shipments WHERE scenario_id = ? ORDER BY shipment_id",
            (scenario_id,),
        ).fetchall()
        return [DemoShipmentState.model_validate_json(row["payload"]) for row in rows]

    def save_demo_simulation_step(self, step: SimulationStep) -> None:
        self.conn.execute(
            """
            INSERT OR REPLACE INTO demo_simulation_steps (step_id, scenario_id, step_number, payload)
            VALUES (?, ?, ?, ?)
            """,
            (step.step_id, step.scenario_id, step.step_number, self._payload(step)),
        )
        self.conn.commit()

    def list_demo_simulation_steps(self, scenario_id: str) -> list[SimulationStep]:
        rows = self.conn.execute(
            """
            SELECT payload FROM demo_simulation_steps
            WHERE scenario_id = ?
            ORDER BY step_number
            """,
            (scenario_id,),
        ).fetchall()
        return [SimulationStep.model_validate_json(row["payload"]) for row in rows]

    def save_demo_presenter_event(self, event: PresenterControlEvent) -> None:
        self.conn.execute(
            """
            INSERT OR REPLACE INTO demo_presenter_events (event_id, scenario_id, created_at, payload)
            VALUES (?, ?, ?, ?)
            """,
            (event.event_id, event.scenario_id, event.created_at.isoformat(), self._payload(event)),
        )
        self.conn.commit()

    def save_demo_manager_decision(self, event: ManagerDecisionEvent) -> None:
        self.conn.execute(
            """
            INSERT OR REPLACE INTO demo_manager_decisions (event_id, scenario_id, shipment_id, created_at, payload)
            VALUES (?, ?, ?, ?, ?)
            """,
            (event.event_id, event.scenario_id, event.shipment_id, event.created_at.isoformat(), self._payload(event)),
        )
        self.conn.commit()

    def clear_demo_state(self, scenario_id: str | None = None) -> None:
        if scenario_id is None:
            self.conn.executescript(
                """
                DELETE FROM demo_manager_decisions;
                DELETE FROM demo_presenter_events;
                DELETE FROM demo_simulation_steps;
                DELETE FROM demo_shipments;
                DELETE FROM demo_scenarios;
                """
            )
        else:
            for table in (
                "demo_manager_decisions",
                "demo_presenter_events",
                "demo_simulation_steps",
                "demo_shipments",
                "demo_scenarios",
            ):
                self.conn.execute(f"DELETE FROM {table} WHERE scenario_id = ?", (scenario_id,))
        self.conn.commit()

    def _upsert(self, table: str, key: str, value: str, model: BaseModel) -> None:
        self.conn.execute(
            f"INSERT OR REPLACE INTO {table} ({key}, payload) VALUES (?, ?)",
            (value, self._payload(model)),
        )
        self.conn.commit()

    def _get(self, table: str, key: str, value: str, model_type: type[T]) -> T | None:
        row = self.conn.execute(f"SELECT payload FROM {table} WHERE {key} = ?", (value,)).fetchone()
        return model_type.model_validate_json(row["payload"]) if row else None

    def _list(self, table: str, model_type: type[T]) -> list[T]:
        rows = self.conn.execute(f"SELECT payload FROM {table}").fetchall()
        return [model_type.model_validate_json(row["payload"]) for row in rows]

    @staticmethod
    def _payload(model: BaseModel) -> str:
        return json.dumps(model.model_dump(mode="json"))

