from __future__ import annotations

import logging

from backend.src.api.errors import not_found
from backend.src.models.telemetry import TelemetryIngestResult, TrailerTelemetryReading
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.services.shipment_service import ShipmentService
from backend.src.services.recommendation_service import RecommendationService


class TelemetryService:
    def __init__(self, store: SQLiteStore) -> None:
        self.store = store
        self.shipments = ShipmentService(store)

    def ingest(self, reading: TrailerTelemetryReading) -> TelemetryIngestResult:
        logging.info("Ingesting telemetry reading for shipment %s", reading.shipment_id)
        shipment = self.store.get_shipment(reading.shipment_id)
        if shipment is None:
            raise not_found("Shipment not found", reading.shipment_id)
        accepted = self.store.save_reading(reading)
        if not accepted:
            logging.info("Duplicate telemetry reading ignored for shipment %s", reading.shipment_id)
        assessment = self.shipments.assess_shipment(shipment)
        recommendation = RecommendationService(self.store).generate_for_assessment(shipment.shipment_id, assessment.assessment_id)
        refreshed = self.store.get_shipment(shipment.shipment_id)
        assert refreshed is not None
        return TelemetryIngestResult(
            shipment_id=shipment.shipment_id,
            reading_accepted=accepted,
            decision_state=refreshed.decision_state,
            assessment=assessment,
            recommendation=recommendation,
        )
