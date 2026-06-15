'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_YEARS = 1
const MAX_YEARS = 10
const IDLE_MS = 6_000
const AUTOPLAY_INTERVAL_MS = 1_500

// Linear growth per year (baseline values)
const PER_YEAR = {
  tonsDiverted: 480,
  landFillFeesAvoided: 72_000,
  claimsPreCompiled: 1_150,
  taxWriteOffsEnabled: 115_000,
}

function project(years: number) {
  return {
    tonsDiverted: PER_YEAR.tonsDiverted * years,
    landFillFeesAvoided: PER_YEAR.landFillFeesAvoided * years,
    claimsPreCompiled: PER_YEAR.claimsPreCompiled * years,
    taxWriteOffsEnabled: PER_YEAR.taxWriteOffsEnabled * years,
  }
}

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US')
}

interface KpiCardProps {
  label: string
  value: string
  description: string
  icon: string
}

function KpiCard({ label, value, description, icon }: KpiCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}

export default function RoiProjections() {
  const [years, setYears] = useState(1)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isAutoplaying, setIsAutoplaying] = useState(false)

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
    setIsAutoplaying(false)
  }, [])

  const startAutoplay = useCallback(() => {
    stopAutoplay()
    setIsAutoplaying(true)
    autoplayTimerRef.current = setInterval(() => {
      setYears((prev) => (prev >= MAX_YEARS ? MIN_YEARS : prev + 1))
    }, AUTOPLAY_INTERVAL_MS)
  }, [stopAutoplay])

  const scheduleAutoplay = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(startAutoplay, IDLE_MS)
  }, [startAutoplay])

  // Kick off idle timer on mount
  useEffect(() => {
    scheduleAutoplay()
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current)
    }
  }, [scheduleAutoplay])

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      stopAutoplay()
      setYears(Number(e.target.value))
      scheduleAutoplay()
    },
    [stopAutoplay, scheduleAutoplay],
  )

  const kpis = project(years)

  return (
    <section className="flex w-full flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          ROI Projections
        </p>
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          What could{' '}
          <span className="text-emerald-600 dark:text-emerald-400">
            {years} year{years !== 1 ? 's' : ''}
          </span>{' '}
          in the market look like?
        </h2>
        <p className="max-w-lg text-base text-zinc-500 dark:text-zinc-400">
          Drag the slider to explore projected impact over time. Based on
          linear growth modelling across active WasteWatcher deployments.
        </p>
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <span>1 year</span>
          <span className="flex items-center gap-2">
            {isAutoplaying && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Auto
              </span>
            )}
            <span className="tabular-nums">
              {years} yr{years !== 1 ? 's' : ''}
            </span>
          </span>
          <span>10 years</span>
        </div>
        <input
          type="range"
          min={MIN_YEARS}
          max={MAX_YEARS}
          step={1}
          value={years}
          onChange={handleSliderChange}
          aria-label="Years in market"
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-emerald-600 dark:bg-zinc-700"
        />
        <div className="flex justify-between">
          {Array.from({ length: MAX_YEARS }, (_, i) => i + 1).map((y) => (
            <button
              key={y}
              onClick={() => {
                stopAutoplay()
                setYears(y)
                scheduleAutoplay()
              }}
              aria-label={`Set to ${y} year${y !== 1 ? 's' : ''}`}
              className={`h-5 w-5 rounded-full text-xs font-semibold transition-colors ${
                y === years
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-200 text-zinc-500 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          icon="♻️"
          label="Tons Diverted"
          value={formatNumber(kpis.tonsDiverted) + ' t'}
          description={`Projected waste diverted from landfill over ${years} yr${years !== 1 ? 's' : ''}`}
        />
        <KpiCard
          icon="💰"
          label="Landfill Fees Avoided"
          value={formatCurrency(kpis.landFillFeesAvoided)}
          description={`Projected disposal cost savings over ${years} yr${years !== 1 ? 's' : ''}`}
        />
        <KpiCard
          icon="📋"
          label="Claims Pre-Compiled"
          value={formatNumber(kpis.claimsPreCompiled)}
          description={`Projected compliance claims auto-compiled over ${years} yr${years !== 1 ? 's' : ''}`}
        />
        <KpiCard
          icon="🧾"
          label="Tax Write-Offs Enabled"
          value={formatCurrency(kpis.taxWriteOffsEnabled)}
          description={`Projected deductible value unlocked over ${years} yr${years !== 1 ? 's' : ''}`}
        />
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        Projections are estimates based on linear growth modelling. Actual
        results may vary based on deployment scale and operational context.
      </p>
    </section>
  )
}
