import type { DemoRiskLevel, DemoScenarioStatus, DemoShipmentState, PalletColor } from "./types";

/** Display ordering only — values come from the API. */
const RISK_SORT_ORDER: Record<DemoRiskLevel, number> = {
  critical: 0,
  at_risk: 1,
  watch: 2,
  healthy: 3,
  manual_review: 4,
  reroute_approved: 5,
  rejected: 6,
};

export function sortShipmentsByRisk(
  shipments: DemoShipmentState[],
): DemoShipmentState[] {
  return [...shipments].sort(
    (a, b) =>
      RISK_SORT_ORDER[a.risk_level] - RISK_SORT_ORDER[b.risk_level] ||
      a.shipment_id.localeCompare(b.shipment_id),
  );
}

export function riskHeadline(risk: DemoRiskLevel): string {
  const labels: Record<DemoRiskLevel, string> = {
    critical: "Critical — act now",
    at_risk: "At risk — reroute likely",
    watch: "Watch — monitor closely",
    healthy: "Healthy — on track",
    manual_review: "Needs manual review",
    reroute_approved: "Reroute approved",
    rejected: "Shipment rejected",
  };
  return labels[risk];
}

export function scenarioStatusLabel(status: DemoScenarioStatus): string {
  const labels: Record<DemoScenarioStatus, string> = {
    empty: "No scenario loaded",
    loaded: "Scenario ready",
    running: "Simulation running",
    paused: "Simulation paused",
    reset: "Scenario reset",
  };
  return labels[status];
}

export function simulationModeLabel(status: DemoScenarioStatus): string {
  if (status === "running") {
    return "Live simulation running";
  }
  if (status === "paused") {
    return "Simulation paused — use Advance Step for manual updates";
  }
  return "Simulation ready";
}

export function palletConditionLabel(color: PalletColor): string {
  const labels: Record<PalletColor, string> = {
    green: "Stable condition",
    yellow: "Temperature watch",
    red: "Critical condition",
    gray: "Telemetry unavailable",
  };
  return labels[color];
}

export function shelfLifeSummary(shipment: DemoShipmentState): string {
  const hours = shipment.remaining_shelf_life_hours;
  if (hours <= 8) {
    return `Only about ${Math.round(hours)} hours of shelf life left`;
  }
  if (hours <= 24) {
    return `Roughly ${Math.round(hours)} hours of shelf life remaining`;
  }
  const days = Math.round(hours / 24);
  return `About ${days} day${days === 1 ? "" : "s"} of shelf life remaining`;
}

export function temperatureSummary(shipment: DemoShipmentState): string {
  const { temperature_c, safe_temp_min_c, safe_temp_max_c } = shipment;
  if (temperature_c < safe_temp_min_c) {
    return "Colder than the safe range — check refrigeration";
  }
  if (temperature_c > safe_temp_max_c) {
    return "Above the safe temperature range";
  }
  return "Within the safe temperature range";
}

export function destinationSummary(shipment: DemoShipmentState): string {
  if (shipment.recommended_destination) {
    return `Recommended salvage destination: ${shipment.recommended_destination}`;
  }
  return `Planned destination: ${shipment.planned_destination}`;
}

export function actionWindowSummary(shipment: DemoShipmentState): string {
  const minutes = shipment.time_remaining_to_act_minutes;
  if (minutes <= 60) {
    return `Decision needed within the next hour`;
  }
  const hours = Math.round(minutes / 60);
  return `About ${hours} hour${hours === 1 ? "" : "s"} to decide next steps`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function riskBadgeClasses(risk: DemoRiskLevel): string {
  switch (risk) {
    case "critical":
      return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300";
    case "at_risk":
      return "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300";
    case "watch":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200";
    case "healthy":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

export function palletDotClasses(color: PalletColor): string {
  switch (color) {
    case "green":
      return "bg-emerald-500";
    case "yellow":
      return "bg-amber-400";
    case "red":
      return "bg-red-500";
    case "gray":
      return "bg-zinc-400";
  }
}

export function palletShortLabel(color: PalletColor): string {
  const labels: Record<PalletColor, string> = {
    green: "Stable",
    yellow: "Watch",
    red: "Critical",
    gray: "No signal",
  };
  return labels[color];
}

/** Visual gauge bounds derived from API safe band — display only. */
export function temperatureGaugeModel(shipment: DemoShipmentState): {
  min: number;
  max: number;
  safeMin: number;
  safeMax: number;
  current: number;
  markerPercent: number;
  safeStartPercent: number;
  safeEndPercent: number;
} {
  const { temperature_c, safe_temp_min_c, safe_temp_max_c } = shipment;
  const span = Math.max(safe_temp_max_c - safe_temp_min_c, 2);
  const min = safe_temp_min_c - span * 0.6;
  const max = safe_temp_max_c + span * 1.4;
  const range = max - min;
  const clamp = (value: number) => Math.min(100, Math.max(0, ((value - min) / range) * 100));

  return {
    min,
    max,
    safeMin: safe_temp_min_c,
    safeMax: safe_temp_max_c,
    current: temperature_c,
    markerPercent: clamp(temperature_c),
    safeStartPercent: clamp(safe_temp_min_c),
    safeEndPercent: clamp(safe_temp_max_c),
  };
}

export function palletVisualizationTheme(color: PalletColor): {
  accent: string;
  glow: string;
  fill: string;
  border: string;
  ring: string;
  text: string;
} {
  switch (color) {
    case "green":
      return {
        accent: "text-emerald-600",
        glow: "shadow-emerald-500/30",
        fill: "from-emerald-400/20 via-emerald-500/10 to-cyan-500/5",
        border: "border-emerald-400/60",
        ring: "ring-emerald-400/40",
        text: "text-emerald-700 dark:text-emerald-300",
      };
    case "yellow":
      return {
        accent: "text-amber-600",
        glow: "shadow-amber-500/35",
        fill: "from-amber-400/25 via-amber-500/10 to-orange-500/5",
        border: "border-amber-400/70",
        ring: "ring-amber-400/45",
        text: "text-amber-800 dark:text-amber-200",
      };
    case "red":
      return {
        accent: "text-red-600",
        glow: "shadow-red-500/40",
        fill: "from-red-400/30 via-red-500/15 to-orange-600/5",
        border: "border-red-400/80",
        ring: "ring-red-400/50",
        text: "text-red-700 dark:text-red-300",
      };
    case "gray":
      return {
        accent: "text-zinc-500",
        glow: "shadow-zinc-500/20",
        fill: "from-zinc-400/15 via-zinc-500/5 to-transparent",
        border: "border-zinc-400/50",
        ring: "ring-zinc-400/30",
        text: "text-zinc-600 dark:text-zinc-400",
      };
  }
}

export function formatTemperature(celsius: number): string {
  return `${celsius.toFixed(1)}°C`;
}

export function safeRangeLabel(shipment: DemoShipmentState): string {
  return `${shipment.safe_temp_min_c.toFixed(0)}° to ${shipment.safe_temp_max_c.toFixed(0)}°C safe band`;
}
