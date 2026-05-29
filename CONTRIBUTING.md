# Contributing to PhiloDocs

PhiloDocs is an open-source philosophy wiki built around clarity, typed content, and relationship maps.

## Content Standards

- Start with the basic identity: who or what the page is about, where it belongs, and why it matters.
- Explain the main ideas in plain language before discussing influence or relations.
- Define technical terms in the body. Do not list terms without explaining them.
- Use examples when a concept is abstract.
- Keep relation notes useful and specific. Avoid generic lines like "X influenced Y" without saying how.
- Link related thinkers, schools, and works when the link helps the reader.
- Do not pad pages with academic-sounding filler.

## Relation Data

Relations live in frontmatter and are validated by Zod. Use relation types such as `inherits`, `reacts_to`, `criticizes`, `opposes`, `reframes`, `influences`, `authored`, and `central_to` only when the connection is useful for navigation or interpretation.

Every relation should have a short note that explains the connection in human language.

## Checks

Before opening a pull request, run:

```bash
bun run lint
bun run validate:content
bun run build
```

If you changed generated images, also run:

```bash
bun run optimize:images
```
