interface Footnote {
  id: number;
  title: string;
  href: string;
}

interface FootnotesProps {
  title?: string;
  entries: Footnote[];
}

export function Cite({ id }: { id: number }) {
  return (
    <sup className="ml-1 align-super text-xs">
      <a
        href={`#source-${id}`}
        className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
      >
        [{id}]
      </a>
    </sup>
  );
}

export default function Footnotes({
  title = "Footnotes",
  entries,
}: FootnotesProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {entries.map(({ id, title: entryTitle, href }) => (
          <li key={id} id={`source-${id}`} className="scroll-mt-24">
            {entryTitle}{" "}
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 underline hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {href}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
