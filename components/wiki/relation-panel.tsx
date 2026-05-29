import Link from "next/link";
import {
  RelationshipGraph,
  type RelationshipGraphRelation,
} from "@/components/wiki/relationship-graph";
import {
  getEntryRelations,
  getIncomingRelations,
  type LinkableEntry,
  type LinkableRelation,
} from "@/lib/content";
import { relationStanceLabels, relationTypeLabels } from "@/lib/relations";

type GraphRelation = {
  dedupeKey: string;
} & RelationshipGraphRelation;

const sourceTypes = new Set([
  "inherits",
  "develops",
  "reacts_to",
  "reframes",
  "synthesizes",
  "revives",
  "radicalizes",
  "applies",
  "secularizes",
]);

export function RelationPanel({ entry }: { entry: LinkableEntry }) {
  const outgoing = getEntryRelations(entry);
  const incoming = getIncomingRelations(entry.slug);
  const graphRelations = buildGraphRelations(outgoing, incoming);
  const proponents = incoming.filter(isProponentRelation);
  const challenges = incoming.filter(isChallengeRelation);
  const otherIncoming = incoming.filter(
    (relation) =>
      !isProponentRelation(relation) && !isChallengeRelation(relation),
  );

  return (
    <div
      className="wiki-relation-panel"
      data-pagefind-ignore
    >
      <RelationGraph entry={entry} relations={graphRelations} />

      <div className="wiki-relation-list-grid">
        <RelationSection
          title="Proponents"
          relations={proponents}
          direction="in"
        />
        <RelationSection
          title="Opponents And Critics"
          relations={challenges}
          direction="in"
        />
        <RelationSection title="Relations" relations={outgoing} direction="out" />
        <RelationSection
          title="Other Incoming"
          relations={otherIncoming}
          direction="in"
        />
      </div>
    </div>
  );
}

function isProponentRelation(relation: LinkableRelation) {
  return (
    ["supportive", "mixed"].includes(relation.stance) &&
    [
      "inherits",
      "develops",
      "revives",
      "applies",
      "influences",
      "exemplified_by",
      "central_to",
    ].includes(relation.type)
  );
}

function isChallengeRelation(relation: LinkableRelation) {
  return (
    relation.stance === "critical" ||
    relation.stance === "oppositional" ||
    relation.type === "criticizes" ||
    relation.type === "opposes"
  );
}

function buildGraphRelations(
  outgoing: LinkableRelation[],
  incoming: LinkableRelation[],
) {
  const relations: GraphRelation[] = [];
  const seen = new Set<string>();

  for (const relation of outgoing) {
    if (!relation.targetEntry) continue;
    addGraphRelation(relations, seen, {
      id: `out-${relation.type}-${relation.target}`,
      label: relationTypeLabels[relation.type],
      related: toGraphEntry(relation.targetEntry),
      dedupeKey: `${relation.targetEntry.slug}-${relation.type}`,
      tone: getRelationTone(relation, "out"),
    });
  }

  for (const relation of incoming) {
    addGraphRelation(relations, seen, {
      id: `in-${relation.source.slug}-${relation.type}`,
      label: relationTypeLabels[relation.type],
      related: toGraphEntry(relation.source),
      dedupeKey: `${relation.source.slug}-${relation.type}`,
      tone: getRelationTone(relation, "in"),
    });
  }

  return relations
    .sort((a, b) => toneRank(a.tone) - toneRank(b.tone))
    .slice(0, 12)
    .map((relation) => ({
      id: relation.id,
      label: relation.label,
      related: relation.related,
      tone: relation.tone,
    }));
}

function addGraphRelation(
  relations: GraphRelation[],
  seen: Set<string>,
  relation: GraphRelation,
) {
  if (seen.has(relation.dedupeKey)) return;
  seen.add(relation.dedupeKey);
  relations.push(relation);
}

function getRelationTone(
  relation: LinkableRelation,
  direction: "in" | "out",
): GraphRelation["tone"] {
  if (isChallengeRelation(relation)) return "critical";
  if (
    (direction === "out" && sourceTypes.has(relation.type)) ||
    (direction === "in" && relation.type === "influences")
  ) {
    return "source";
  }
  if (
    (direction === "out" && relation.type === "influences") ||
    (direction === "in" && sourceTypes.has(relation.type))
  ) {
    return "legacy";
  }

  return "neutral";
}

function toneRank(tone: GraphRelation["tone"]) {
  return { source: 0, legacy: 1, critical: 2, neutral: 3 }[tone];
}

function RelationGraph({
  entry,
  relations,
}: {
  entry: LinkableEntry;
  relations: RelationshipGraphRelation[];
}) {
  return (
    <section className="wiki-relation-graph-section">
      <div className="wiki-relation-heading">
        <div>
          <p className="wiki-kicker">Graph</p>
          <h2>Relationship graph</h2>
        </div>
        <span>{relations.length}</span>
      </div>

      <RelationshipGraph
        entry={{ kind: entry.kind, title: entry.title }}
        relations={relations}
      />
    </section>
  );
}

function toGraphEntry(entry: LinkableEntry) {
  return {
    kind: entry.kind,
    title: entry.title,
    url: entry.url,
  };
}

function RelationSection({
  title,
  relations,
  direction,
}: {
  title: string;
  relations: LinkableRelation[];
  direction: "in" | "out";
}) {
  return (
    <section>
      <h2 className="wiki-sidebar-title">{title}</h2>
      {relations.length > 0 ? (
        <ul className="mt-3 grid gap-3 text-sm">
          {relations.map((relation) => {
            const entry =
              direction === "out" ? relation.targetEntry : relation.source;
            const fallbackTitle =
              direction === "out" ? relation.target : relation.source.title;

            return (
              <li
                key={`${title}-${relation.source.slug}-${relation.type}-${relation.target}`}
              >
                {entry ? (
                  <Link href={entry.url} className="wiki-sidebar-link">
                    {entry.title}
                  </Link>
                ) : (
                  <span className="text-[var(--ink)]">{fallbackTitle}</span>
                )}
                <div className="mt-1 text-xs text-[var(--muted)]">
                  {relationTypeLabels[relation.type]} ·{" "}
                  {relationStanceLabels[relation.stance]}
                </div>
                <p className="mt-1 leading-5 text-[var(--muted)]">
                  {relation.note}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--muted)]">None yet.</p>
      )}
    </section>
  );
}
