import { VersionNotice } from "@/components/version-notice";
import { sourceV1 } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/v1/docs/[[...slug]]">) {
  const params = await props.params;
  const page = sourceV1.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <VersionNotice slugs={page.slugs} />
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(sourceV1, page)
          })}
        />
      </DocsBody>
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
