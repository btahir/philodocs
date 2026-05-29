import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const contentDirs = ["content/thinkers", "content/schools", "content/works"] as const;

const hardFailurePatterns = [
  {
    name: "placeholder key-term definition",
    pattern: /a key term for understanding/i,
  },
  {
    name: "empty important works placeholder",
    pattern: /No important works listed yet/i,
  },
  {
    name: "generic important-text filler",
    pattern: /is an important text in the history of thought/i,
  },
  {
    name: "generic school-label filler",
    pattern: /matters because it gives a simple label for a family of ideas/i,
  },
  {
    name: "generic reminder filler",
    pattern: /right neighborhood of ideas/i,
  },
  {
    name: "relationship-first work filler",
    pattern: /Read it as a text that tries to solve a problem, answer another thinker, or define a tradition/i,
  },
  {
    name: "legacy why-they-matter heading",
    pattern: /^## Why They Matter$/im,
  },
] as const;

const expectedHeadings = {
  thinkers: ["## The Big Question", "## What They Taught", "## Key Ideas With Examples", "## Major Works"],
  schools: ["## Main Ideas", "## How It Works", "## Key People", "## Important Works"],
  works: ["## The Problem", "## The Main Argument", "## Key Ideas With Examples"],
} as const;

type Issue = {
  file: string;
  title: string;
  issue: string;
};

const routeForDir = (dir: (typeof contentDirs)[number]) => {
  if (dir.endsWith("thinkers")) return "thinkers";
  if (dir.endsWith("schools")) return "schools";
  return "works";
};

const audit = async () => {
  const issues: Issue[] = [];
  let files = 0;

  for (const dir of contentDirs) {
    const route = routeForDir(dir);
    const names = await fs.readdir(dir);

    for (const name of names) {
      if (!name.endsWith(".mdx")) continue;

      files++;
      const file = path.join(dir, name);
      const raw = await fs.readFile(file, "utf8");
      const parsed = matter(raw);
      const body = parsed.content.trim();
      const title = String(parsed.data.title ?? name);

      for (const { name: issue, pattern } of hardFailurePatterns) {
        if (pattern.test(body)) issues.push({ file, title, issue });
      }

      for (const heading of expectedHeadings[route]) {
        if (!body.includes(heading)) {
          issues.push({ file, title, issue: `missing expected heading ${heading}` });
        }
      }
    }
  }

  const grouped = issues.reduce<Record<string, number>>((acc, issue) => {
    acc[issue.issue] = (acc[issue.issue] ?? 0) + 1;
    return acc;
  }, {});

  console.log(
    JSON.stringify(
      {
        files,
        issues: issues.length,
        byType: grouped,
      },
      null,
      2,
    ),
  );

  if (issues.length) {
    console.log("\nFirst 80 issues:");
    for (const issue of issues.slice(0, 80)) {
      console.log(`${issue.file}: ${issue.issue} (${issue.title})`);
    }

    if (issues.length > 80) {
      console.log(`...and ${issues.length - 80} more`);
    }

    process.exit(1);
  }
};

await audit();
