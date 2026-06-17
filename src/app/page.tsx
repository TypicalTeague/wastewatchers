import Link from "next/link";
import Footnotes, { Cite } from "./components/Footnotes";
import RoiProjections from "./components/RoiProjections";

const SOCIAL_PROOF = [
  {
    value: "31%",
    label: "U.S. food supply goes unsold or uneaten annually",
    source: 1,
  },
  {
    value: "16B lbs",
    label: "Food retailers discard each year from temperature failures",
    source: 3,
  },
  {
    value: "58%",
    label: "Share of fugitive landfill methane linked to food waste",
    source: 16,
  },
  {
    value: "38%",
    label: "Average spoilage-cost reduction with real-time IoT monitoring",
    source: 33,
  },
];

const SOURCES = [
  {
    id: 1,
    title: "ReFED US Food Waste Report 2025",
    href: "https://refed.org/downloads/refed-us-food-waste-report-2025.pdf",
  },
  {
    id: 3,
    title:
      "Cold Chain Logistics Shipping Guide: Protect Product & Margin | Worldwide Express",
    href: "https://www.wwex.com/shipping-resources/cold-chain-logistics",
  },
  {
    id: 8,
    title: "The 2026 ReFED U.S. Food Waste Report",
    href: "https://refed.org/food-waste/refed-us-food-waste-report-2026/",
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
    id: 34,
    title: "Three Ways AI Is Driving Reductions in Food Loss and Waste - ReFED",
    href: "https://refed.org/articles/three-ways-ai-is-driving-reductions-in-food-loss-and-waste/",
  },
  {
    id: 45,
    title:
      "Samsara Review: Fleet Management Features, Fees, Support 2026 - Tech.co",
    href: "https://tech.co/fleet-management/samsara-fleet-management-review",
  },
  {
    id: 50,
    title: "A ROADMAP TO REDUCE U.S. FOOD WASTE BY 20 PERCENT - ReFED",
    href: "https://refed.org/downloads/Key_Insights.pdf",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-900">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            Waste Compliance Intelligence
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl">
            Stop cold-chain loss before it becomes{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              landfill methane
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            In the U.S., roughly 31% of food goes unsold or uneaten
            <Cite id={1} />, and $380 billion in surplus food value is lost
            annually
            <Cite id={8} />. WasteWatcher helps operators detect transit risk
            sooner, salvage more inventory, and reduce landfill-bound spoilage.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700"
            >
              Book a Demo
            </Link>
            <Link
              href="/mission"
              className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-zinc-200 px-6 dark:divide-zinc-800 md:grid-cols-4 md:divide-y-0">
          {SOCIAL_PROOF.map(({ value, label, source }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-6 py-8 text-center"
            >
              <span className="text-3xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                {value}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {label}
                <Cite id={source} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Projections */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <RoiProjections />
      </section>

      <Footnotes entries={SOURCES} />

      {/* CTA Banner */}
      <section className="bg-emerald-600 dark:bg-emerald-700">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-16 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Ready to see WasteWatcher in action?
            </h2>
            <p className="mt-2 text-emerald-100">
              Talk to our team and get a personalised impact estimate for your
              organisation.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-700 shadow transition-colors hover:bg-emerald-50"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
