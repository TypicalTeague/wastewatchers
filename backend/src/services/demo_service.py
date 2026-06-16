from __future__ import annotations

from datetime import timedelta
from uuid import uuid4

from backend.src.models.common import utc_now
from backend.src.models.demo import (
    ConfidenceLevel,
    DataProvenance,
    DemoDashboardState,
    DemoMetrics,
    DemoRiskLevel,
    DemoScenario,
    DemoScenarioStatus,
    DemoShipmentState,
    ManagerDecisionAction,
    ManagerDecisionEvent,
    ManagerDecisionRequest,
    ProvenancedValue,
    RecommendedDecision,
    RiskDriver,
    RiskDriverSeverity,
    SensorFreshness,
    SensorStatus,
    SimulationConfig,
    SimulationMode,
    TimelineEvent,
)
from backend.src.persistence.sqlite_store import SQLiteStore
from backend.src.rules.reroute import build_confidence_score, build_demo_response_options, select_recommended_option
from backend.src.simulation.demo_engine import apply_simulation_step, order_shipments_by_risk
from backend.src.simulation.demo_scenarios import SCENARIO_ID, SCENARIO_NAME, seeded_demo_shipments


EMPTY_MESSAGE = "No demo scenario is loaded. Load Demo Scenario to populate the control center."


