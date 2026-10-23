import { getMDXComponents } from "@/components/docs/mdx";
import { DocsPage } from "@/components/docs/page";
import { VersionNotice } from "@/components/docs/version-notice";
import { sourceV1 } from "@/lib/source";
import { findNeighbour } from "fumadocs-core/page-tree";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/v1/docs/[[...slug]]">) {
  const params = await props.params;
  const page = sourceV1.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const { previous, next } = findNeighbour(sourceV1.pageTree, page.url);

  return (
    <DocsPage
      title={page.data.title}
      description={page.data.description}
      toc={page.data.toc}
      previous={previous}
      next={next}>
      <VersionNotice slugs={page.slugs} />
      <MDX components={getMDXComponents()} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return sourceV1.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/v1/docs/[[...slug]]">
): Promise<Metadata> {
  const params = await props.params;
  const page = sourceV1.getPage(params.slug);
  if (!page) notFound();

  return {
    title: `${page.data.title} (v1)`,
    description: page.data.description,
    robots: { index: false, follow: true }
  };
}
