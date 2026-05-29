import type { LinkableEntry } from "@/lib/content";

export function EntryHeader({ entry }: { entry: LinkableEntry }) {
  return (
    <header className="border-b border-[var(--line)] pb-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="wiki-kicker">{entry.kind}</span>
      </div>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-[var(--ink)] md:text-5xl">
        {entry.title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
        {entry.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.traditions.map((tradition) => (
          <span key={tradition} className="wiki-chip">
            {tradition}
          </span>
        ))}
      </div>
    </header>
  );
}
