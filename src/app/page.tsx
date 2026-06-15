import Link from "next/link";
import RoiProjections from "./components/RoiProjections";

const SOCIAL_PROOF = [
  { value: "340+", label: "Enterprise clients" },
  { value: "98k t", label: "Waste diverted" },
  { value: "$22M+", label: "Fees avoided" },
  { value: "99.4%", label: "Compliance rate" },
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
            Turn waste into a{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              competitive advantage
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            WasteWatcher automates compliance tracking, compiles claims, and
            unlocks tax write-offs — so your sustainability team spends less
            time on paperwork and more time driving impact.
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
          {SOCIAL_PROOF.map(({ value, label }) => (
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

      {/* ROI Projections */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <RoiProjections />
      </section>

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
