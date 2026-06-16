import type { DemoDashboardState } from "./types";

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
