import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import Footnotes, { Cite } from "../components/Footnotes";

export const metadata: Metadata = {
  title: "Contact — WasteWatcher",
  description:
    "Get in touch with the WasteWatcher team to discuss cold-chain waste reduction outcomes and implementation.",
};

const SOURCES = [
  {
    id: 3,
    title:
      "Cold Chain Logistics Shipping Guide: Protect Product & Margin | Worldwide Express",
    href: "https://www.wwex.com/shipping-resources/cold-chain-logistics",
  },
  {
    id: 16,
    title: "Quantifying Methane Emissions from Landfilled Food Waste | US EPA",
    href: "https://www.epa.gov/land-research/quantifying-methane-emissions-landfilled-food-waste",
  },
  {
    id: 33,
    title:
      "(PDF) Smart Shelf Life: How IoT Sensors Cut Food Waste by 38% While Boosting Perishable Profits",
    href: "https://www.researchgate.net/publication/396736476_Smart_Shelf_Life_How_IoT_Sensors_Cut_Food_Waste_by_38_While_Boosting_Perishable_Profits",
  },
  {
    id: 50,
    title: "A ROADMAP TO REDUCE U.S. FOOD WASTE BY 20 PERCENT - ReFED",
    href: "https://refed.org/downloads/Key_Insights.pdf",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-900">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.10),transparent)]" />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              Get in touch
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
              Let&apos;s talk about{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                your cold-chain recovery strategy
              </span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              We&apos;ll help you scope how real-time monitoring and rerouting
              can reduce spoilage costs by 38%
              <Cite id={33} />, avoid landfill methane
              <Cite id={16} />, and recover value from temperature-linked
              losses
              <Cite id={3} />
              <Cite id={50} />.
            </p>
          </div>
        </div>
      </section>

      {/* Contact content */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 pb-28">
        <ContactClient />
      </section>

      <Footnotes entries={SOURCES} />
    </>
  );
}
