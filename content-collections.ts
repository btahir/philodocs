import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX, type Options } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { relationsSchema } from "./lib/relations";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const status = z.enum(["stub", "draft", "reviewed"]).default("stub");
const priority = z.enum(["P0", "P1", "P2"]).default("P1");
const tags = z.array(z.string().min(1)).default([]);

const mdxOptions: Options = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    [
      rehypeShiki,
      {
        theme: "github-light",
        addLanguageClass: true,
        fallbackLanguage: "text",
      },
    ],
  ],
};

const thinkers = defineCollection({
  name: "thinkers",
  directory: "content/thinkers",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    slug,
    status,
    priority,
    summary: z.string(),
    period: z.string(),
    region: z.string(),
    birth_year: z.number().int().nullable().default(null),
    death_year: z.number().int().nullable().default(null),
    traditions: tags,
    relations: relationsSchema,
    last_updated: z.string().optional(),
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    kind: "thinker" as const,
    url: `/thinkers/${doc.slug}`,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

const schools = defineCollection({
  name: "schools",
  directory: "content/schools",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    slug,
    status,
    priority,
    summary: z.string(),
    period: z.string(),
    region: z.string(),
    traditions: tags,
    relations: relationsSchema,
    last_updated: z.string().optional(),
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    kind: "school" as const,
    url: `/schools/${doc.slug}`,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

const works = defineCollection({
  name: "works",
  directory: "content/works",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    slug,
    status,
    priority,
    summary: z.string(),
    year: z.number().int().nullable().default(null),
    traditions: tags,
    relations: relationsSchema,
    last_updated: z.string().optional(),
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    kind: "work" as const,
    url: `/works/${doc.slug}`,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

const timelines = defineCollection({
  name: "timelines",
  directory: "content/history-of-thought",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    slug,
    description: z.string(),
    status: z.enum(["seed", "draft", "reviewed"]).default("seed"),
    last_updated: z.string(),
    content: z.string(),
  }),
  transform: async (doc, context) => ({
    ...doc,
    kind: "timeline" as const,
    url: `/timeline`,
    mdx: await compileMDX(context, doc, mdxOptions),
  }),
});

export default defineConfig({
  content: [thinkers, schools, works, timelines],
});
