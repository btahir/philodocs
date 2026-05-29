import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getTimeline,
  linkableEntries,
  type LinkableEntry,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "History of Thought Timeline",
};

type TimelineRow = {
  date: string;
  title: string;
  region: string;
  tags: string[];
  slug: string;
  entry?: LinkableEntry;
};

type TimelineEra = {
  id: string;
  title: string;
  rows: TimelineRow[];
};

export default function TimelinePage() {
  const timeline = getTimeline();
  if (!timeline) notFound();

  const eras = parseTimeline(timeline.content);
  const totalRows = eras.reduce((count, era) => count + era.rows.length, 0);

  return (
    <article className="wiki-timeline">
      <header className="wiki-index-header">
        <p className="wiki-kicker">Timeline</p>
        <h1 className="wiki-index-title">{timeline.title}</h1>
        <p className="wiki-index-copy">
          A chronological map of major thinkers and thought movements. Names
          link directly into the wiki where a page exists.
        </p>
      </header>

      <nav className="wiki-timeline-jump" aria-label="Timeline sections">
        {eras.map((era) => (
          <Link
            key={era.id}
            href={`#${era.id}`}
            className="wiki-timeline-jump-link"
          >
            <span>{era.title}</span>
            <span>{era.rows.length}</span>
          </Link>
        ))}
      </nav>

      <div className="wiki-timeline-count">
        {totalRows} entries across {eras.length} sections
      </div>

      <div className="wiki-timeline-sections">
        {eras.map((era) => (
          <section key={era.id} id={era.id} className="wiki-timeline-era">
            <div className="wiki-timeline-era-heading">
              <h2>{era.title}</h2>
              <span>{era.rows.length}</span>
            </div>

            <ol className="wiki-timeline-list">
              {era.rows.map((row) => (
                <li key={`${era.id}-${row.slug}`} className="wiki-timeline-item">
                  <div className="wiki-timeline-date">{row.date}</div>
                  <div className="wiki-timeline-body">
                    <div className="wiki-timeline-title-row">
                      {row.entry ? (
                        <Link href={row.entry.url} className="wiki-timeline-title">
                          {row.title}
                        </Link>
                      ) : (
                        <span className="wiki-timeline-title">{row.title}</span>
                      )}
                      {row.entry ? (
                        <span className="wiki-kicker">
                          {formatKind(row.entry.kind)}
                        </span>
                      ) : null}
                    </div>

                    <div className="wiki-timeline-meta">
                      <span>{row.region}</span>
                      {row.tags.slice(0, 4).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    {row.entry ? (
                      <p className="wiki-timeline-summary">{row.entry.summary}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </article>
  );
}

function parseTimeline(content: string): TimelineEra[] {
  const entriesBySlug = new Map(
    linkableEntries.map((entry) => [entry.slug, entry]),
  );
  const eras: TimelineEra[] = [];
  let currentEra: TimelineEra | undefined;
  let inTimeline = false;

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (trimmed === "## Timeline") {
      inTimeline = true;
      continue;
    }

    if (trimmed === "## School And Movement Nodes") {
      inTimeline = true;
      currentEra = {
        id: "school-and-movement-nodes",
        title: "School And Movement Nodes",
        rows: [],
      };
      eras.push(currentEra);
      continue;
    }

    if (
      inTimeline &&
      trimmed.startsWith("## ") &&
      trimmed !== "## Timeline"
    ) {
      break;
    }

    if (!inTimeline) continue;

    if (trimmed.startsWith("### ")) {
      const title = trimmed.replace(/^###\s+/, "");
      currentEra = {
        id: toAnchorId(title),
        title,
        rows: [],
      };
      eras.push(currentEra);
      continue;
    }

    if (
      !currentEra ||
      !trimmed.startsWith("|") ||
      trimmed.includes("---") ||
      trimmed.includes("Approx. date")
    ) {
      continue;
    }

    const [date, title, region, tagText, slug] =
      splitMarkdownTableRow(trimmed);
    if (!date || !title || !region || !tagText || !slug) continue;

    currentEra.rows.push({
      date,
      title,
      region,
      tags: tagText.split(",").map((tag) => tag.trim()).filter(Boolean),
      slug,
      entry: entriesBySlug.get(slug),
    });
  }

  return eras.filter((era) => era.rows.length > 0);
}

function splitMarkdownTableRow(row: string) {
  return row
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function toAnchorId(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatKind(kind: LinkableEntry["kind"]) {
  return kind === "thinker"
    ? "Thinker"
    : kind === "school"
      ? "School"
      : "Work";
}
