import { getMDXComponents } from "@/components/docs/mdx";
import { DocsPage } from "@/components/docs/page";
import { getPageImage, source } from "@/lib/source";
import { findNeighbour } from "fumadocs-core/page-tree";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const { previous, next } = findNeighbour(source.pageTree, page.url);

  return (
    <DocsPage
      title={page.data.title}
      description={page.data.description}
      toc={page.data.toc}
      githubPath={`content/docs/${page.path}`}
      previous={previous}
      next={next}>
      <MDX components={getMDXComponents()} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      images: getPageImage(page).url
    }
  };
}
