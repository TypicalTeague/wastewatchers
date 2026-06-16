import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Operations Dashboard — WasteWatchers",
  description:
    "Live logistics control center for cold-chain shipment monitoring and salvage rerouting.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
