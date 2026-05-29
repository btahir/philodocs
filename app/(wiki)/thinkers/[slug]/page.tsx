import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { EntryHeader } from "@/components/wiki/entry-header";
import { WikiMdxContent } from "@/components/wiki/mdx-content";
import { RelationPanel } from "@/components/wiki/relation-panel";
import { getThinker, thinkers } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return thinkers.map((thinker) => ({ slug: thinker.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const thinker = getThinker(slug);

  if (!thinker) return {};

  return {
    title: thinker.title,
    description: thinker.summary,
  };
}

export default async function ThinkerPage({ params }: PageProps) {
  "use cache";
  cacheLife("max");

  const { slug } = await params;
  const thinker = getThinker(slug);
  if (!thinker) notFound();

  return (
    <article>
      <EntryHeader entry={thinker} />
      <WikiMdxContent code={thinker.mdx} />
      <RelationPanel entry={thinker} />
    </article>
  );
}
