import Link from "next/link";
import type { LinkableEntry } from "@/lib/content";

export function EntryList({
  compact = false,
  entries,
}: {
  compact?: boolean;
  entries: LinkableEntry[];
}) {
  return (
    <div className={compact ? "wiki-entry-list-compact" : "wiki-entry-list"}>
      {entries.map((entry) => (
        <Link key={entry.slug} href={entry.url} className="wiki-entry-row">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="wiki-entry-title">{entry.title}</h2>
              <span className="wiki-kicker">{entry.kind}</span>
            </div>
            <p className="wiki-entry-summary">{entry.summary}</p>
          </div>
          <div className="wiki-entry-traditions">
            {entry.traditions.slice(0, 2).join(" / ")}
          </div>
        </Link>
      ))}
    </div>
  );
}
