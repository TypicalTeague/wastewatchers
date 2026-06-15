'use client'

import { useState } from 'react'

const CONTACT_INFO = [
  {
    icon: '📍',
    label: 'Office',
    value: '250 Montgomery St, Suite 800\nSan Francisco, CA 94104',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@wastewatcher.io',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+1 (415) 555-0198',
  },
  {
    icon: '🕒',
    label: 'Hours',
    value: 'Mon – Fri, 9 am – 6 pm PT',
  },
]

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
      {/* Form */}
      <div>
        {submitted ? (
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-10 dark:border-emerald-800 dark:bg-emerald-900/20">
            <span className="text-4xl">🎉</span>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Message received!
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Thanks for reaching out. A member of our team will be in touch
              within one business day.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setForm({ name: '', company: '', email: '', message: '' })
              }}
              className="mt-2 rounded-full border border-zinc-300 px-6 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="company"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@acme.com"
                className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your organisation and what you're trying to solve..."
                className="resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
              />
            </div>
            <button
              type="submit"
              className="self-start rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Send message
            </button>
          </form>
        )}
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Other ways to reach us
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            We respond to all enterprise enquiries within one business day. For
            urgent technical issues, please use the in-app support channel.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {CONTACT_INFO.map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="mt-0.5 text-xl">{icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {label}
                </p>
                <p className="mt-0.5 whitespace-pre-line text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            🚀 Looking for a quick demo?
          </p>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
            Fill in the form and select &quot;Book a Demo&quot; in your message.
            We&apos;ll schedule a 30-minute call with one of our solutions
            engineers.
          </p>
        </div>
      </div>
    </div>
  )
}
