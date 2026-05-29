# PhiloDocs

Open-source notes for the history of thought.

PhiloDocs is a philosophy wiki, timeline, and relationship graph built for clear understanding. It covers thinkers, schools, works, and the links between them without trying to become another Wikipedia. The goal is a fast reference you can read in a few minutes when you need to remember what someone argued, why it mattered, who influenced it, and who pushed back.

This started as a personal database for remembering philosophy. That origin still matters: the writing should be plain, direct, useful, and opinionated about clarity. The project is now structured so other people can fork it, improve the shared corpus, or use the system for their own notes.

## What It Includes

- A static Next.js wiki for thinkers, schools, works, and timelines.
- MDX content with typed frontmatter through Content Collections and Zod.
- Relationship metadata for influence, criticism, inheritance, contrast, authorship, and related links.
- Per-page relationship graphs for navigating the surrounding intellectual network.
- Pagefind-powered local search over generated static pages.
- Lightweight image optimization scripts for icons and social images.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Content Collections
- MDX with `remark-gfm`
- Zod
- Pagefind
- Tailwind CSS 4
- Sharp

## Getting Started

Install dependencies:

```bash
bun install
```

Run checks:

```bash
bun run lint
bun run validate:content
bun run build
```

Build the search index after a production build:

```bash
bun run build:search
```

For local development:

```bash
bun run dev
```

## Content Model

Content lives in `content/`:

- `content/thinkers/` for people and major intellectual figures.
- `content/schools/` for schools, movements, traditions, and clusters.
- `content/works/` for books, essays, doctrines, and durable text anchors.
- `content/history-of-thought/` for the timeline source.

Each thinker, school, and work has typed frontmatter plus MDX body content. Relations are structured data, not prose-only links, so the site can render backlinks, critics, proponents, and graph nodes automatically.

## Writing Style

PhiloDocs should read like a smart refresher, not a textbook.

- Use plain language.
- Define important terms when they appear.
- Give concrete examples where a concept is easy to misunderstand.
- Keep the main thesis near the top.
- Include major works for thinkers when relevant.
- Separate the main explanation from relationship notes.
- Avoid fake profundity, filler, and archaic academic fog.

The ideal page answers: who or what is this, what did it argue, why did it matter, what are the key terms, what works should I know, who supported it, and who criticized it?

## Useful Commands

```bash
bun run lint              # Run ESLint
bun run validate:content  # Validate content and relations
bun run build             # Production build
bun run build:search      # Production build plus Pagefind index
bun run audit:content     # Content quality audit
bun run optimize:images   # Compress generated images
```

## Contributing

Contributions should improve clarity, coverage, relation quality, or site usability. Small focused pull requests are easier to review than large rewrites.

For content changes, prefer accurate plain-language summaries over exhaustive detail. This project is a reference map, not a replacement for primary texts or specialist scholarship.

## License

MIT. See `LICENSE`.
