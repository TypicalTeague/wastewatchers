import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — WasteWatcher",
  description:
    "Learn how WasteWatcher was founded and the team behind the platform.",
};

const STATS = [
  { value: "2019", label: "Founded" },
  { value: "340+", label: "Enterprise clients" },
  { value: "18", label: "Countries served" },
  { value: "62", label: "Team members" },
];

const TEAM = [
  {
    name: "Sofia Reyes",
    role: "Co-founder & CEO",
    bio: "Former sustainability director at a Fortune 500 logistics firm. Sofia built WasteWatcher after spending a decade wrestling with manual compliance spreadsheets.",
    initials: "SR",
    color: "bg-violet-500",
  },
  {
    name: "Marcus Tran",
    role: "Co-founder & CTO",
    bio: "Ex-Google engineer specialising in data pipelines and regulatory automation. Marcus architected WasteWatcher's real-time compliance engine.",
    initials: "MT",
    color: "bg-sky-500",
  },
  {
    name: "Aisha Okafor",
    role: "Head of Customer Success",
    bio: "Helps enterprise clients turn onboarding into ROI within 90 days. Former ESG consultant with 12 years of client-side experience.",
    initials: "AO",
    color: "bg-amber-500",
  },
  {
    name: "Daniel Park",
    role: "Head of Product",
    bio: "Product leader with a background in SaaS compliance tooling. Daniel drives the roadmap with a relentless focus on reducing time-to-insight.",
    initials: "DP",
    color: "bg-rose-500",
  },
];

const VALUES = [
  {
    icon: "🔍",
    title: "Radical Transparency",
    body: "Every data point we surface is traceable to source. We believe auditable clarity is the foundation of trust.",
  },
  {
    icon: "⚡",
    title: "Speed to Compliance",
    body: "Regulatory deadlines don't wait. We design for urgency — so your team always files on time, every time.",
  },
  {
    icon: "🌱",
    title: "Impact at Scale",
    body: "Individual actions matter. But systemic change requires enterprise-grade tools that make doing the right thing the easiest path.",
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
              Built by operators,{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                for operators
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              WasteWatcher started with a simple frustration: compliance teams
              at large enterprises were spending hundreds of hours per year
              manually reconciling waste manifests, compiling claims, and
              chasing contractors for documentation. We built the platform we
              wished we had.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-zinc-200 px-6 dark:divide-zinc-800 md:grid-cols-4 md:divide-y-0">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-6 py-8 text-center"
            >
              <span className="text-3xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                {value}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {label}
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
            Our values
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map(({ icon, title, body }) => (
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
              The people behind the platform
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Leadership team
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ name, role, bio, initials, color }) => (
              <div
                key={name}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${color} text-sm font-bold text-white`}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-50">
                    {name}
                  </p>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {role}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 dark:bg-emerald-700">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-16 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Want to join our mission?
            </h2>
            <p className="mt-2 text-emerald-100">
              We&apos;re always looking for people who care about the planet
              and love building great software.
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
