import type { DemoDashboardState, ManagerDecisionRequest, SimulationConfig } from "./types";

const API_BASE = "/api/wastewatchers";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new ApiError(
      detail || `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export async function getDemoDashboard(): Promise<DemoDashboardState> {
  return request<DemoDashboardState>("/demo/dashboard");
}

export async function loadDemoScenario(): Promise<DemoDashboardState> {
  return request<DemoDashboardState>("/demo/scenario/load", { method: "POST" });
}

export async function resetDemoScenario(): Promise<DemoDashboardState> {
  return request<DemoDashboardState>("/demo/scenario/reset", { method: "POST" });
}

export async function startDemoSimulation(
  config: SimulationConfig,
): Promise<DemoDashboardState> {
  return request<DemoDashboardState>("/demo/simulation/start", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function pauseDemoSimulation(): Promise<DemoDashboardState> {
  return request<DemoDashboardState>("/demo/simulation/pause", { method: "POST" });
}

export async function advanceDemoSimulationStep(): Promise<DemoDashboardState> {
  return request<DemoDashboardState>("/demo/simulation/step", { method: "POST" });
}

export async function confirmDemoManagerDecision(
  shipmentId: string,
  decision: ManagerDecisionRequest,
): Promise<DemoDashboardState> {
  return request<DemoDashboardState>(`/demo/shipments/${shipmentId}/decision`, {
    method: "POST",
    body: JSON.stringify(decision),
  });
}
