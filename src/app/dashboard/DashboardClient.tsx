"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ApiError,
  advanceDemoSimulationStep,
  confirmDemoManagerDecision,
  getDemoDashboard,
  loadDemoScenario,
  pauseDemoSimulation,
  resetDemoScenario,
  startDemoSimulation,
} from "@/lib/api/client";
import {
  actionWindowSummary,
  destinationSummary,
  estimatedNetValueLabel,
  formatCurrency,
  formatDateTime,
  formatMaybeValue,
  formatMinutes,
  formatPercent,
  formatTemperature,
  freshnessLabel,
  optionViabilityLabel,
  palletDotClasses,
  provenanceLabel,
  riskBadgeClasses,
  riskHeadline,
  scenarioStatusLabel,
  sortShipmentsByRisk,
} from "@/lib/api/display";
import type {
  DemoDashboardState,
  DemoShipmentState,
  ManagerDecisionAction,
  ResponseOption,
} from "@/lib/api/types";
import { shipmentsForTrailer } from "@/lib/api/trailer";
import TrailerPalletVisualization from "./components/TrailerPalletVisualization";
import SimulationControls from "./components/SimulationControls";

type ViewState = "loading" | "unavailable" | "ready";

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3V7zm11 0h3l3 4v4h-6V7zM6.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 9A8 8 0 006.34 6.34M4 15a8 8 0 0013.66 2.66" />
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
      className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
        selected
          ? "border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${palletDotClasses(shipment.pallet_color)}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{shipment.shipment_id}</p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{shipment.commodity_abbrev} - {shipment.crop}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${riskBadgeClasses(shipment.risk_level)}`}>
              {shipment.risk_level.replaceAll("_", " ")}
            </span>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div>
              <dt>Deadline</dt>
              <dd className="font-medium text-zinc-800 dark:text-zinc-200">{formatMinutes(shipment.time_remaining_to_act_minutes)}</dd>
            </div>
            <div>
              <dt>Shelf life</dt>
              <dd className="font-medium text-zinc-800 dark:text-zinc-200">{Math.round(shipment.remaining_shelf_life_hours)} hr</dd>
            </div>
            <div className="col-span-2">
              <dt>Latest update</dt>
              <dd className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                {shipment.sensor_freshness?.message ?? freshnessLabel(shipment.sensor_freshness?.status)}
              </dd>
            </div>
          </dl>
          <p className="mt-2 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
            {shipment.change_summary || "No material change since last update."}
          </p>
        </div>
      </div>
    </button>
  );
}

