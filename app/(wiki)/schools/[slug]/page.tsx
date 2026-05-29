import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { EntryHeader } from "@/components/wiki/entry-header";
import { WikiMdxContent } from "@/components/wiki/mdx-content";
import { RelationPanel } from "@/components/wiki/relation-panel";
import { getSchool, schools } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = getSchool(slug);

  if (!school) return {};

  return {
    title: school.title,
    description: school.summary,
  };
}

export default async function SchoolPage({ params }: PageProps) {
  "use cache";
  cacheLife("max");

  const { slug } = await params;
  const school = getSchool(slug);
  if (!school) notFound();

  return (
    <article>
      <EntryHeader entry={school} />
      <WikiMdxContent code={school.mdx} />
      <RelationPanel entry={school} />
    </article>
  );
}
