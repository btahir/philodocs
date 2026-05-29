import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const contentDirs = ["content/thinkers", "content/schools", "content/works"] as const;

const issuePatterns = [
  [/a key term for understanding/i, "placeholder key-term definition"],
  [/No important works listed yet/i, "empty important works placeholder"],
  [/is an important text in the history of thought/i, "generic important-text filler"],
  [/matters because it gives a simple label for a family of ideas/i, "generic school-label filler"],
  [/right neighborhood of ideas/i, "generic reminder filler"],
  [/Read it as a text that tries to solve a problem, answer another thinker, or define a tradition/i, "relationship-first work filler"],
  [/^## Why They Matter$/im, "legacy why-they-matter heading"],
] as const;

const expectedHeadings = {
  thinkers: ["## The Big Question", "## What They Taught", "## Key Ideas With Examples", "## Major Works"],
  schools: ["## Main Ideas", "## How It Works", "## Key People", "## Important Works"],
  works: ["## The Problem", "## The Main Argument", "## Key Ideas With Examples"],
} as const;

const priorityRank: Record<string, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
};

type Row = {
  file: string;
  title: string;
  priority: string;
  issues: string[];
};

const routeForDir = (dir: (typeof contentDirs)[number]) => {
  if (dir.endsWith("thinkers")) return "thinkers";
  if (dir.endsWith("schools")) return "schools";
  return "works";
};

const rows: Row[] = [];

for (const dir of contentDirs) {
  const route = routeForDir(dir);
  const names = await fs.readdir(dir);

  for (const name of names) {
    if (!name.endsWith(".mdx")) continue;

    const file = path.join(dir, name);
    const raw = await fs.readFile(file, "utf8");
    const parsed = matter(raw);
    const body = parsed.content.trim();
    const issues: string[] = [];

    for (const [pattern, issue] of issuePatterns) {
      if (pattern.test(body)) issues.push(issue);
    }

    for (const heading of expectedHeadings[route]) {
      if (!body.includes(heading)) issues.push(`missing ${heading}`);
    }

    if (issues.length) {
      rows.push({
        file,
        title: String(parsed.data.title ?? name),
        priority: String(parsed.data.priority ?? "P1"),
        issues,
      });
    }
  }
}

rows.sort((a, b) => {
  const priority = (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
  if (priority) return priority;

  const issueCount = b.issues.length - a.issues.length;
  if (issueCount) return issueCount;

  return a.file.localeCompare(b.file);
});

const limit = Number(process.argv[2] ?? "80");
const selectedRows = rows.slice(0, Number.isFinite(limit) ? limit : 80);

console.log(["priority", "issues", "file", "title", "issue_types"].join("\t"));

for (const row of selectedRows) {
  console.log([row.priority, row.issues.length, row.file, row.title, row.issues.join("; ")].join("\t"));
}

console.error(`total queued: ${rows.length}`);
