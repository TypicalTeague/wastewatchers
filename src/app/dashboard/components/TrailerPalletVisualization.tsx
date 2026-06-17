"use client";

import {
  formatTemperature,
  palletConditionLabel,
  palletShortLabel,
  palletVisualizationTheme,
  riskBadgeClasses,
  riskHeadline,
  safeRangeLabel,
  shelfLifeSummary,
  temperatureGaugeModel,
  temperatureSummary,
} from "@/lib/api/display";
import {
  emptyPalletPositions,
  PALLET_SLOT_LAYOUT,
  shipmentByPalletPosition,
} from "@/lib/api/trailer";
import type { DemoShipmentState, PalletColor } from "@/lib/api/types";

interface TrailerPalletVisualizationProps {
  trailerShipments: DemoShipmentState[];
  selectedShipmentId: string;
  onSelectShipment: (shipmentId: string) => void;
}

const PALLET_FILL: Record<PalletColor, { fill: string; stroke: string; text: string }> = {
  green: { fill: "#34d399", stroke: "#059669", text: "#ecfdf5" },
  yellow: { fill: "#fbbf24", stroke: "#d97706", text: "#451a03" },
  red: { fill: "#f87171", stroke: "#dc2626", text: "#fef2f2" },
  gray: { fill: "#a1a1aa", stroke: "#52525b", text: "#fafafa" },
};

const STATUS_ICON: Record<PalletColor, string> = {
  green: "✓",
  yellow: "!",
  red: "!!",
  gray: "?",
};

