import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/mission', label: 'Mission' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                W
              </span>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                WasteWatcher
              </span>
            </Link>
            <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
              Turning waste compliance into a competitive advantage for modern enterprises.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} WasteWatcher Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
