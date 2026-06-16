/** Types aligned with backend/src/models/demo.py — display-only on the client. */

export type DemoScenarioStatus =
  | "empty"
  | "loaded"
  | "running"
  | "paused"
  | "reset";

export type DemoRiskLevel =
  | "healthy"
  | "watch"
  | "at_risk"
  | "critical"
  | "manual_review"
  | "reroute_approved"
  | "rejected";

export type PalletColor = "green" | "yellow" | "red" | "gray";

export type DataProvenance =
  | "measured"
  | "calculated"
  | "simulated"
  | "demo_assumption"
  | "manager_entered"
  | "unavailable";

export type DestinationType =
  | "continue_delivery"
  | "secondary_market"
  | "food_processor"
  | "compost_facility"
  | "reject_dispose"
  | "manual_review";

export type OptionViability =
  | "recommended"
  | "viable_alternative"
  | "not_viable";

export type SensorStatus = "fresh" | "stale" | "missing" | "simulated";

export type ConfidenceLevel =
  | "high"
  | "medium"
  | "low"
  | "manual_review_required";

export type OperationalRisk = "low" | "medium" | "high";

export type RiskDriverSeverity = "low" | "medium" | "high" | "critical";

export type ManagerDecisionAction =
  | "approve_reroute"
  | "send_manual_review"
  | "reject_shipment";

export interface TemperatureReadingPoint {
  recorded_at: string;
  temperature_c: number;
}

export interface ProvenancedValue {
  label: string;
  value: string | number | null;
  unit: string | null;
  provenance: DataProvenance;
  source: string;
  unavailable_reason: string | null;
}

export interface SensorFreshness {
  status: SensorStatus;
  latest_update_at: string | null;
  age_minutes: number | null;
  provenance: DataProvenance;
  message: string;
}

export interface ConfidenceScore {
  level: ConfidenceLevel;
  score: number;
  reason_codes: string[];
  provenance: DataProvenance;
}

export interface RiskDriver {
  driver_id: string;
  title: string;
  explanation: string;
  severity: RiskDriverSeverity;
  provenance: DataProvenance;
  value: string | null;
}

export interface FinancialBreakdown {
  original_cargo_value_usd: number;
  destination_acceptance_percent: number;
  expected_gross_recovery_usd: number;
  rerouting_transportation_cost_usd: number;
  sorting_handling_cost_usd: number;
  processing_destination_fee_usd: number;
  avoided_disposal_cost_usd: number;
  expected_unrecovered_value_usd: number;
  estimated_net_value_preserved_usd: number;
  value_recovery_usd: number;
  cost_avoidance_usd: number;
  incremental_cost_usd: number;
  provenance: DataProvenance;
  input_provenance: ProvenancedValue[];
  estimate_disclaimer: string;
}

export interface ResponseOption {
  option_id: string;
  destination_type: DestinationType;
  destination_name: string;
  travel_time_minutes: number;
  expected_condition_at_arrival: string;
  acceptance_percent: number;
  financial_breakdown: FinancialBreakdown;
  expected_waste_diversion_percent: number;
  operational_risk: OperationalRisk;
  viability: OptionViability;
  viability_reason: string;
  shelf_life_at_arrival_hours: number;
  food_safety_blocked: boolean;
  assumptions: ProvenancedValue[];
}

export interface RecommendedDecision {
  recommendation_id: string;
  title: string;
  destination_type: DestinationType;
  destination_name: string;
  rationale: string;
  deadline_at: string | null;
  travel_time_minutes: number;
  expected_condition_at_arrival: string;
  financial_breakdown: FinancialBreakdown;
  confidence: ConfidenceScore;
  expected_post_action_risk: DemoRiskLevel;
  option_id: string;
  status: DemoRiskLevel | null;
}

export interface TimelineEvent {
  event_id: string;
  occurred_at: string;
  title: string;
  detail: string;
  provenance: DataProvenance;
}

export interface DemoMetrics {
  active_shipments: number;
  at_risk_shipments: number;
  critical_shipments: number;
  estimated_value_protected_usd: number;
  estimated_net_value_preserved_usd: number;
}

export interface DemoShipmentState {
  shipment_id: string;
  trailer_id: string;
  truck_id: string;
  pallet_id: string;
  pallet_position: number;
  trailer_pallet_capacity: number;
  commodity_abbrev: string;
  crop: string;
  origin: string;
  planned_destination: string;
  recommended_destination: string | null;
  risk_level: DemoRiskLevel;
  pallet_color: PalletColor;
  remaining_shelf_life_hours: number;
  remaining_shelf_life_percent: number;
  temperature_c: number;
  safe_temp_min_c: number;
  safe_temp_max_c: number;
  temperature_history: TemperatureReadingPoint[];
  estimated_value_usd: number;
  value_protected_usd: number;
  time_remaining_to_act_minutes: number;
  confirmation_message: string;
  decision_deadline_at: string | null;
  latest_update_at: string | null;
  change_summary: string;
  sensor_freshness: SensorFreshness | null;
  confidence: ConfidenceScore | null;
  expected_shelf_life_at_arrival_hours: number | null;
  risk_drivers: RiskDriver[];
  response_options: ResponseOption[];
  recommended_decision: RecommendedDecision | null;
  event_timeline: TimelineEvent[];
  unavailable_signals: ProvenancedValue[];
  technical_details: ProvenancedValue[];
}

export interface DemoDashboardState {
  scenario_status: DemoScenarioStatus;
  empty_state: boolean;
  metrics: DemoMetrics;
  shipments: DemoShipmentState[];
  message: string;
}

export interface SimulationConfig {
  interval_seconds: number;
}

export interface ManagerDecisionRequest {
  action: ManagerDecisionAction;
  actor_label: string;
  option_id?: string | null;
  confirmation_acknowledged: boolean;
  decision_note?: string | null;
}
