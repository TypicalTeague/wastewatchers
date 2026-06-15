import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — WasteWatcher",
  description:
    "Get in touch with the WasteWatcher team to book a demo or ask about enterprise plans.",
};

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
                your waste strategy
              </span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              Whether you&apos;re ready for a full demo or just exploring your
              options, we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact content */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 pb-28">
        <ContactClient />
      </section>
    </>
  );
}