class DemoService:
    def __init__(self, store: SQLiteStore) -> None:
        self.store = store

    def get_dashboard_state(self) -> DemoDashboardState:
        scenario = self.store.get_demo_scenario(SCENARIO_ID)
        shipments = self.store.list_demo_shipments(SCENARIO_ID)
        if scenario is None or not shipments:
            return DemoDashboardState(
                scenario_status=DemoScenarioStatus.EMPTY,
                empty_state=True,
                metrics=DemoMetrics(),
                shipments=[],
                message=EMPTY_MESSAGE,
            )
        enriched = [self._enrich_shipment(shipment) for shipment in shipments]
        return DemoDashboardState(
            scenario_status=scenario.status,
            empty_state=False,
            metrics=build_demo_metrics(enriched),
            shipments=order_shipments_by_risk(enriched),
            message=scenario.message,
        )

    def load_demo_scenario(self) -> DemoDashboardState:
        self.store.clear_demo_state(SCENARIO_ID)
        scenario = DemoScenario(
            scenario_id=SCENARIO_ID,
            name=SCENARIO_NAME,
            status=DemoScenarioStatus.LOADED,
            message="Loaded four-shipment WasteWatchers demo scenario.",
        )
        self.store.save_demo_scenario(scenario)
        for shipment in seeded_demo_shipments():
            self.store.save_demo_shipment(SCENARIO_ID, shipment)
        return self.get_dashboard_state()

    def reset_demo_scenario(self) -> DemoDashboardState:
        self.store.clear_demo_state(SCENARIO_ID)
        return DemoDashboardState(
            scenario_status=DemoScenarioStatus.RESET,
            empty_state=True,
            metrics=DemoMetrics(),
            shipments=[],
            message="Demo scenario reset. Load Demo Scenario to start again.",
        )

    def start_simulation(self, config: SimulationConfig) -> DemoDashboardState:
        scenario, shipments = self._loaded_scenario()
        scenario.status = DemoScenarioStatus.RUNNING
        scenario.simulation_interval_seconds = config.interval_seconds
        scenario.message = f"Live simulation running every {config.interval_seconds} seconds."
        self._apply_next_step(scenario, shipments, SimulationMode.LIVE)
        return self.get_dashboard_state()

    def pause_simulation(self) -> DemoDashboardState:
        scenario = self.store.get_demo_scenario(SCENARIO_ID)
        if scenario is None:
            return self.get_dashboard_state()
        scenario.status = DemoScenarioStatus.PAUSED
        scenario.message = "Live simulation paused. Use Advance One Step for manual fallback."
        self.store.save_demo_scenario(scenario)
        return self.get_dashboard_state()

    def advance_simulation_step(self) -> DemoDashboardState:
        scenario, shipments = self._loaded_scenario()
        if scenario.status != DemoScenarioStatus.RUNNING:
            scenario.status = DemoScenarioStatus.PAUSED
        scenario.message = "Manual simulation step applied."
        self._apply_next_step(scenario, shipments, SimulationMode.MANUAL)
        return self.get_dashboard_state()

    def confirm_manager_decision(
        self,
        shipment_id: str,
        request: ManagerDecisionRequest,
    ) -> DemoDashboardState:
        scenario, _shipments = self._loaded_scenario()
        shipment = self.store.get_demo_shipment(SCENARIO_ID, shipment_id)
        if shipment is None:
            return self.get_dashboard_state()

        enriched = self._enrich_shipment(shipment)
        prior_status = enriched.risk_level
        option = next(
            (item for item in enriched.response_options if item.option_id == request.option_id),
            select_recommended_option(enriched.response_options),
        )
        if request.action == ManagerDecisionAction.APPROVE_REROUTE:
            resulting_status = DemoRiskLevel.REROUTE_APPROVED
            destination = option.destination_name if option else enriched.recommended_destination
            message = f"{request.actor_label} approved reroute to {destination}."
        elif request.action == ManagerDecisionAction.SEND_MANUAL_REVIEW:
            resulting_status = DemoRiskLevel.MANUAL_REVIEW
            destination = "Manual review"
            message = f"{request.actor_label} requested manual review."
        else:
            resulting_status = DemoRiskLevel.REJECTED
            destination = "Rejected shipment"
            message = f"{request.actor_label} rejected the shipment."

        recommendation = enriched.recommended_decision
        estimated_net = option.financial_breakdown.estimated_net_value_preserved_usd if option else None
        event = ManagerDecisionEvent(
            event_id=f"DEC-{uuid4().hex[:12]}",
            scenario_id=SCENARIO_ID,
            shipment_id=shipment_id,
            action=request.action,
            actor_label=request.actor_label,
            prior_status=prior_status,
            resulting_status=resulting_status,
            option_id=option.option_id if option else request.option_id,
            destination_name=destination,
            estimated_net_value_preserved_usd=estimated_net,
            recommendation_context=recommendation,
            decision_note=request.decision_note,
            message=message,
        )
        self.store.save_demo_manager_decision(event)
        updated = shipment.model_copy(
            update={
                "risk_level": resulting_status,
                "recommended_destination": destination if resulting_status == DemoRiskLevel.REROUTE_APPROVED else None,
                "value_protected_usd": estimated_net or 0,
                "confirmation_message": message,
            }
        )
        self.store.save_demo_shipment(SCENARIO_ID, updated)
        scenario.message = message
        self.store.save_demo_scenario(scenario)
        return self.get_dashboard_state()

    def _loaded_scenario(self) -> tuple[DemoScenario, list[DemoShipmentState]]:
        scenario = self.store.get_demo_scenario(SCENARIO_ID)
        shipments = self.store.list_demo_shipments(SCENARIO_ID)
        if scenario is None or not shipments:
            self.load_demo_scenario()
            scenario = self.store.get_demo_scenario(SCENARIO_ID)
            shipments = self.store.list_demo_shipments(SCENARIO_ID)
        assert scenario is not None
        return scenario, shipments

    def _apply_next_step(
        self,
        scenario: DemoScenario,
        shipments: list[DemoShipmentState],
        mode: SimulationMode,
    ) -> None:
        next_step = scenario.active_step + 1
        updated_shipments, step = apply_simulation_step(SCENARIO_ID, shipments, next_step, mode)
        scenario.active_step = next_step
        scenario.message = step.message if mode == SimulationMode.MANUAL else scenario.message
        self.store.save_demo_scenario(scenario)
        self.store.save_demo_simulation_step(step)
        for shipment in updated_shipments:
            self.store.save_demo_shipment(SCENARIO_ID, shipment)

    def _enrich_shipment(self, shipment: DemoShipmentState) -> DemoShipmentState:
        latest_update = shipment.temperature_history[-1].recorded_at if shipment.temperature_history else None
        now = utc_now()
        age_minutes = int((now - latest_update).total_seconds() // 60) if latest_update else None
        sensor_status = SensorStatus.SIMULATED
        if latest_update is None:
            sensor_status = SensorStatus.MISSING
        elif age_minutes is not None and age_minutes > 45:
            sensor_status = SensorStatus.STALE
        freshness = SensorFreshness(
            status=sensor_status,
            latest_update_at=latest_update,
            age_minutes=age_minutes,
            message=_freshness_message(sensor_status, age_minutes),
        )
        confidence = build_confidence_score(shipment.model_copy(update={"sensor_freshness": freshness}))
        options = build_demo_response_options(shipment.model_copy(update={"sensor_freshness": freshness, "confidence": confidence}))
        recommended_option = select_recommended_option(options)
        latest_decision = self.store.latest_demo_manager_decision(SCENARIO_ID, shipment.shipment_id)
        terminal = shipment.risk_level in {
            DemoRiskLevel.REROUTE_APPROVED,
            DemoRiskLevel.MANUAL_REVIEW,
            DemoRiskLevel.REJECTED,
        }
        recommendation = None
        if recommended_option and not terminal:
            deadline_at = now + timedelta(minutes=shipment.time_remaining_to_act_minutes)
            recommendation = RecommendedDecision(
                recommendation_id=f"REC-{shipment.shipment_id}",
                title=f"Reroute to {recommended_option.destination_name} within {shipment.time_remaining_to_act_minutes} minutes",
                destination_type=recommended_option.destination_type,
                destination_name=recommended_option.destination_name,
                rationale=_recommendation_rationale(shipment, recommended_option.destination_name),
                deadline_at=deadline_at,
                travel_time_minutes=recommended_option.travel_time_minutes,
                expected_condition_at_arrival=recommended_option.expected_condition_at_arrival,
                financial_breakdown=recommended_option.financial_breakdown,
                confidence=confidence,
                expected_post_action_risk=_post_action_risk(shipment.risk_level),
                option_id=recommended_option.option_id,
            )
        elif latest_decision and latest_decision.recommendation_context:
            recommendation = latest_decision.recommendation_context

        selected_financial = recommended_option.financial_breakdown if recommended_option else None
        deadline_at = now + timedelta(minutes=shipment.time_remaining_to_act_minutes)
        timeline = [
            TimelineEvent(
                event_id=f"{shipment.shipment_id}:latest-temp",
                occurred_at=latest_update or now,
                title="Latest simulated telemetry",
                detail=(
                    f"{shipment.temperature_c:.1f} C recorded"
                    if latest_update
                    else "Temperature signal unavailable"
                ),
            ),
            TimelineEvent(
                event_id=f"{shipment.shipment_id}:change-summary",
                occurred_at=now,
                title="Decision model update",
                detail=shipment.confirmation_message or "Dashboard values recalculated from current demo state.",
            ),
        ]
        unavailable = [
            ProvenancedValue(
                label="Weather",
                provenance=DataProvenance.UNAVAILABLE,
                unavailable_reason="No weather integration configured for this demo.",
            ),
            ProvenancedValue(
                label="Live traffic",
                provenance=DataProvenance.UNAVAILABLE,
                unavailable_reason="No traffic integration configured for this demo.",
            ),
            ProvenancedValue(
                label="GPS coordinates",
                provenance=DataProvenance.UNAVAILABLE,
                unavailable_reason="Coordinates are not fabricated when unavailable.",
            ),
        ]
        technical_details = [
            ProvenancedValue(
                label="Time outside safe range",
                value=_minutes_outside_safe_range(shipment),
                unit="minutes",
                provenance=DataProvenance.CALCULATED,
            ),
            ProvenancedValue(
                label="Cumulative exposure",
                value=round(_cumulative_exposure(shipment), 1),
                unit="degree-minutes C",
                provenance=DataProvenance.CALCULATED,
            ),
            ProvenancedValue(
                label="Temperature trend",
                value=_temperature_trend(shipment),
                provenance=DataProvenance.CALCULATED,
            ),
        ]
        expected_arrival = recommended_option.shelf_life_at_arrival_hours if recommended_option else None
        recommended_destination = (
            recommendation.destination_name
            if recommendation and not terminal
            else shipment.recommended_destination
        )
        return shipment.model_copy(
            update={
                "decision_deadline_at": deadline_at,
                "latest_update_at": latest_update,
                "change_summary": shipment.confirmation_message or "No material change since last update.",
                "sensor_freshness": freshness,
                "confidence": confidence,
                "risk_drivers": _risk_drivers(shipment, freshness),
                "response_options": options,
                "recommended_decision": recommendation,
                "event_timeline": timeline,
                "unavailable_signals": unavailable,
                "technical_details": technical_details,
                "expected_shelf_life_at_arrival_hours": expected_arrival,
                "recommended_destination": recommended_destination,
                "value_protected_usd": (
                    selected_financial.estimated_net_value_preserved_usd
                    if selected_financial and not terminal
                    else shipment.value_protected_usd
                ),
            }
        )


def build_demo_metrics(shipments: list[DemoShipmentState]) -> DemoMetrics:
    at_risk_levels = {DemoRiskLevel.AT_RISK, DemoRiskLevel.CRITICAL}
    net_value = sum(
        shipment.recommended_decision.financial_breakdown.estimated_net_value_preserved_usd
        for shipment in shipments
        if shipment.recommended_decision is not None
    )
    legacy_value = sum(shipment.value_protected_usd for shipment in shipments) or net_value or sum(
        shipment.estimated_value_usd for shipment in shipments
    )
    return DemoMetrics(
        active_shipments=len(shipments),
        at_risk_shipments=sum(1 for shipment in shipments if shipment.risk_level in at_risk_levels),
        critical_shipments=sum(1 for shipment in shipments if shipment.risk_level == DemoRiskLevel.CRITICAL),
        estimated_value_protected_usd=legacy_value,
        estimated_net_value_preserved_usd=net_value,
    )


def _freshness_message(status: SensorStatus, age_minutes: int | None) -> str:
    if status == SensorStatus.MISSING:
        return "Data unavailable"
    if status == SensorStatus.STALE:
        return f"Telemetry stale for {age_minutes} minutes"
    return f"Simulated telemetry updated {age_minutes or 0} minutes ago"


def _minutes_outside_safe_range(shipment: DemoShipmentState) -> int:
    return sum(
        15
        for reading in shipment.temperature_history
        if reading.temperature_c < shipment.safe_temp_min_c or reading.temperature_c > shipment.safe_temp_max_c
    )


def _cumulative_exposure(shipment: DemoShipmentState) -> float:
    return sum(
        max(0.0, reading.temperature_c - shipment.safe_temp_max_c) * 15
        for reading in shipment.temperature_history
    )


def _temperature_trend(shipment: DemoShipmentState) -> str:
    if len(shipment.temperature_history) < 2:
        return "Data unavailable"
    delta = shipment.temperature_history[-1].temperature_c - shipment.temperature_history[0].temperature_c
    if delta >= 1.0:
        return "Warming"
    if delta <= -1.0:
        return "Cooling"
    return "Stable"


def _risk_drivers(shipment: DemoShipmentState, freshness: SensorFreshness) -> list[RiskDriver]:
    drivers: list[RiskDriver] = []
    temp_delta = shipment.temperature_c - shipment.safe_temp_max_c
    if temp_delta > 0:
        severity = RiskDriverSeverity.CRITICAL if temp_delta >= 8 else RiskDriverSeverity.HIGH
        drivers.append(
            RiskDriver(
                driver_id="temperature_excursion",
                title="Temperature above safe range",
                explanation=f"Current simulated temperature is {temp_delta:.1f} C above the safe maximum.",
                severity=severity,
                provenance=DataProvenance.SIMULATED,
                value=f"{shipment.temperature_c:.1f} C",
            )
        )
    if shipment.remaining_shelf_life_hours <= 36:
        severity = RiskDriverSeverity.CRITICAL if shipment.remaining_shelf_life_hours <= 8 else RiskDriverSeverity.HIGH
        drivers.append(
            RiskDriver(
                driver_id="shelf_life",
                title="Shelf life is narrowing",
                explanation=f"{shipment.remaining_shelf_life_hours:.1f} hours remain before recovery options expire.",
                severity=severity,
                provenance=DataProvenance.CALCULATED,
                value=f"{shipment.remaining_shelf_life_hours:.1f} hours",
            )
        )
    if freshness.status in {SensorStatus.STALE, SensorStatus.MISSING}:
        drivers.append(
            RiskDriver(
                driver_id="sensor_freshness",
                title="Telemetry freshness",
                explanation=freshness.message,
                severity=RiskDriverSeverity.HIGH,
                provenance=DataProvenance.CALCULATED,
                value=freshness.status.value,
            )
        )
    if not drivers:
        drivers.append(
            RiskDriver(
                driver_id="stable_condition",
                title="Condition currently stable",
                explanation="Temperature and shelf-life signals remain within the demo tolerance.",
                severity=RiskDriverSeverity.LOW,
                provenance=DataProvenance.CALCULATED,
            )
        )
    return drivers[:3]


def _recommendation_rationale(shipment: DemoShipmentState, destination_name: str) -> str:
    return (
        f"{shipment.crop} has {shipment.remaining_shelf_life_hours:.1f} shelf-life hours left; "
        f"{destination_name} offers the best viable recovery under demo assumptions."
    )


def _post_action_risk(current: DemoRiskLevel) -> DemoRiskLevel:
    if current == DemoRiskLevel.CRITICAL:
        return DemoRiskLevel.AT_RISK
    if current == DemoRiskLevel.AT_RISK:
        return DemoRiskLevel.WATCH
    return current
