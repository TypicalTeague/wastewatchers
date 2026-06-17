import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footnotes, { Cite } from "../components/Footnotes";

export const metadata: Metadata = {
  title: "About — WasteWatcher",
  description:
    "Learn how WasteWatcher uses evidence-based cold-chain data to reduce food loss, emissions, and avoidable write-offs.",
};

const STATS = [
  {
    value: "$380B",
    label: "U.S. surplus food value in 2024",
    source: 8,
  },
  {
    value: "500k",
    label: "Active refrigerated trailers in the U.S. fleet",
    source: 25,
  },
  {
    value: "55M",
    label: "Metric tons CO2e from annual U.S. food landfill emissions",
    source: 17,
  },
  { value: "3.65 yrs", label: "Food-waste landfill methane half-life", source: 18 },
];

const EVIDENCE_AREAS = [
  {
    title: "Food loss and economics",
    body: "We anchor opportunity sizing to ReFED data on U.S. surplus food value, per-capita waste, and system-level investment returns.",
    source: "ReFED reports and roadmap",
    citation: 8,
  },
  {
    title: "Landfill methane kinetics",
    body: "We model environmental risk with EPA methane kinetics and capture-lag findings so avoided waste translates to avoided emissions.",
    source: "U.S. EPA methane studies",
    citation: 16,
  },
  {
    title: "Transit refrigeration operations",
    body: "We prioritize the transport stage where failure rates, loading mistakes, and dwell-time delays drive avoidable spoilage events.",
    source: "Cold-chain operational analyses",
    citation: 3,
  },
  {
    title: "IoT mitigation outcomes",
    body: "We validate intervention impact with studies showing 38% spoilage-cost reduction and measurable emissions and cost savings at scale.",
    source: "IoT shelf-life and AI deployment evidence",
    citation: 33,
  },
];

const AUTHORS = [
  {
    name: "Abraham Guerrero",
    linkedin: "https://www.linkedin.com/in/abrahamdguerrero/",
    github: "https://github.com/AbeGue02",
    githubHandle: "AbeGue02",
    responsibility: "System Design & Software Development",
    blurb:
      "Leads system architecture and core implementation across telemetry ingestion, risk logic, and product integration.",
    photoUrl: "",
  },
  {
    name: "Andre Teague",
    linkedin: "https://www.linkedin.com/in/andreteaguejr/",
    github: "https://github.com/TypicalTeague",
    githubHandle: "TypicalTeague",
    responsibility: "Data Research & Software Development",
    blurb:
      "Owns research synthesis and contributes to software implementation that connects findings to product workflows.",
    photoUrl: "",
  },
  {
    name: "Niya Neblett",
    linkedin: "https://www.linkedin.com/in/niya-neblett/",
    github: "https://github.com/niyaneb",
    githubHandle: "niyaneb",
    responsibility: "Project Management & Research",
    blurb:
      "Coordinates project execution and research direction to keep delivery, scope, and evidence aligned.",
    photoUrl: "",
  },
  {
    name: "Isaac Johnson",
    linkedin: "https://www.linkedin.com/in/isaac-johnson-07202218b",
    github: "",
    githubHandle: "",
    responsibility: "Brand Identity & Marketing",
    blurb:
      "Shapes product narrative, visual identity, and go-to-market messaging for stakeholder-facing communication.",
    photoUrl: "",
  },
];

const PRINCIPLES = [
  {
    icon: "🔍",
    title: "Traceable Claims",
    body: "Every KPI we publish ties back to a publicly available source and is presented with explicit citation on-page.",
  },
  {
    icon: "🧪",
    title: "Operational Realism",
    body: "We focus on constraints that actually break cold chains: maintenance gaps, warm loading, dwell delays, and sensor blind spots.",
  },
  {
    icon: "📉",
    title: "Financial Accountability",
    body: "We frame sustainability changes in dollars recovered, spoilage reduced, and implementation cost so decisions are investable.",
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
    id: 17,
    title: "Food Waste and Methane: What's the Connection? - EPA",
    href: "https://www.epa.gov/system/files/documents/2024-06/epa_usda_methane_and_food_waste_fact_sheet.pdf",
  },
  {
    id: 18,
    title: "Quantifying Methane Emissions from Landfilled Food Waste - EPA",
    href: "https://www.epa.gov/system/files/documents/2023-10/food-waste-landfill-methane-10-8-23-final_508-compliant.pdf",
  },
  {
    id: 25,
    title: "Maximize Gains with Refrigerated Truck Trailers - Ryder",
    href: "https://www.ryder.com/en-us/insights/blogs/fleet/refrigerated-truck-trailers-guide",
  },
  {
    id: 33,
    title:
      "(PDF) Smart Shelf Life: How IoT Sensors Cut Food Waste by 38% While Boosting Perishable Profits",
    href: "https://www.researchgate.net/publication/396736476_Smart_Shelf_Life_How_IoT_Sensors_Cut_Food_Waste_by_38_While_Boosting_Perishable_Profits",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-900">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.10),transparent)]" />
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              Our Story
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
              Built on evidence,{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                not assumptions
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              Our product strategy is grounded in published cold-chain,
              methane, and food-waste economics research. Midstream logistics
              failures drive a disproportionate share of loss and climate
              impact
              <Cite id={3} />
              <Cite id={16} />, so we focus on interventions that are measurable
              in both dollars and emissions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-zinc-200 px-6 dark:divide-zinc-800 md:grid-cols-4 md:divide-y-0">
          {STATS.map(({ value, label, source }) => (
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

      {/* Values */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            What we stand for
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Our research principles
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map(({ icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-3xl">{icon}</span>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              How we structure the evidence
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Evidence base
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EVIDENCE_AREAS.map(({ title, body, source, citation }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-50">
                    {title}
                  </p>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {source}
                    <Cite id={citation} />
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Product authors
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Built by this team
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            Names link directly to LinkedIn profiles. LinkedIn profile photos
            are shown when publicly fetchable; otherwise a monogram is used.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AUTHORS.map(
            ({
              name,
              linkedin,
              github,
              githubHandle,
              responsibility,
              blurb,
              photoUrl,
            }) => {
              const initials = name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <article
                  key={name}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={`${name} profile`}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {initials}
                    </div>
                  )}

                  <div>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-zinc-900 underline decoration-emerald-500 underline-offset-4 hover:text-emerald-700 dark:text-zinc-50 dark:hover:text-emerald-300"
                    >
                      {name}
                    </a>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {responsibility}
                    </p>
                    {github && githubHandle ? (
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        GitHub:{" "}
                        <a
                          href={github}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-zinc-800 dark:hover:text-zinc-200"
                        >
                          @{githubHandle}
                        </a>
                      </p>
                    ) : null}
                  </div>

                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {blurb}
                  </p>
                </article>
              );
            }
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 dark:bg-emerald-700">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-16 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Need a data-backed waste strategy?
            </h2>
            <p className="mt-2 text-emerald-100">
              Talk with us about how these findings translate into your
              network-level implementation plan.
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

      <Footnotes entries={SOURCES} />
    </>
  );
}
