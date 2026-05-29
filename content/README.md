# PhiloDocs Content Guide

This is a personal wiki for philosophy and the history of thought.
It should explain hard things plainly. Plain does not mean shallow.
It means the page should be easy to read when you need a refresher.

## Goal

Every page should answer these questions fast:

- Who or what is this?
- When and where did it happen?
- What did this person, school, or work actually teach?
- What are the main theses in plain language?
- What are the famous terms or doctrines people expect to see here?
- What are the major works, and what does each one basically argue?
- What words do I need to know?
- Why does it matter?
- Who liked it, used it, criticized it, or reacted against it?

## Style

- Write like a smart friend explaining the topic clearly over coffee.
- Use short sentences.
- Use normal words first.
- Define hard words immediately.
- Do not sound impressive.
- It is fine to be casual.
- A page can get into complexity, but every complex idea needs a plain-language handle.
- Do not mention a famous technical term without explaining it immediately.
- Use concrete examples for abstract ideas.
- The reader should be able to leave the page knowing the important stuff, not just the labels.
- Never define an idea by saying it is "a key term for understanding" the page.
  That is not a definition. Define the term, explain the point, and add an
  example when the idea is abstract.
- Do not make the page mainly about relationships. The core teaching comes first.
- Relationships, influences, proponents, opponents, and critics are useful, but they belong after the main explanation.
- Relation notes are metadata. They are not a substitute for the article.
- Prefer paragraphs for the main teaching. Bullets are fine for facts, terms, works, and related pages.
- Do not use vague phrases like "normative basis" unless the page explains them in plain English.
- Do not add filler.
- Do not use sections called `Orientation`, `Historical Situation`, `Core Project`, `Misreadings And Tensions`, `Study Notes`, or `Reading Focus`.
- Use wiki links when a related thinker, school, or work exists.

## Research Standard

Use reliable sources before rewriting a page. Wikipedia is useful for basic facts,
dates, works, and overview, but it should not be the only source for major pages.
For major thinkers, schools, and works, also check sources such as the Stanford
Encyclopedia of Philosophy, Internet Encyclopedia of Philosophy, Britannica,
university pages, publisher summaries, or serious philosophy explainers.

The page does not need to cite every sentence, but the writer should understand
the object well enough to explain it cleanly. Do not pad from relationship
metadata. Do not copy Wikipedia wording. Use sources to learn, then write the
page in this wiki's voice.

For every page, produce a small private research brief before editing:

- baseline facts from Wikipedia or Britannica;
- one stronger philosophy source when available, such as SEP, IEP, a university
  page, or a serious philosophy explainer;
- the object's main problem, main answer, famous terms, major works, critics,
  and legacy.

Before finishing a page, check that it includes the expected famous doctrines.
For example, a Kant page about theoretical philosophy should not skip appearances
and things in themselves, phenomena and noumena, categories, synthetic a priori
knowledge, and causation.

## Length Targets

- `P0`: 800-1,200 words for major figures, schools, and works. Going a bit longer is fine when the topic really needs it.
- `P1`: 500-800 words.
- `P2`: 300-550 words.

Short is good when it is clear. Long is only good when it stays easy to read.

## Thinker Pages

Use these sections:

- `Quick Facts`
- `The Big Question`
- `In One Minute`
- `What They Taught`
- `Key Ideas With Examples`
- `Major Works`
- `Why It Matters`
- `Proponents, Critics, and Opponents`
- `Related Pages`

`What They Taught` is the center of the page. It should be a real summary of the thinker's teaching in plain paragraphs, not relation notes disguised as prose.

`Major Works` should not be a bare list unless the thinker is minor. Give each
important work a short synopsis in plain language: what problem it takes up,
what it argues, and why people still talk about it.

A good `What They Taught` section should usually do this:

- Start with the main thesis in normal language.
- Explain the problem the thinker was trying to solve.
- Explain the answer step by step, with enough detail to be useful later.
- Name the major work or works where the teaching appears.
- Define the important terms as they come up.
- Give examples for abstract claims.
- Include famous distinctions and doctrines people expect to find on the page.
- Save influence, proponents, opponents, and critics for the later sections unless a relationship is essential for understanding the idea.

Bad `What They Taught`:

```text
Kant answers Hume by arguing that causation is not copied from experience.
Kant inherits Rousseau's concern for freedom and dignity.
Kant reframes rationalism and empiricism.
```

Good `What They Taught`:

```text
Kant taught that the mind is not a blank camera pointed at the world. Experience already has a structure. We experience things in space and time, and we understand events through basic concepts such as cause, substance, unity, and possibility. These concepts are not optional theories we add later. They are part of what lets experience show up as an ordered world in the first place.

In the Critique of Pure Reason, Kant uses this idea to explain how mathematics and natural science can be necessary without pretending that human reason can know everything. He says we can know appearances: things as they show up under the conditions of human experience. We cannot know things in themselves, God, the soul, or the whole universe as if we were standing outside human experience.
```

## School Pages

Use these sections:

- `Quick Facts`
- `In One Minute`
- `Main Ideas`
- `How It Works`
- `Key People`
- `Important Works`
- `Why It Matters`
- `Critics And Pushback`
- `Related Pages`

`Main Ideas` and `How It Works` should explain the school itself before listing who influenced it or reacted against it.

`Important Works` should contain real works with short synopses when the school
has canonical texts or representative books. Do not write "No important works
listed yet" on major school pages.

## Work Pages

Use these sections:

- `Quick Facts`
- `In One Minute`
- `The Problem`
- `The Main Argument`
- `Key Ideas With Examples`
- `Why It Matters`
- `Common Confusions`
- `People And Schools`
- `Critics And Reactions`
- `Related Pages`

`The Main Argument` should summarize the argument of the work directly. Do not
reduce a work page to who it influenced.

A work page should explain the text as a text. It should answer:

- What problem is the author trying to solve?
- What is the main claim?
- What are the big terms, and what do they mean?
- What examples make the idea easier to understand?
- What changed because this work existed?

Every major concept should follow this pattern:

```text
Concept -> plain definition -> concrete example -> why it matters
```

Bad:

```text
The Critique makes causality a condition of objective experience.
```

Good:

```text
Kant thinks cause and effect are not just copied from what our eyes see. If one
billiard ball hits another and the second ball moves, your senses show one event
after another. They do not literally show a necessary connection. Kant says the
mind supplies causation as a rule, so we can experience the scene as one event
causing another instead of two disconnected flashes.
```

## Relations

Relations are typed edges in frontmatter. Keep using `relations`.
Do not bring back old fields such as `influenced_by`, `influenced`,
`related`, `works`, `key_thinkers`, `parent_schools`, `related_thinkers`,
or `author`.

Relation notes should be concrete and plain.

Good:

```text
Kant responds to Hume by saying cause and effect are not just habits. Kant thinks the mind needs causation to organize experience.
```

Bad:

```text
Kant develops a transcendental account of the conditions of objective cognition.
```
