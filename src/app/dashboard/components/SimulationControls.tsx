"use client";

import { simulationModeLabel } from "@/lib/api/display";
import type { DemoScenarioStatus } from "@/lib/api/types";

interface SimulationControlsProps {
  scenarioStatus: DemoScenarioStatus;
  intervalSeconds: number;
  onIntervalChange: (seconds: number) => void;
  onStart: () => void;
  onPause: () => void;
  onStep: () => void;
  pending: boolean;
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function StepIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function SimulationControls({
  scenarioStatus,
  intervalSeconds,
  onIntervalChange,
  onStart,
  onPause,
  onStep,
  pending,
}: SimulationControlsProps) {
  const isRunning = scenarioStatus === "running";
  const isPaused = scenarioStatus === "paused";

  return (
    <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              isRunning
                ? "bg-emerald-600 text-white"
                : isPaused
                  ? "bg-amber-500 text-white"
                  : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {isRunning ? (
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
              </span>
            ) : isPaused ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Telemetry simulation
            </p>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
              {simulationModeLabel(scenarioStatus)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <span className="text-zinc-500 dark:text-zinc-400">Every</span>
            <input
              type="number"
              min={1}
              max={60}
              value={intervalSeconds}
              disabled={isRunning || pending}
              onChange={(event) => {
                const value = Number.parseInt(event.target.value, 10);
                if (!Number.isNaN(value)) {
                  onIntervalChange(Math.min(60, Math.max(1, value)));
                }
              }}
              className="w-12 border-none bg-transparent text-center font-semibold text-zinc-900 outline-none dark:text-zinc-50 disabled:opacity-50"
              aria-label="Simulation interval in seconds"
            />
            <span className="text-zinc-500 dark:text-zinc-400">sec</span>
          </label>

          <button
            type="button"
            disabled={pending || isRunning}
            onClick={onStart}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlayIcon className="h-3.5 w-3.5" />
            Start live
          </button>

          <button
            type="button"
            disabled={pending || !isRunning}
            onClick={onPause}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <PauseIcon className="h-3.5 w-3.5" />
            Pause
          </button>

          <button
            type="button"
            disabled={pending || isRunning}
            onClick={onStep}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <StepIcon className="h-4 w-4" />
            Advance step
          </button>
        </div>
      </div>
    </div>
  );
}
