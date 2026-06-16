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

export interface TemperatureReadingPoint {
  recorded_at: string;
  temperature_c: number;
}

export interface DemoMetrics {
  active_shipments: number;
  at_risk_shipments: number;
  critical_shipments: number;
  estimated_value_protected_usd: number;
}

export interface DemoShipmentState {
  shipment_id: string;
  trailer_id: string;
  truck_id: string;
  pallet_id: string;
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
}

export interface DemoDashboardState {
  scenario_status: DemoScenarioStatus;
  empty_state: boolean;
  metrics: DemoMetrics;
  shipments: DemoShipmentState[];
  message: string;
}
