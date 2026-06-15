import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mission — WasteWatcher",
  description:
    "WasteWatcher's mission: eliminate waste compliance friction for enterprises and accelerate the global transition to a circular economy.",
};

const PILLARS = [
  {
    number: "01",
    icon: "♻️",
    title: "Divert",
    headline: "Keep materials out of landfill",
    body: "Our platform tracks every waste stream in real time — giving your operations team the visibility to redirect materials to recycling, composting, or energy-recovery partners before they ever reach a landfill gate.",
    stat: "98,000 t",
    statLabel: "diverted to date",
  },
  {
    number: "02",
    icon: "⚙️",
    title: "Automate",
    headline: "Eliminate manual compliance work",
    body: "From manifest reconciliation to regulatory filings, WasteWatcher automates the entire compliance lifecycle. What used to take weeks of analyst time now happens overnight — with full audit trails attached.",
    stat: "1.2M+",
    statLabel: "claims auto-compiled",
  },
  {
    number: "03",
    icon: "💡",
    title: "Empower",
    headline: "Turn data into financial value",
    body: "Every ton diverted and every claim filed is a financial event. WasteWatcher surfaces tax write-off opportunities, fee avoidance savings, and ESG reporting metrics so sustainability becomes a board-level story.",
    stat: "$22M+",
    statLabel: "write-offs unlocked",
  },
];

const ROADMAP = [
  {
    year: "2019",
    milestone: "Founded",
    description:
      "WasteWatcher incorporated with a focus on mid-market logistics operators.",
  },
  {
    year: "2020",
    milestone: "Series A",
    description:
      "Raised $8M to scale the compliance engine and expand to the manufacturing sector.",
  },
  {
    year: "2021",
    milestone: "100 clients",
    description:
      "Crossed the 100-enterprise milestone and launched multi-jurisdiction filing support.",
  },
  {
    year: "2022",
    milestone: "ESG Dashboard",
    description:
      "Shipped the board-ready ESG reporting module and integrations with SAP and Oracle.",
  },
  {
    year: "2023",
    milestone: "Series B",
    description:
      "Raised $31M. Expanded to 18 countries. Launched the AI-powered diversion recommendation engine.",
  },
  {
    year: "2025",
    milestone: "340+ clients",
    description:
      "Serving Fortune 500s across logistics, manufacturing, retail, and healthcare.",
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
            A world where no enterprise{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              wastes what it could recover
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            The circular economy isn&apos;t a dream — it&apos;s an engineering
            problem. WasteWatcher exists to make the infrastructure layer that
            turns compliance obligations into business advantage.
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
            ({ number, icon, title, headline, body, stat, statLabel }, idx) => (
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
              Align your operations with our mission
            </h2>
            <p className="mt-2 text-emerald-100">
              See how WasteWatcher can help your organisation hit its
              sustainability targets.
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
    </>
  );
}
