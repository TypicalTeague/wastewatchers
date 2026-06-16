"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ApiError,
  advanceDemoSimulationStep,
  getDemoDashboard,
  loadDemoScenario,
  pauseDemoSimulation,
  resetDemoScenario,
  startDemoSimulation,
} from "@/lib/api/client";
import {
  actionWindowSummary,
  destinationSummary,
  formatCurrency,
  palletDotClasses,
  riskBadgeClasses,
  riskHeadline,
  scenarioStatusLabel,
  sortShipmentsByRisk,
} from "@/lib/api/display";
import type { DemoDashboardState, DemoShipmentState } from "@/lib/api/types";
import { shipmentsForTrailer } from "@/lib/api/trailer";
import TrailerPalletVisualization from "./components/TrailerPalletVisualization";
import SimulationControls from "./components/SimulationControls";

type ViewState = "loading" | "unavailable" | "ready";

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7h11v8H3V7zm11 0h3l3 4v4h-6V7zM6.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
      />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h5M20 20v-5h-5M20 9A8 8 0 006.34 6.34M4 15a8 8 0 0013.66 2.66"
      />
    </svg>
  );
}

function ShipmentQueueItem({
  shipment,
  selected,
  onSelect,
}: {
  shipment: DemoShipmentState;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
        selected
          ? "border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${palletDotClasses(shipment.pallet_color)}`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {shipment.shipment_id}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {shipment.crop}
          </p>
          <span
            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${riskBadgeClasses(shipment.risk_level)}`}
          >
            {riskHeadline(shipment.risk_level)}
          </span>
        </div>
      </div>
    </button>
  );
}

function ShipmentWorkspace({
  shipment,
  trailerShipments,
  onSelectShipment,
}: {
  shipment: DemoShipmentState;
  trailerShipments: DemoShipmentState[];
  onSelectShipment: (shipmentId: string) => void;
}) {
  const facts = [
    {
      icon: <TruckIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />,
      title: "Routing",
      body: destinationSummary(shipment),
    },
    {
      icon: <AlertIcon className="h-5 w-5 text-amber-600" />,
      title: "Decision window",
      body: actionWindowSummary(shipment),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Selected shipment
        </p>
        <h2 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          {shipment.shipment_id}
        </h2>
        <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
          {shipment.crop}
        </p>
      </div>

      <TrailerPalletVisualization
        trailerShipments={trailerShipments}
        selectedShipmentId={shipment.shipment_id}
        onSelectShipment={onSelectShipment}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact.title}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-2">
              {fact.icon}
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {fact.title}
              </h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {fact.body}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Load details
        </h3>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Truck</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {shipment.truck_id}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Trailer</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {shipment.trailer_id}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Pallet</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {shipment.pallet_id}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Origin</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {shipment.origin}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-zinc-500 dark:text-zinc-400">Cargo value</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatCurrency(shipment.estimated_value_usd)} estimated ·{" "}
              {formatCurrency(shipment.value_protected_usd)} protected
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [dashboard, setDashboard] = useState<DemoDashboardState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const [simulationPending, setSimulationPending] = useState(false);
  const [simulationIntervalSeconds, setSimulationIntervalSeconds] = useState(5);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const simulationBusyRef = useRef(false);

  const mergeDashboardState = useCallback((state: DemoDashboardState) => {
    setDashboard(state);
    setStatusNote(state.message);
    if (!state.empty_state && state.shipments.length > 0) {
      setSelectedId((current) => {
        if (current && state.shipments.some((s) => s.shipment_id === current)) {
          return current;
        }
        return sortShipmentsByRisk(state.shipments)[0]?.shipment_id ?? null;
      });
    } else {
      setSelectedId(null);
    }
  }, []);

  const shipments = useMemo(
    () => (dashboard ? sortShipmentsByRisk(dashboard.shipments) : []),
    [dashboard],
  );

  const selectedShipment = useMemo(
    () => shipments.find((s) => s.shipment_id === selectedId) ?? null,
    [shipments, selectedId],
  );

  const trailerShipments = useMemo(() => {
    if (!selectedShipment || !dashboard) {
      return [];
    }
    return shipmentsForTrailer(dashboard.shipments, selectedShipment.trailer_id);
  }, [selectedShipment, dashboard]);

  const fetchDashboard = useCallback(async (options?: { showLoading?: boolean }) => {
    if (options?.showLoading !== false) {
      setViewState("loading");
    }
    setStatusNote(null);
    try {
      const state = await getDemoDashboard();
      setDashboard(state);
      setViewState("ready");
      if (!state.empty_state && state.shipments.length > 0) {
        setSelectedId((current) => {
          if (current && state.shipments.some((s) => s.shipment_id === current)) {
            return current;
          }
          return sortShipmentsByRisk(state.shipments)[0]?.shipment_id ?? null;
        });
      } else {
        setSelectedId(null);
      }
    } catch (error) {
      setDashboard(null);
      setSelectedId(null);
      setViewState("unavailable");
      if (error instanceof ApiError) {
        setStatusNote(`Backend returned ${error.status}. Is FastAPI running?`);
      } else {
        setStatusNote("Could not reach the operations backend.");
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const state = await getDemoDashboard();
        if (cancelled) {
          return;
        }
        setDashboard(state);
        setViewState("ready");
        if (!state.empty_state && state.shipments.length > 0) {
          setSelectedId(sortShipmentsByRisk(state.shipments)[0]?.shipment_id ?? null);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        setDashboard(null);
        setSelectedId(null);
        setViewState("unavailable");
        if (error instanceof ApiError) {
          setStatusNote(`Backend returned ${error.status}. Is FastAPI running?`);
        } else {
          setStatusNote("Could not reach the operations backend.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const scenarioStatus = dashboard?.scenario_status ?? "empty";
  const scenarioEmpty = dashboard?.empty_state ?? true;

  useEffect(() => {
    if (scenarioStatus !== "running" || scenarioEmpty) {
      return undefined;
    }

    let cancelled = false;

    const tick = async () => {
      if (cancelled || simulationBusyRef.current) {
        return;
      }
      simulationBusyRef.current = true;
      try {
        const state = await advanceDemoSimulationStep();
        if (!cancelled) {
          mergeDashboardState(state);
        }
      } catch {
        if (cancelled) {
          return;
        }
        setStatusNote("Simulation update failed. Live mode stopped.");
        try {
          const state = await pauseDemoSimulation();
          mergeDashboardState(state);
        } catch {
          setDashboard((current) =>
            current ? { ...current, scenario_status: "paused" } : current,
          );
        }
      } finally {
        simulationBusyRef.current = false;
      }
    };

    const timerId = window.setInterval(() => {
      void tick();
    }, simulationIntervalSeconds * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(timerId);
    };
  }, [scenarioStatus, scenarioEmpty, simulationIntervalSeconds, mergeDashboardState]);

  async function handleStartSimulation() {
    setSimulationPending(true);
    setStatusNote(null);
    try {
      const state = await startDemoSimulation({
        interval_seconds: simulationIntervalSeconds,
      });
      mergeDashboardState(state);
    } catch {
      setStatusNote("Could not start live simulation.");
    } finally {
      setSimulationPending(false);
    }
  }

  async function handlePauseSimulation() {
    setSimulationPending(true);
    setStatusNote(null);
    try {
      const state = await pauseDemoSimulation();
      mergeDashboardState(state);
    } catch {
      setStatusNote("Could not pause simulation.");
    } finally {
      setSimulationPending(false);
    }
  }

  async function handleAdvanceStep() {
    setSimulationPending(true);
    setStatusNote(null);
    try {
      const state = await advanceDemoSimulationStep();
      mergeDashboardState(state);
    } catch {
      setStatusNote("Could not advance simulation step.");
    } finally {
      setSimulationPending(false);
    }
  }

  async function handleLoadScenario() {
    setActionPending(true);
    setStatusNote(null);
    try {
      const state = await loadDemoScenario();
      mergeDashboardState(state);
      setViewState("ready");
    } catch {
      setViewState("unavailable");
      setStatusNote("Could not load the demo scenario. Check that FastAPI is running.");
    } finally {
      setActionPending(false);
    }
  }

  async function handleResetScenario() {
    setActionPending(true);
    setStatusNote(null);
    try {
      const state = await resetDemoScenario();
      mergeDashboardState(state);
      setViewState("ready");
    } catch {
      setViewState("unavailable");
      setStatusNote("Could not reset the demo scenario.");
    } finally {
      setActionPending(false);
    }
  }

  if (viewState === "loading") {
    return (
      <div className="flex flex-1 flex-col">
        <div className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex max-w-[1600px] items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 items-center justify-center p-6">
          <div className="text-center">
            <RefreshIcon className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
            <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Connecting to operations backend…
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Loading the latest shipment picture.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === "unavailable") {
    return (
      <div className="flex flex-1 flex-col">
        <OperationsStatusBar
          scenarioStatus="empty"
          message={statusNote ?? "Backend unavailable"}
          metrics={null}
          onLoad={handleLoadScenario}
          onReset={handleResetScenario}
          actionPending={actionPending}
          actionsDisabled
        />
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center p-6 text-center">
          <AlertIcon className="h-14 w-14 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Operations backend unavailable
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            The dashboard could not reach FastAPI. Start the API with{" "}
            <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              uvicorn backend.src.main:app --reload
            </code>{" "}
            and confirm{" "}
            <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              WASTEWATCHERS_API_ORIGIN
            </code>{" "}
            in your local environment.
          </p>
          <button
            type="button"
            onClick={() => void fetchDashboard()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <RefreshIcon className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const empty = dashboard?.empty_state ?? true;

  return (
    <div className="flex flex-1 flex-col">
      <OperationsStatusBar
        scenarioStatus={dashboard?.scenario_status ?? "empty"}
        message={statusNote ?? dashboard?.message ?? ""}
        metrics={empty ? null : (dashboard?.metrics ?? null)}
        onLoad={handleLoadScenario}
        onReset={handleResetScenario}
        actionPending={actionPending}
        actionsDisabled={false}
        showReset={!empty}
      />

      {!empty && dashboard && (
        <SimulationControls
          scenarioStatus={dashboard.scenario_status}
          intervalSeconds={simulationIntervalSeconds}
          onIntervalChange={setSimulationIntervalSeconds}
          onStart={() => void handleStartSimulation()}
          onPause={() => void handlePauseSimulation()}
          onStep={() => void handleAdvanceStep()}
          pending={simulationPending}
        />
      )}

      {empty ? (
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center p-6 text-center">
          <TruckIcon className="h-16 w-16 text-emerald-600" />
          <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            No shipments on the board yet
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {dashboard?.message ??
              "Load the demo scenario to populate the control center with four sample cold-chain loads."}
          </p>
          <button
            type="button"
            disabled={actionPending}
            onClick={() => void handleLoadScenario()}
            className="mt-6 rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
          >
            Load Demo Scenario
          </button>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1600px] flex-1 p-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)_260px] lg:items-start">
          <aside className="flex flex-col rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-12rem)] lg:overflow-hidden">
            <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                Shipment queue
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {shipments.length} active loads · worst first
              </p>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {shipments.map((shipment) => (
                <ShipmentQueueItem
                  key={shipment.shipment_id}
                  shipment={shipment}
                  selected={shipment.shipment_id === selectedId}
                  onSelect={() => setSelectedId(shipment.shipment_id)}
                />
              ))}
            </div>
          </aside>

          <section className="min-w-0 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:p-5">
            {selectedShipment ? (
              <ShipmentWorkspace
                shipment={selectedShipment}
                trailerShipments={trailerShipments}
                onSelectShipment={setSelectedId}
              />
            ) : (
              <p className="text-sm text-zinc-500">Select a shipment from the queue.</p>
            )}
          </section>

          <aside className="flex flex-col rounded-xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50 lg:sticky lg:top-4">
            <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                Decision summary
              </h2>
            </div>
            <div className="flex flex-1 flex-col justify-center p-4 text-center">
              <CheckCircleIcon className="mx-auto h-10 w-10 text-zinc-400" />
              <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                Manager actions coming soon
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                Approve reroutes, send loads to manual review, and confirm salvage
                decisions will appear here in a later phase.
              </p>
              {selectedShipment?.recommended_destination && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-left dark:border-emerald-900 dark:bg-emerald-950/30">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                    Suggested next step
                  </p>
                  <p className="mt-1 text-sm text-emerald-900 dark:text-emerald-100">
                    Consider rerouting to{" "}
                    <span className="font-semibold">
                      {selectedShipment.recommended_destination}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </aside>
          </div>
        </div>
      )}
    </div>
  );
}

function OperationsStatusBar({
  scenarioStatus,
  message,
  metrics,
  onLoad,
  onReset,
  actionPending,
  actionsDisabled,
  showReset = false,
}: {
  scenarioStatus: DemoDashboardState["scenario_status"];
  message: string;
  metrics: DemoDashboardState["metrics"] | null;
  onLoad: () => void;
  onReset: () => void;
  actionPending: boolean;
  actionsDisabled: boolean;
  showReset?: boolean;
}) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <TruckIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              WasteWatchers Operations
            </p>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Logistics Control Center
            </h1>
            <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
              {scenarioStatusLabel(scenarioStatus)}
              {message ? ` · ${message}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {metrics && (
            <div className="mr-2 hidden items-center gap-4 text-xs text-zinc-600 dark:text-zinc-300 md:flex">
              <span>
                <strong className="text-zinc-900 dark:text-zinc-50">
                  {metrics.critical_shipments}
                </strong>{" "}
                critical
              </span>
              <span>
                <strong className="text-zinc-900 dark:text-zinc-50">
                  {metrics.at_risk_shipments}
                </strong>{" "}
                at risk
              </span>
              <span>
                <strong className="text-zinc-900 dark:text-zinc-50">
                  {formatCurrency(metrics.estimated_value_protected_usd)}
                </strong>{" "}
                protected
              </span>
            </div>
          )}
          <button
            type="button"
            disabled={actionsDisabled || actionPending}
            onClick={onLoad}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Load Demo Scenario
          </button>
          {showReset && (
            <button
              type="button"
              disabled={actionsDisabled || actionPending}
              onClick={onReset}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Reset Scenario
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
