import type { Metadata } from "next";
import Link from "next/link";
import Footnotes, { Cite } from "../components/Footnotes";

export const metadata: Metadata = {
  title: "Mission — WasteWatcher",
  description:
    "WasteWatcher's mission: cut cold-chain spoilage, avoid landfill methane, and deliver measurable ROI through real-time intervention.",
};

const PILLARS = [
  {
    number: "01",
    icon: "📡",
    title: "Detect",
    headline: "Surface risk before a load fails",
    body: "Dock-side visual checks detect only 46% of excursions, while continuous monitoring can detect 97%, shrinking blind spots and enabling intervention before rejection.",
    stat: "97%",
    statLabel: "excursion detection coverage",
    citation: 4,
  },
  {
    number: "02",
    icon: "🚚",
    title: "Reroute",
    headline: "Recover value from compromised inventory",
    body: "When shelf life degrades in transit, dynamic rerouting and markdown automation can reduce spoilage costs by 38% and recover 60% to 80% of write-off value.",
    stat: "38%",
    statLabel: "average spoilage-cost reduction",
    citation: 33,
  },
  {
    number: "03",
    icon: "🌍",
    title: "Decarbonize",
    headline: "Prevent methane and protect margins",
    body: "Food waste drives 58% of fugitive landfill methane in U.S. MSW systems. Cutting temperature-linked loss reduces emissions while unlocking billions in recoverable inventory value.",
    stat: "58%",
    statLabel: "of fugitive methane from food waste",
    citation: 16,
  },
];

const ROADMAP = [
  {
    year: "Baseline",
    milestone: "Current loss profile",
    description:
      "U.S. retailers discard roughly 16 billion pounds of product each year due to temperature mismanagement in transport and storage.",
  },
  {
    year: "Detection",
    milestone: "Close the visibility gap",
    description:
      "Replace passive logging with real-time telemetry that detects failures early enough for operational response.",
  },
  {
    year: "Action",
    milestone: "Automate recovery decisions",
    description:
      "Use FEFO routing, markdown workflows, and secondary-market transfers to salvage inventory at risk.",
  },
  {
    year: "Scale",
    milestone: "Deploy across 500,000 reefers",
    description:
      "Nationwide deployment is projected at $535.5M to $667M across three years with upper-bound annual SaaS spend of $198M.",
  },
  {
    year: "Outcome",
    milestone: "Realize economic and climate returns",
    description:
      "The model projects $15.2B in annual inventory recovery, ~$76.77 returned per $1 of annual tracking spend, and 13.3M MTCO2e avoided each year at scale.",
  },
];

const SOURCES = [
  {
    id: 3,
    title:
      "Cold Chain Logistics Shipping Guide: Protect Product & Margin | Worldwide Express",
    href: "https://www.wwex.com/shipping-resources/cold-chain-logistics",
  },
  {
    id: 4,
    title: "Food Safety Information | NRM, Inc.",
    href: "https://www.nrminc.com/resources/food-safety-rules-regulations-nrm/",
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

export default function MissionPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-900">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.10),transparent)]" />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            Why we exist
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl">
            Build a cold chain where no shipment is{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              wasted by avoidable temperature loss
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            Our mission is to convert reactive cold-chain operations into
            real-time, recovery-first systems that cut spoilage, methane, and
            write-offs at the same time
            <Cite id={33} />
            <Cite id={16} />.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            How we get there
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Three pillars of impact
          </h2>
        </div>
        <div className="flex flex-col gap-8">
          {PILLARS.map(
            (
              { number, icon, title, headline, body, stat, statLabel, citation },
              idx
            ) => (
              <div
                key={title}
                className={`flex flex-col gap-8 rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:flex-row ${
                  idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex flex-1 flex-col justify-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{icon}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      {number} / {title}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {headline}
                  </h3>
                  <p className="leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {body}
                    <Cite id={citation} />
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-50 px-12 py-10 text-center dark:bg-emerald-900/20 md:min-w-[200px]">
                  <span className="text-4xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {stat}
                  </span>
                  <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {statLabel}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Roadmap / Timeline */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              How far we&apos;ve come
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Our impact roadmap
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-800 md:left-1/2" />
            <div className="flex flex-col gap-10">
              {ROADMAP.map(({ year, milestone, description }, i) => (
                <div
                  key={year}
                  className={`relative flex gap-6 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 top-3 -translate-x-1/2 md:left-1/2">
                    <div className="h-3 w-3 rounded-full border-2 border-emerald-600 bg-white dark:bg-zinc-950" />
                  </div>

                  {/* Content card */}
                  <div
                    className={`ml-12 w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:ml-0 md:w-[calc(50%-2rem)] ${
                      i % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      {year}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      {milestone}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {description}
                      {year === "Baseline" && <Cite id={3} />}
                      {year === "Scale" && (
                        <>
                          <Cite id={45} />
                        </>
                      )}
                      {year === "Outcome" && (
                        <>
                          <Cite id={33} />
                          <Cite id={34} />
                          <Cite id={50} />
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 dark:bg-emerald-700">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-16 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Align your cold chain with this mission
            </h2>
            <p className="mt-2 text-emerald-100">
              See how your operation can prioritize FEFO recovery and measurable
              ROI.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-700 shadow transition-colors hover:bg-emerald-50"
          >
            Book a Demo
          </Link>
        </div>
      </section>

      <Footnotes entries={SOURCES} />
    </>
  );
}
