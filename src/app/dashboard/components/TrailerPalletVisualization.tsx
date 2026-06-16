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
import type { DemoShipmentState } from "@/lib/api/types";

interface TrailerPalletVisualizationProps {
  shipment: DemoShipmentState;
}

export default function TrailerPalletVisualization({
  shipment,
}: TrailerPalletVisualizationProps) {
  const theme = palletVisualizationTheme(shipment.pallet_color);
  const gauge = temperatureGaugeModel(shipment);
  const isCritical = shipment.pallet_color === "red";
  const shelfPercent = Math.min(100, Math.max(0, shipment.remaining_shelf_life_percent));

  return (
    <div
      key={shipment.shipment_id}
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-slate-50 via-white to-zinc-100 shadow-sm transition-all duration-500 ease-out dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950"
    >
      {/* Header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 bg-zinc-900 px-4 py-3 dark:border-zinc-700">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Live reefer view
          </p>
          <p className="text-sm font-medium text-zinc-300">
            {shipment.truck_id} · {shipment.trailer_id}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${riskBadgeClasses(shipment.risk_level)}`}
        >
          {isCritical && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
          )}
          {riskHeadline(shipment.risk_level)}
        </span>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-5 lg:p-5">
        {/* Trailer illustration */}
        <div
          className={`relative rounded-xl border bg-gradient-to-br p-3 shadow-lg ${theme.border} ${theme.glow} ${theme.fill}`}
        >
          <svg
            viewBox="0 0 420 200"
            className="mx-auto h-auto w-full max-w-lg"
            role="img"
            aria-label={`Refrigerated trailer carrying ${shipment.crop}, pallet status ${palletShortLabel(shipment.pallet_color)}`}
          >
            <defs>
              <linearGradient id="reeferCold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.12" />
              </linearGradient>
              <linearGradient id="trailerBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e4e4e7" />
                <stop offset="100%" stopColor="#a1a1aa" />
              </linearGradient>
              <filter id="palletGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ground */}
            <rect x="0" y="168" width="420" height="32" fill="#27272a" opacity="0.9" />
            <line x1="0" y1="168" x2="420" y2="168" stroke="#52525b" strokeWidth="1" />

            {/* Wheels */}
            <circle cx="72" cy="168" r="18" fill="#18181b" />
            <circle cx="72" cy="168" r="10" fill="#3f3f46" />
            <circle cx="340" cy="168" r="18" fill="#18181b" />
            <circle cx="340" cy="168" r="10" fill="#3f3f46" />
            <circle cx="380" cy="168" r="18" fill="#18181b" />
            <circle cx="380" cy="168" r="10" fill="#3f3f46" />

            {/* Cab */}
            <path
              d="M24 108 L24 168 L88 168 L88 92 L58 72 L24 88 Z"
              fill="#3f3f46"
              stroke="#52525b"
              strokeWidth="1.5"
            />
            <rect x="32" y="98" width="28" height="22" rx="3" fill="#67e8f9" opacity="0.5" />

            {/* Reefer unit */}
            <rect x="88" y="78" width="36" height="90" rx="4" fill="#52525b" stroke="#71717a" />
            <rect x="94" y="86" width="24" height="50" rx="2" fill="#27272a" />
            {[0, 1, 2, 3].map((row) => (
              <rect
                key={row}
                x="97"
                y={90 + row * 11}
                width="18"
                height="7"
                rx="1"
                fill="#0891b2"
                opacity={0.5 + row * 0.1}
              />
            ))}

            {/* Trailer box */}
            <rect
              x="124"
              y="68"
              width="268"
              height="100"
              rx="6"
              fill="url(#trailerBody)"
              stroke="#71717a"
              strokeWidth="2"
            />

            {/* Interior cold zone */}
            <rect
              x="132"
              y="76"
              width="252"
              height="84"
              rx="4"
              fill="url(#reeferCold)"
              stroke="#a5f3fc"
              strokeWidth="1"
              strokeOpacity="0.35"
            />

            {/* Cold air flow lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M${145 + i * 48} 82 Q${160 + i * 48} 110 ${145 + i * 48} 148`}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1"
                strokeOpacity="0.2"
                strokeDasharray="4 6"
              />
            ))}

            {/* Pallet stack */}
            <g filter="url(#palletGlow)" transform="translate(200, 95)">
              <PalletStack color={shipment.pallet_color} />
            </g>

            {/* Door seam */}
            <line x1="350" y1="76" x2="350" y2="160" stroke="#71717a" strokeWidth="2" strokeDasharray="6 4" />

            {/* Temp sensor badge on trailer */}
            <rect x="288" y="48" width="88" height="28" rx="14" fill="#18181b" opacity="0.92" />
            <circle cx="302" cy="62" r="5" fill="#22d3ee" className={isCritical ? "animate-pulse" : ""} />
            <text x="314" y="66" fill="#f4f4f5" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">
              {formatTemperature(shipment.temperature_c)}
            </text>
          </svg>

          {/* Pallet callout */}
          <div
            className={`mt-2 flex items-center justify-between rounded-lg border bg-white/80 px-3 py-2 backdrop-blur-sm dark:bg-zinc-900/80 ${theme.border}`}
          >
            <div className="flex items-center gap-2.5">
              <PalletIcon color={shipment.pallet_color} />
              <div>
                <p className={`text-sm font-bold ${theme.text}`}>
                  {palletShortLabel(shipment.pallet_color)} pallet
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{shipment.pallet_id}</p>
              </div>
            </div>
            <p className="max-w-[140px] text-right text-xs leading-snug text-zinc-600 dark:text-zinc-400">
              {palletConditionLabel(shipment.pallet_color)}
            </p>
          </div>
        </div>

        {/* Readouts panel */}
        <div className="flex flex-col gap-3">
          {/* Temperature gauge */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Trailer temperature
                </p>
                <p className={`mt-1 text-3xl font-extrabold tabular-nums ${theme.accent}`}>
                  {formatTemperature(shipment.temperature_c)}
                </p>
              </div>
              <div className="rounded-lg bg-cyan-50 px-2.5 py-1.5 text-right dark:bg-cyan-950/40">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                  Safe band
                </p>
                <p className="text-xs font-medium text-cyan-900 dark:text-cyan-100">
                  {safeRangeLabel(shipment)}
                </p>
              </div>
            </div>

            <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {temperatureSummary(shipment)}
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
                className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-all duration-500 ${isCritical ? "bg-red-500" : shipment.pallet_color === "yellow" ? "bg-amber-400" : "bg-emerald-500"}`}
                style={{ left: `${gauge.markerPercent}%` }}
                aria-hidden
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
              <span>Colder</span>
              <span>Warmer</span>
            </div>
          </div>

          {/* Shelf life bar */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Shelf life remaining
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {shelfLifeSummary(shipment)}
            </p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  shelfPercent <= 15
                    ? "bg-red-500"
                    : shelfPercent <= 45
                      ? "bg-orange-500"
                      : shelfPercent <= 80
                        ? "bg-amber-400"
                        : "bg-emerald-500"
                }`}
                style={{ width: `${shelfPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {shipment.crop}
            </p>
          </div>

          {/* Risk legend */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900/60">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Pallet condition key
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <LegendSwatch color="green" label="Stable" />
              <LegendSwatch color="yellow" label="Watch" />
              <LegendSwatch color="red" label="Critical" />
              <LegendSwatch color="gray" label="No signal" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PalletStack({ color }: { color: DemoShipmentState["pallet_color"] }) {
  const fills: Record<DemoShipmentState["pallet_color"], [string, string, string]> = {
    green: ["#34d399", "#10b981", "#059669"],
    yellow: ["#fbbf24", "#f59e0b", "#d97706"],
    red: ["#f87171", "#ef4444", "#dc2626"],
    gray: ["#a1a1aa", "#71717a", "#52525b"],
  };
  const [top, mid, base] = fills[color];

  return (
    <>
      {/* Pallet base */}
      <rect x="-42" y="52" width="84" height="8" rx="1" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
      {/* Boxes */}
      <rect x="-36" y="28" width="32" height="24" rx="2" fill={top} stroke="#fff" strokeOpacity="0.25" />
      <rect x="-2" y="28" width="32" height="24" rx="2" fill={top} stroke="#fff" strokeOpacity="0.25" />
      <rect x="-36" y="2" width="32" height="24" rx="2" fill={mid} stroke="#fff" strokeOpacity="0.3" />
      <rect x="-2" y="2" width="32" height="24" rx="2" fill={mid} stroke="#fff" strokeOpacity="0.3" />
      <rect x="-19" y="-22" width="38" height="22" rx="2" fill={base} stroke="#fff" strokeOpacity="0.35" />
      {/* Status ring */}
      <rect
        x="-46"
        y="-28"
        width="92"
        height="92"
        rx="8"
        fill="none"
        stroke={base}
        strokeWidth="2.5"
        strokeOpacity="0.65"
      />
    </>
  );
}

function PalletIcon({ color }: { color: DemoShipmentState["pallet_color"] }) {
  const bg =
    color === "green"
      ? "bg-emerald-500"
      : color === "yellow"
        ? "bg-amber-400"
        : color === "red"
          ? "bg-red-500"
          : "bg-zinc-400";

  return (
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} shadow-inner`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/90" fill="currentColor">
        <rect x="4" y="14" width="16" height="3" rx="0.5" opacity="0.8" />
        <rect x="5" y="9" width="6" height="5" rx="0.5" />
        <rect x="13" y="9" width="6" height="5" rx="0.5" />
        <rect x="8" y="4" width="8" height="5" rx="0.5" />
      </svg>
    </span>
  );
}

function LegendSwatch({
  color,
  label,
}: {
  color: DemoShipmentState["pallet_color"];
  label: string;
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
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
      {label}
    </li>
  );
}
