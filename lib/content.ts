import {
  allSchools,
  allThinkers,
  allTimelines,
  allWorks,
  type School,
  type Thinker,
  type Timeline,
  type Work,
} from "content-collections";
import type { Relation } from "@/lib/relations";

export type WikiEntry = Thinker | School | Work | Timeline;
export type LinkableEntry = Thinker | School | Work;
export type EntryKind = LinkableEntry["kind"];
export type LinkableRelation = Relation & {
  source: LinkableEntry;
  targetEntry?: LinkableEntry;
};

const byTitle = <T extends { title: string }>(a: T, b: T) =>
  a.title.localeCompare(b.title);

const byPriorityThenTitle = <
  T extends { priority?: "P0" | "P1" | "P2"; title: string },
>(
  a: T,
  b: T,
) => {
  const priority = { P0: 0, P1: 1, P2: 2 };
  return (
    (priority[a.priority ?? "P2"] ?? 2) - (priority[b.priority ?? "P2"] ?? 2) ||
    byTitle(a, b)
  );
};

export const thinkers = [...allThinkers].sort((a, b) => {
  const aYear = a.birth_year ?? Number.POSITIVE_INFINITY;
  const bYear = b.birth_year ?? Number.POSITIVE_INFINITY;
  return aYear - bYear || byTitle(a, b);
});

export const schools = [...allSchools].sort(byPriorityThenTitle);
export const works = [...allWorks].sort(byPriorityThenTitle);
export const timelines = [...allTimelines].sort(byTitle);

export const linkableEntries: LinkableEntry[] = [
  ...thinkers,
  ...schools,
  ...works,
];

export function getWikiStats() {
  const timelineRows = timelines.reduce(
    (count, timeline) =>
      count +
      timeline.content.split("\n").filter((line) => {
        const trimmed = line.trim();
        return (
          trimmed.startsWith("|") &&
          !trimmed.includes("---") &&
          !trimmed.includes("Approx. date")
        );
      }).length,
    0,
  );

  return {
    thinkers: thinkers.length,
    schools: schools.length,
    works: works.length,
    timelineRows,
  };
}

export function getThinker(slug: string) {
  return thinkers.find((thinker) => thinker.slug === slug);
}

export function getSchool(slug: string) {
  return schools.find((school) => school.slug === slug);
}

export function getWork(slug: string) {
  return works.find((work) => work.slug === slug);
}

export function getTimeline() {
  return timelines[0];
}

export function getEntry(slug: string) {
  return linkableEntries.find((entry) => entry.slug === slug);
}

export function getEntries(slugs: string[]) {
  return slugs
    .map((slug) => getEntry(slug))
    .filter((entry): entry is LinkableEntry => Boolean(entry));
}

export function getEntryRelations(entry: LinkableEntry): LinkableRelation[] {
  return entry.relations.map((relation) => ({
    ...relation,
    source: entry,
    targetEntry: getEntry(relation.target),
  }));
}

export function getIncomingRelations(slug: string): LinkableRelation[] {
  return linkableEntries.flatMap((entry) =>
    entry.relations
      .filter((relation) => relation.target === slug)
      .map((relation) => ({
        ...relation,
        source: entry,
        targetEntry: getEntry(relation.target),
      })),
  );
}

export function getBacklinks(slug: string) {
  return getIncomingRelations(slug)
    .map((relation) => relation.source)
    .filter(
      (entry, index, entries) =>
        entries.findIndex((item) => item.slug === entry.slug) === index,
    );
}

export function getRelatedEntries(entry: LinkableEntry) {
  return getEntries([
    ...new Set(entry.relations.map((relation) => relation.target)),
  ]);
}

export function getTraditionIndex() {
  const traditions = new Map<string, LinkableEntry[]>();

  for (const entry of linkableEntries) {
    for (const tradition of entry.traditions) {
      const items = traditions.get(tradition) ?? [];
      items.push(entry);
      traditions.set(tradition, items);
    }
  }

  return [...traditions.entries()]
    .map(([name, entries]) => ({
      name,
      entries: entries.sort(byPriorityThenTitle),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
