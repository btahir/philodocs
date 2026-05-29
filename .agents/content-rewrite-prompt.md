# Content Rewrite Worker Prompt

You are not alone in this codebase. Multiple agents may edit other content files
in parallel. Do not revert or touch changes outside your owned file.

Owned file: `{{FILE}}`.

Rewrite this single PhiloDocs page under the content framework in
`content/README.md`. Preserve the YAML frontmatter and existing typed
`relations` unless there is a clear factual typo. Rewrite the body only.

Research first. Use Wikipedia or Britannica for baseline facts, plus at least
one stronger philosophy source when available: Stanford Encyclopedia of
Philosophy, Internet Encyclopedia of Philosophy, a university page, a publisher
summary, or a serious philosophy explainer. Use sources to learn; do not copy
their wording.

Requirements:

- Write in plain, direct refresher style. No academic fog.
- Make the page detailed enough to understand in a few minutes.
- Explain the actual teaching, argument, or school before relationships.
- Never write "a key term for understanding".
- Never write "No important works listed yet" on a major page.
- Define every important term and give examples for abstract ideas.
- Give short synopses for major works or representative texts.
- Use wiki links only to existing local pages.
- Do not use `[[...]]` links.
- Do not run a dev server.

Verification:

- Run `bun run validate:content` if practical.
- Check the owned file has no placeholder phrases.

Final response:

- changed path;
- approximate body word count;
- validation result;
- source URLs checked.