function ShipmentWorkspace({
  shipment,
  trailerShipments,
  onSelectShipment,
  onDecision,
  decisionPending,
}: {
  shipment: DemoShipmentState;
  trailerShipments: DemoShipmentState[];
  onSelectShipment: (shipmentId: string) => void;
  onDecision: (action: ManagerDecisionAction, option?: ResponseOption) => void;
  decisionPending: boolean;
}) {
  const recommendation = shipment.recommended_decision;
  const recommendedOption = shipment.response_options.find((option) => option.viability === "recommended");
  const selectedFinancial = recommendation?.financial_breakdown ?? recommendedOption?.financial_breakdown;
  const terminal = ["reroute_approved", "manual_review", "rejected"].includes(shipment.risk_level);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Selected shipment</p>
          <h2 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">{shipment.shipment_id}</h2>
          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">{shipment.crop}</p>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${riskBadgeClasses(shipment.risk_level)}`}>
          {riskHeadline(shipment.risk_level)}
        </span>
      </div>

      <TrailerPalletVisualization
        trailerShipments={trailerShipments}
        selectedShipmentId={shipment.shipment_id}
        onSelectShipment={onSelectShipment}
      />

      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">Recommended Decision</p>
            <h3 className="mt-1 text-lg font-bold text-emerald-950 dark:text-emerald-50">
              {terminal
                ? shipment.confirmation_message || riskHeadline(shipment.risk_level)
                : recommendation?.title ?? "No automatic reroute recommendation"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-emerald-950/80 dark:text-emerald-100/80">
              {recommendation?.rationale ?? destinationSummary(shipment)}
            </p>
          </div>
          {selectedFinancial && (
            <div className="w-full rounded-lg border border-emerald-300/70 bg-white/70 p-3 text-left dark:border-emerald-800 dark:bg-zinc-950/30 sm:w-auto sm:shrink-0">
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">{estimatedNetValueLabel()}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-950 dark:text-emerald-50">
                {formatCurrency(selectedFinancial.estimated_net_value_preserved_usd)}
              </p>
              <p className="mt-1 text-xs text-emerald-900/70 dark:text-emerald-200/70">{selectedFinancial.estimate_disclaimer}</p>
            </div>
          )}
        </div>
        {recommendation && !terminal && (
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
            <Metric label="Deadline" value={recommendation.deadline_at ? formatDateTime(recommendation.deadline_at) : actionWindowSummary(shipment)} />
            <Metric label="Travel time" value={formatMinutes(recommendation.travel_time_minutes)} />
            <Metric label="Condition" value={recommendation.expected_condition_at_arrival} />
            <Metric label="Confidence" value={`${recommendation.confidence.level.replaceAll("_", " ")} (${formatPercent(recommendation.confidence.score)})`} />
          </div>
        )}
        {!terminal && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={decisionPending || !recommendation}
              onClick={() => onDecision("approve_reroute", recommendedOption)}
              className="w-full rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={decisionPending}
              onClick={() => onDecision("send_manual_review", recommendedOption)}
              className="w-full rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50 dark:text-emerald-200 dark:hover:bg-emerald-950 sm:w-auto"
            >
              Manual review
            </button>
            <button
              type="button"
              disabled={decisionPending}
              onClick={() => onDecision("reject_shipment", recommendedOption)}
              className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:w-auto"
            >
              Reject
            </button>
          </div>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <InfoCard title="Route Context">
          <dl className="space-y-2 text-sm">
            <MetricRow label="Origin" value={shipment.origin} />
            <MetricRow label="Planned destination" value={shipment.planned_destination} />
            <MetricRow label="Latest update" value={formatDateTime(shipment.latest_update_at)} />
          </dl>
        </InfoCard>
        <InfoCard title="Condition">
          <dl className="space-y-2 text-sm">
            <MetricRow label="Temperature" value={formatTemperature(shipment.temperature_c)} />
            <MetricRow label="Shelf life now" value={`${shipment.remaining_shelf_life_hours.toFixed(1)} hr`} />
            <MetricRow label="Shelf life at arrival" value={shipment.expected_shelf_life_at_arrival_hours === null ? "Data unavailable" : `${shipment.expected_shelf_life_at_arrival_hours.toFixed(1)} hr`} />
          </dl>
        </InfoCard>
        <InfoCard title="Data Confidence">
          <dl className="space-y-2 text-sm">
            <MetricRow label="Telemetry" value={shipment.sensor_freshness?.message ?? "Data unavailable"} />
            <MetricRow label="Confidence" value={shipment.confidence ? `${shipment.confidence.level.replaceAll("_", " ")} ${formatPercent(shipment.confidence.score)}` : "Data unavailable"} />
            <MetricRow label="Decision window" value={actionWindowSummary(shipment)} />
          </dl>
        </InfoCard>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Primary risk drivers</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {shipment.risk_drivers.map((driver) => (
            <div key={driver.driver_id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{driver.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">{driver.explanation}</p>
              <p className="mt-2 text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {driver.severity} - {provenanceLabel(driver.provenance)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Compare Response Options</h3>
        <div className="mt-3 space-y-3 md:hidden">
          {shipment.response_options.map((option) => (
            <article key={option.option_id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{option.destination_name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{option.expected_condition_at_arrival}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium dark:bg-zinc-800">
                  {optionViabilityLabel(option.viability)}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <Metric label="Travel" value={formatMinutes(option.travel_time_minutes)} />
                <Metric label="Acceptance" value={formatPercent(option.acceptance_percent)} />
                <Metric label="Net preserved" value={formatCurrency(option.financial_breakdown.estimated_net_value_preserved_usd)} />
                <Metric label="Risk" value={option.operational_risk} />
              </dl>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{option.viability_reason}</p>
            </article>
          ))}
        </div>
        <div className="mt-3 hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="py-2 pr-4">Option</th>
                <th className="py-2 pr-4">Travel</th>
                <th className="py-2 pr-4">Acceptance</th>
                <th className="py-2 pr-4">Net preserved</th>
                <th className="py-2 pr-4">Risk</th>
                <th className="py-2 pr-4">Viability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {shipment.response_options.map((option) => (
                <tr key={option.option_id}>
                  <td className="py-3 pr-4 align-top">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{option.destination_name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{option.expected_condition_at_arrival}</p>
                  </td>
                  <td className="py-3 pr-4 align-top">{formatMinutes(option.travel_time_minutes)}</td>
                  <td className="py-3 pr-4 align-top">{formatPercent(option.acceptance_percent)}</td>
                  <td className="py-3 pr-4 align-top">{formatCurrency(option.financial_breakdown.estimated_net_value_preserved_usd)}</td>
                  <td className="py-3 pr-4 align-top capitalize">{option.operational_risk}</td>
                  <td className="py-3 pr-4 align-top">
                    <span className="font-medium">{optionViabilityLabel(option.viability)}</span>
                    <p className="mt-1 max-w-[18rem] text-xs text-zinc-500 dark:text-zinc-400">{option.viability_reason}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedFinancial && (
        <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Financial Impact</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{selectedFinancial.estimate_disclaimer}</p>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Original cargo value" value={formatCurrency(selectedFinancial.original_cargo_value_usd)} />
            <Metric label="Gross recovery" value={formatCurrency(selectedFinancial.expected_gross_recovery_usd)} />
            <Metric label="Cost avoidance" value={formatCurrency(selectedFinancial.cost_avoidance_usd)} />
            <Metric label="Incremental cost" value={formatCurrency(selectedFinancial.incremental_cost_usd)} />
            <Metric label="Rerouting cost" value={formatCurrency(selectedFinancial.rerouting_transportation_cost_usd)} />
            <Metric label="Sorting and handling" value={formatCurrency(selectedFinancial.sorting_handling_cost_usd)} />
            <Metric label="Destination fees" value={formatCurrency(selectedFinancial.processing_destination_fee_usd)} />
            <Metric label="Unrecovered value" value={formatCurrency(selectedFinancial.expected_unrecovered_value_usd)} />
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFinancial.input_provenance.map((input) => (
              <span key={input.label} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {input.label}: {provenanceLabel(input.provenance)}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-3 lg:grid-cols-2">
        <InfoCard title="Event Timeline">
          <div className="space-y-3">
            {shipment.event_timeline.map((event) => (
              <div key={event.event_id} className="border-l-2 border-emerald-500 pl-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{event.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatDateTime(event.occurred_at)} - {provenanceLabel(event.provenance)}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{event.detail}</p>
              </div>
            ))}
          </div>
        </InfoCard>
        <InfoCard title="Technical Details">
          <dl className="space-y-2 text-sm">
            {shipment.technical_details.map((detail) => (
              <MetricRow key={detail.label} label={`${detail.label} (${provenanceLabel(detail.provenance)})`} value={formatMaybeValue(detail.value, detail.unit)} />
            ))}
            {shipment.unavailable_signals.map((detail) => (
              <MetricRow key={detail.label} label={detail.label} value={detail.unavailable_reason ?? "Data unavailable"} />
            ))}
          </dl>
        </InfoCard>
      </section>
    </div>
  );
}

export default function DashboardClient() {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [dashboard, setDashboard] = useState<DemoDashboardState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const [decisionPending, setDecisionPending] = useState(false);
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
      mergeDashboardState(state);
      setViewState("ready");
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
  }, [mergeDashboardState]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const state = await getDemoDashboard();
        if (!cancelled) {
          mergeDashboardState(state);
          setViewState("ready");
        }
      } catch (error) {
        if (!cancelled) {
          setDashboard(null);
          setSelectedId(null);
          setViewState("unavailable");
          setStatusNote(error instanceof ApiError ? `Backend returned ${error.status}. Is FastAPI running?` : "Could not reach the operations backend.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mergeDashboardState]);

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
        if (!cancelled) {
          setStatusNote("Simulation update failed. Live mode stopped.");
          const state = await pauseDemoSimulation();
          mergeDashboardState(state);
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
      mergeDashboardState(await startDemoSimulation({ interval_seconds: simulationIntervalSeconds }));
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
      mergeDashboardState(await pauseDemoSimulation());
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
      mergeDashboardState(await advanceDemoSimulationStep());
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
      mergeDashboardState(await loadDemoScenario());
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
      mergeDashboardState(await resetDemoScenario());
      setViewState("ready");
    } catch {
      setViewState("unavailable");
      setStatusNote("Could not reset the demo scenario.");
    } finally {
      setActionPending(false);
    }
  }

  async function handleDecision(action: ManagerDecisionAction, option?: ResponseOption) {
    if (!selectedShipment) {
      return;
    }
    const confirmed = window.confirm("Confirm this manager decision and record it in the audit trail?");
    if (!confirmed) {
      return;
    }
    setDecisionPending(true);
    setStatusNote(null);
    try {
      const state = await confirmDemoManagerDecision(selectedShipment.shipment_id, {
        action,
        actor_label: "Site Manager",
        option_id: option?.option_id ?? selectedShipment.recommended_decision?.option_id ?? null,
        confirmation_acknowledged: true,
      });
      mergeDashboardState(state);
    } catch {
      setStatusNote("Could not record manager decision.");
    } finally {
      setDecisionPending(false);
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
            <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Connecting to operations backend...</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Loading the latest shipment picture.</p>
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
          <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Operations backend unavailable</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            The dashboard could not reach FastAPI. Start the API with{" "}
            <code className="break-all rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">uvicorn backend.src.main:app --reload</code>{" "}
            and confirm{" "}
            <code className="break-all rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">WASTEWATCHERS_API_ORIGIN</code>{" "}
            in your local environment.
          </p>
          <button type="button" onClick={() => void fetchDashboard()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
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
          <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">No shipments on the board yet</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {dashboard?.message ?? "Load the demo scenario to populate the control center with four sample cold-chain loads."}
          </p>
          <button type="button" disabled={actionPending} onClick={() => void handleLoadScenario()} className="mt-6 rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60">
            Load Demo Scenario
          </button>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1600px] flex-1 p-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)_260px] xl:items-start">
            <aside className="flex flex-col rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 xl:sticky xl:top-4 xl:max-h-[calc(100dvh-12rem)] xl:overflow-hidden">
              <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">Shipment queue</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{shipments.length} active loads - worst first</p>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {shipments.map((shipment) => (
                  <ShipmentQueueItem key={shipment.shipment_id} shipment={shipment} selected={shipment.shipment_id === selectedId} onSelect={() => setSelectedId(shipment.shipment_id)} />
                ))}
              </div>
            </aside>

            <section className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:p-5">
              {selectedShipment ? (
                <ShipmentWorkspace
                  shipment={selectedShipment}
                  trailerShipments={trailerShipments}
                  onSelectShipment={setSelectedId}
                  onDecision={handleDecision}
                  decisionPending={decisionPending}
                />
              ) : (
                <p className="text-sm text-zinc-500">Select a shipment from the queue.</p>
              )}
            </section>

            <aside className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 xl:sticky xl:top-4">
              <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">Compact summary</h2>
              </div>
              <div className="space-y-3 p-4">
                {selectedShipment ? (
                  <>
                    <Metric label="Risk" value={riskHeadline(selectedShipment.risk_level)} />
                    <Metric label="Deadline" value={formatMinutes(selectedShipment.time_remaining_to_act_minutes)} />
                    <Metric label="Temperature" value={formatTemperature(selectedShipment.temperature_c)} />
                    <Metric label={estimatedNetValueLabel()} value={formatCurrency(selectedShipment.value_protected_usd)} />
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">Select a shipment.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
      <dt className="text-xs text-zinc-500 dark:text-zinc-400 sm:min-w-32 sm:text-sm">{label}</dt>
      <dd className="min-w-0 flex-1 break-words font-medium text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <TruckIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">WasteWatchers Operations</p>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Logistics Control Center</h1>
            <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 sm:truncate sm:line-clamp-1">
              {scenarioStatusLabel(scenarioStatus)}
              {message ? ` - ${message}` : ""}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {metrics && (
            <div className="mr-2 hidden items-center gap-4 text-xs text-zinc-600 dark:text-zinc-300 md:flex">
              <span><strong className="text-zinc-900 dark:text-zinc-50">{metrics.critical_shipments}</strong> critical</span>
              <span><strong className="text-zinc-900 dark:text-zinc-50">{metrics.at_risk_shipments}</strong> at risk</span>
              <span><strong className="text-zinc-900 dark:text-zinc-50">{formatCurrency(metrics.estimated_net_value_preserved_usd)}</strong> net preserved</span>
            </div>
          )}
          <button type="button" disabled={actionsDisabled || actionPending} onClick={onLoad} className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
            Load Demo Scenario
          </button>
          {showReset && (
            <button type="button" disabled={actionsDisabled || actionPending} onClick={onReset} className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:w-auto">
              Reset Scenario
            </button>
          )}
        </div>
      </div>
      {metrics && (
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-1 px-4 pb-3 text-xs text-zinc-600 dark:text-zinc-300 md:hidden">
          <span><strong className="text-zinc-900 dark:text-zinc-50">{metrics.critical_shipments}</strong> critical shipments</span>
          <span><strong className="text-zinc-900 dark:text-zinc-50">{metrics.at_risk_shipments}</strong> at-risk shipments</span>
          <span><strong className="text-zinc-900 dark:text-zinc-50">{formatCurrency(metrics.estimated_net_value_preserved_usd)}</strong> estimated net preserved</span>
        </div>
      )}
    </header>
  );
}
