import { z } from "zod";

export const nodeKindSchema = z.enum(["thinker", "school", "work", "concept"]);

export const relationKindSchema = z.enum([
  "inherits",
  "develops",
  "reacts_to",
  "criticizes",
  "opposes",
  "reframes",
  "synthesizes",
  "revives",
  "radicalizes",
  "applies",
  "influences",
  "contrasts",
  "secularizes",
  "associated_with",
  "authored",
  "authored_by",
  "belongs_to",
  "exemplified_by",
  "central_to",
  "comments_on",
]);

export const relationStanceSchema = z.enum([
  "supportive",
  "critical",
  "oppositional",
  "mixed",
  "neutral",
]);

export const domainSchema = z.enum([
  "metaphysics",
  "epistemology",
  "ethics",
  "politics",
  "religion",
  "science",
  "aesthetics",
  "logic",
  "psychology",
  "language",
  "history",
  "social-theory",
  "economics",
  "technology",
]);

export const relationConfidenceSchema = z.enum(["high", "medium", "low"]);

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const relationSchema = z.object({
  target: slug,
  target_kind: nodeKindSchema,
  type: relationKindSchema,
  stance: relationStanceSchema.default("neutral"),
  weight: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  domains: z.array(domainSchema).default([]),
  concepts: z.array(z.string().min(1)).default([]),
  via: z.array(slug).default([]),
  confidence: relationConfidenceSchema.default("medium"),
  note: z.string().min(1),
});

export const relationsSchema = z.array(relationSchema).default([]);

export type NodeKind = z.infer<typeof nodeKindSchema>;
export type RelationKind = z.infer<typeof relationKindSchema>;
export type RelationStance = z.infer<typeof relationStanceSchema>;
export type Domain = z.infer<typeof domainSchema>;
export type RelationConfidence = z.infer<typeof relationConfidenceSchema>;
export type Relation = z.infer<typeof relationSchema>;

export const relationTypeLabels: Record<RelationKind, string> = {
  inherits: "inherits",
  develops: "develops",
  reacts_to: "reacts to",
  criticizes: "criticizes",
  opposes: "opposes",
  reframes: "reframes",
  synthesizes: "synthesizes",
  revives: "revives",
  radicalizes: "radicalizes",
  applies: "applies",
  influences: "influences",
  contrasts: "contrasts",
  secularizes: "secularizes",
  associated_with: "associated with",
  authored: "authored",
  authored_by: "authored by",
  belongs_to: "belongs to",
  exemplified_by: "exemplified by",
  central_to: "central to",
  comments_on: "comments on",
};

export const relationStanceLabels: Record<RelationStance, string> = {
  supportive: "supportive",
  critical: "critical",
  oppositional: "oppositional",
  mixed: "mixed",
  neutral: "neutral",
};