export default function TrailerPalletVisualization({
  trailerShipments,
  selectedShipmentId,
  onSelectShipment,
}: TrailerPalletVisualizationProps) {
  if (trailerShipments.length === 0) {
    return null;
  }

  const anchor = trailerShipments[0];
  const selectedShipment =
    trailerShipments.find((shipment) => shipment.shipment_id === selectedShipmentId) ??
    anchor;
  const theme = palletVisualizationTheme(selectedShipment.pallet_color);
  const gauge = temperatureGaugeModel(selectedShipment);
  const isCritical = selectedShipment.pallet_color === "red";
  const shelfPercent = Math.min(
    100,
    Math.max(0, selectedShipment.remaining_shelf_life_percent),
  );
  const capacity = anchor.trailer_pallet_capacity;
  const emptyPositions = emptyPalletPositions(trailerShipments);
  const svgId = anchor.trailer_id.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-slate-50 via-white to-zinc-100 shadow-sm transition-all duration-500 ease-out dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 bg-zinc-900 px-4 py-3 dark:border-zinc-700">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Reefer interior · top-down
          </p>
          <p className="truncate text-sm font-medium text-zinc-300">
            {anchor.truck_id} · {anchor.trailer_id}
          </p>
          <p className="text-xs text-zinc-400">
            {trailerShipments.length} of {capacity} pallet positions occupied
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm ${riskBadgeClasses(selectedShipment.risk_level)}`}
        >
          {isCritical && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
          )}
          {selectedShipment.pallet_id}: {riskHeadline(selectedShipment.risk_level)}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4 lg:p-5">
        <div
          className={`w-full rounded-xl border bg-gradient-to-b p-3 sm:p-4 ${theme.border} ${theme.fill}`}
        >
          <svg
            viewBox="0 0 360 420"
            className="mx-auto block h-auto w-full max-w-md"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`Trailer ${anchor.trailer_id} with ${trailerShipments.length} loaded pallets`}
          >
            <defs>
              <linearGradient id={`floor-${svgId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <rect x="20" y="10" width="320" height="400" rx="12" fill="#52525b" stroke="#27272a" strokeWidth="3" />
            <rect x="28" y="18" width="304" height="384" rx="8" fill={`url(#floor-${svgId})`} stroke="#94a3b8" strokeWidth="1" />

            <rect x="28" y="18" width="304" height="56" rx="8" fill="#334155" />
            <rect x="40" y="28" width="280" height="36" rx="4" fill="#1e293b" />
            <text x="180" y="42" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.08em">
              REFRIGERATION UNIT
            </text>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={48 + i * 44} y="50" width="32" height="8" rx="2" fill="#0891b2" opacity={0.45 + (i % 3) * 0.15} />
            ))}

            <text x="180" y="112" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">
              CARGO FLOOR · PALLET POSITIONS
            </text>

            {Array.from({ length: capacity }, (_, index) => index + 1).map((position) => {
              const slot = PALLET_SLOT_LAYOUT[position];
              if (!slot) {
                return null;
              }

              const shipment = shipmentByPalletPosition(trailerShipments, position);
              if (shipment) {
                const isSelected = shipment.shipment_id === selectedShipmentId;
                const style = PALLET_FILL[shipment.pallet_color];
                return (
                  <g
                    key={position}
                    transform={`translate(${slot.x}, ${slot.y})`}
                    onClick={() => onSelectShipment(shipment.shipment_id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectShipment(shipment.shipment_id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${shipment.pallet_id} ${palletShortLabel(shipment.pallet_color)} at position ${position}`}
                    className="cursor-pointer outline-none"
                  >
                    <rect
                      x="0"
                      y="0"
                      width={slot.width}
                      height={slot.height}
                      rx="6"
                      fill={style.fill}
                      stroke={isSelected ? "#ffffff" : style.stroke}
                      strokeWidth={isSelected ? 4 : 2.5}
                    />
                    <rect x="8" y="8" width="112" height="56" rx="4" fill={style.fill} opacity="0.85" />
                    <text x="64" y="36" textAnchor="middle" fill={style.text} fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">
                      {shipment.commodity_abbrev}
                    </text>
                    <circle cx="112" cy="12" r="14" fill={style.stroke} />
                    <text x="112" y="16" textAnchor="middle" fill={style.text} fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">
                      {STATUS_ICON[shipment.pallet_color]}
                    </text>
                    <text x="64" y="78" textAnchor="middle" fill={style.text} fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
                      {shipment.pallet_id}
                    </text>
                    <text x="64" y="92" textAnchor="middle" fill={style.text} fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
                      {palletShortLabel(shipment.pallet_color).toUpperCase()}
                    </text>
                  </g>
                );
              }

              if (!emptyPositions.includes(position)) {
                return null;
              }

              return (
                <rect
                  key={position}
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  rx="6"
                  fill="#f1f5f9"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
              );
            })}

            <rect x="28" y="354" width="304" height="48" rx="8" fill="#475569" />
            <line x1="180" y1="358" x2="180" y2="398" stroke="#334155" strokeWidth="3" />
            <text x="180" y="384" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.1em">
              REAR DOORS
            </text>
          </svg>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {selectedShipment.pallet_id} temperature
                </p>
                <p className={`mt-1 text-3xl font-extrabold tabular-nums ${theme.accent}`}>
                  {formatTemperature(selectedShipment.temperature_c)}
                </p>
              </div>
              <div className="rounded-lg bg-cyan-50 px-2.5 py-1.5 text-right dark:bg-cyan-950/40">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                  Safe band
                </p>
                <p className="text-xs font-medium text-cyan-900 dark:text-cyan-100">
                  {safeRangeLabel(selectedShipment)}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {temperatureSummary(selectedShipment)}
            </p>
            <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="absolute inset-y-0 rounded-full bg-emerald-400/70 dark:bg-emerald-500/50"
                style={{
                  left: `${gauge.safeStartPercent}%`,
                  width: `${gauge.safeEndPercent - gauge.safeStartPercent}%`,
                }}
              />
              <div
                className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-all duration-500 ${
                  selectedShipment.pallet_color === "red"
                    ? "bg-red-500"
                    : selectedShipment.pallet_color === "yellow"
                      ? "bg-amber-400"
                      : selectedShipment.pallet_color === "gray"
                        ? "bg-zinc-400"
                        : "bg-emerald-500"
                }`}
                style={{ left: `${gauge.markerPercent}%` }}
                aria-hidden
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {selectedShipment.pallet_id} shelf life
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {shelfLifeSummary(selectedShipment)}
            </p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  selectedShipment.pallet_color === "red"
                    ? "bg-red-500"
                    : selectedShipment.pallet_color === "yellow"
                      ? "bg-amber-400"
                      : selectedShipment.pallet_color === "gray"
                        ? "bg-zinc-400"
                        : "bg-emerald-500"
                }`}
                style={{ width: `${shelfPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {palletConditionLabel(selectedShipment.pallet_color)} · {selectedShipment.crop}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900/60">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Pallet condition key
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <LegendSwatch color="green" label="Stable" icon="✓" />
            <LegendSwatch color="yellow" label="Watch" icon="!" />
            <LegendSwatch color="red" label="Critical" icon="!!" />
            <LegendSwatch color="gray" label="No signal" icon="?" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function LegendSwatch({
  color,
  label,
  icon,
}: {
  color: PalletColor;
  label: string;
  icon: string;
}) {
  const dot =
    color === "green"
      ? "bg-emerald-500"
      : color === "yellow"
        ? "bg-amber-400"
        : color === "red"
          ? "bg-red-500"
          : "bg-zinc-400";

  return (
    <li className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${dot}`}>
        {icon}
      </span>
      {label}
    </li>
  );
}
