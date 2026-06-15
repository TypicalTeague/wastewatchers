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

