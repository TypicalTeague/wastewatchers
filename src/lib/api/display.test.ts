import {
  celsiusToFahrenheit,
  estimatedNetValueLabel,
  formatCurrency,
  formatMaybeValue,
  formatTemperature,
  safeRangeLabel,
  sortShipmentsByRisk,
} from "./display";
import type { DemoShipmentState } from "./types";

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, received ${String(actual)}`);
  }
}

const baseShipment: DemoShipmentState = {
  shipment_id: "TEST-1",
  trailer_id: "TRL-1",
  truck_id: "TRK-1",
  pallet_id: "PAL-1",
  pallet_position: 1,
  trailer_pallet_capacity: 4,
  commodity_abbrev: "BERRY",
  crop: "Demo Berries",
  origin: "Demo Origin",
  planned_destination: "Demo Destination",
  recommended_destination: null,
  risk_level: "watch",
  pallet_color: "yellow",
  remaining_shelf_life_hours: 24,
  remaining_shelf_life_percent: 50,
  temperature_c: 0,
  safe_temp_min_c: 0,
  safe_temp_max_c: 2,
  temperature_history: [],
  estimated_value_usd: 1000,
  value_protected_usd: 0,
  time_remaining_to_act_minutes: 90,
  confirmation_message: "",
  decision_deadline_at: null,
  latest_update_at: null,
  change_summary: "",
  sensor_freshness: null,
  confidence: null,
  expected_shelf_life_at_arrival_hours: null,
  risk_drivers: [],
  response_options: [],
  recommended_decision: null,
  event_timeline: [],
  unavailable_signals: [],
  technical_details: [],
};

assertEqual(celsiusToFahrenheit(0), 32, "freezing converts to Fahrenheit");
assertEqual(formatTemperature(2.25), "36.0°F", "temperature display uses Fahrenheit");
assertEqual(safeRangeLabel(baseShipment), "32° to 36°F safe band", "safe range uses Fahrenheit");
assertEqual(formatMaybeValue(null), "Data unavailable", "missing values are explicit");
assertEqual(formatCurrency(1500), "$1,500", "currency formatting is unchanged");
assertEqual(estimatedNetValueLabel(), "Estimated net value preserved", "protected value wording is replaced");
assertEqual(
  sortShipmentsByRisk([
    { ...baseShipment, shipment_id: "late", risk_level: "critical", time_remaining_to_act_minutes: 90 },
    { ...baseShipment, shipment_id: "soon", risk_level: "critical", time_remaining_to_act_minutes: 15 },
  ])[0].shipment_id,
  "soon",
  "queue tie-breaker uses deadline",
);

