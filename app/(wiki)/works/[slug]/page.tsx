import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { EntryHeader } from "@/components/wiki/entry-header";
import { WikiMdxContent } from "@/components/wiki/mdx-content";
import { RelationPanel } from "@/components/wiki/relation-panel";
import { getWork, works } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);

  if (!work) return {};

  return {
    title: work.title,
    description: work.summary,
  };
}

export default async function WorkPage({ params }: PageProps) {
  "use cache";
  cacheLife("max");

  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  return (
    <article>
      <EntryHeader entry={work} />
      <WikiMdxContent code={work.mdx} />
      <RelationPanel entry={work} />
    </article>
  );
}
