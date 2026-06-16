import type { ManagerDecisionRequest } from "./types";

const approvePayload: ManagerDecisionRequest = {
  action: "approve_reroute",
  actor_label: "Site Manager",
  option_id: "DEMO-1004:food_processor",
  confirmation_acknowledged: true,
};

if (!approvePayload.confirmation_acknowledged) {
  throw new Error("manager decision payloads must require explicit confirmation");
}

