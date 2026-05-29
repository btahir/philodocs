import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { relationSchema } from "../lib/relations";

const contentDirs = [
  { dir: "content/thinkers", kind: "thinker", route: "thinkers" },
  { dir: "content/schools", kind: "school", route: "schools" },
  { dir: "content/works", kind: "work", route: "works" },
] as const;

const legacyKeys = [
  "influenced_by",
  "influenced",
  "related",
  "works",
  "key_thinkers",
  "parent_schools",
  "related_thinkers",
  "author",
];

const wordTargets = {
  P0: 350,
  P1: 250,
  P2: 180,
} as const;

type Entry = {
  file: string;
  kind: (typeof contentDirs)[number]["kind"];
  route: (typeof contentDirs)[number]["route"];
  slug: string;
  title: string;
  priority: keyof typeof wordTargets;
  data: Record<string, unknown>;
  body: string;
  words: number;
};

const readEntries = async () => {
  const entries: Entry[] = [];

  for (const { dir, kind, route } of contentDirs) {
    const names = await fs.readdir(dir);

    for (const name of names) {
      if (!name.endsWith(".mdx")) continue;

      const file = path.join(dir, name);
      const raw = await fs.readFile(file, "utf8");
      const parsed = matter(raw);
      const body = parsed.content.trim();
      const words = body.match(/\b[\w'-]+\b/g)?.length ?? 0;

      entries.push({
        file,
        kind,
        route,
        slug: String(parsed.data.slug ?? ""),
        title: String(parsed.data.title ?? ""),
        priority: String(parsed.data.priority ?? "P1") as keyof typeof wordTargets,
        data: parsed.data,
        body,
        words,
      });
    }
  }

  return entries;
};

const validate = async () => {
  const entries = await readEntries();
  const failures: string[] = [];
  const warnings: string[] = [];
  const slugToEntry = new Map<string, Entry>();
  const routeToSlug = new Map<string, Set<string>>();
  let relationCount = 0;

  for (const { route } of contentDirs) {
    routeToSlug.set(route, new Set());
  }

  for (const entry of entries) {
    if (!entry.slug) failures.push(`${entry.file}: missing slug`);

    const existing = slugToEntry.get(entry.slug);
    if (existing) failures.push(`${entry.file}: duplicate slug ${entry.slug} also used by ${existing.file}`);
    slugToEntry.set(entry.slug, entry);
    routeToSlug.get(entry.route)?.add(entry.slug);
  }

  for (const entry of entries) {
    for (const key of legacyKeys) {
      if (Object.hasOwn(entry.data, key)) failures.push(`${entry.file}: legacy frontmatter key ${key}`);
    }

    if (!Object.hasOwn(entry.data, "relations")) {
      failures.push(`${entry.file}: missing relations array`);
    }

    const relations = Array.isArray(entry.data.relations) ? entry.data.relations : [];

    for (const [index, relation] of relations.entries()) {
      relationCount++;
      const result = relationSchema.safeParse(relation);

      if (!result.success) {
        failures.push(`${entry.file}: relation ${index} invalid: ${result.error.issues.map((issue) => issue.message).join("; ")}`);
        continue;
      }

      const parsed = result.data;

      if (parsed.target_kind !== "concept" && !slugToEntry.has(parsed.target)) {
        failures.push(`${entry.file}: relation ${index} targets missing ${parsed.target_kind} slug ${parsed.target}`);
      }

      for (const via of parsed.via) {
        if (!slugToEntry.has(via)) failures.push(`${entry.file}: relation ${index} via missing slug ${via}`);
      }
    }

    const linkPattern = /\]\(\/(thinkers|schools|works)\/([a-z0-9-]+)(?:\.html)?\)/g;
    for (const match of entry.body.matchAll(linkPattern)) {
      const [, route, slug] = match;
      if (!routeToSlug.get(route)?.has(slug)) {
        failures.push(`${entry.file}: body link targets missing /${route}/${slug}`);
      }
    }

    if (entry.body.includes("[[")) {
      failures.push(`${entry.file}: contains unsupported wiki-style [[...]] links`);
    }

    const target = wordTargets[entry.priority];
    if (target && entry.words < target) {
      warnings.push(`${entry.file}: ${entry.words} words below ${entry.priority} target ${target}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        files: entries.length,
        relations: relationCount,
        failures: failures.length,
        warnings: warnings.length,
      },
      null,
      2,
    ),
  );

  if (warnings.length) {
    console.log("\nShort-page warnings:");
    console.log(warnings.slice(0, 40).join("\n"));
    if (warnings.length > 40) console.log(`...and ${warnings.length - 40} more`);
  }

  if (failures.length) {
    console.error("\nContent validation failures:");
    console.error(failures.join("\n"));
    process.exit(1);
  }
};

await validate();
