import Link from "next/link";
import { EntryList } from "@/components/wiki/entry-list";
import { WikiFrame } from "@/components/wiki/wiki-frame";
import {
  getTraditionIndex,
  getWikiStats,
  schools,
  thinkers,
  works,
} from "@/lib/content";

export default function Home() {
  const stats = getWikiStats();
  const traditions = getTraditionIndex().slice(0, 14);
  const essentialThinkers = thinkers
    .filter((entry) => entry.priority === "P0")
    .slice(0, 8);
  const essentialSchools = schools
    .filter((entry) => entry.priority === "P0")
    .slice(0, 6);
  const anchorWorks = works
    .filter((entry) => entry.priority === "P0")
    .slice(0, 6);

  return (
    <WikiFrame>
      <section className="wiki-home-header">
        <div>
          <p className="wiki-kicker">Index</p>
          <h1 className="wiki-home-title">PhiloDocs</h1>
          <p className="wiki-home-copy">
            Open-source notes for the history of thought: a philosophy wiki,
            timeline, and relationship graph built for clear understanding.
            It started as a personal database for remembering what thinkers
            actually said, and it keeps that bias toward plain language,
            useful examples, and visible links between ideas.
          </p>
        </div>
        <div className="wiki-home-actions">
          <Link href="/timeline" className="wiki-button-primary">
            Timeline
          </Link>
          <Link href="/thinkers" className="wiki-button">
            Thinkers
          </Link>
        </div>
      </section>

      <section className="wiki-metrics">
        <Metric label="Thinkers" value={stats.thinkers} />
        <Metric label="Schools" value={stats.schools} />
        <Metric label="Works" value={stats.works} />
        <Metric label="Timeline rows" value={stats.timelineRows} />
      </section>

      <section className="wiki-home-grid">
        <div>
          <div className="wiki-section-heading">
            <div>
              <p className="wiki-kicker">Thinkers</p>
              <h2>Essential nodes</h2>
            </div>
            <Link href="/thinkers" className="wiki-text-link">
              Browse all
            </Link>
          </div>
          <EntryList entries={essentialThinkers} />
        </div>

        <div className="wiki-home-stack">
          <div>
            <div className="wiki-section-heading">
              <div>
                <p className="wiki-kicker">Schools</p>
                <h2>Core traditions</h2>
              </div>
              <Link href="/schools" className="wiki-text-link">
                All schools
              </Link>
            </div>
            <EntryList entries={essentialSchools} compact />
          </div>

          <div>
            <div className="wiki-section-heading">
              <div>
                <p className="wiki-kicker">Works</p>
                <h2>Text anchors</h2>
              </div>
              <Link href="/works" className="wiki-text-link">
                All works
              </Link>
            </div>
            <EntryList entries={anchorWorks} compact />
          </div>
        </div>
      </section>

      <section className="wiki-cluster-band">
        <div className="wiki-section-heading">
          <div>
            <p className="wiki-kicker">Clusters</p>
            <h2>Tradition index</h2>
          </div>
        </div>
        <div className="wiki-chip-grid">
          {traditions.map((tradition) => (
            <span key={tradition.name} className="wiki-chip">
              {tradition.name} · {tradition.entries.length}
            </span>
          ))}
        </div>
      </section>
    </WikiFrame>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="wiki-metric">
      <div className="wiki-metric-value">{value}</div>
      <div className="wiki-metric-label">{label}</div>
    </div>
  );
}
