import { buildLlmsIndex } from "@/lib/llms";
import { source } from "@/lib/source";
import { LATEST, VERSIONS } from "@/lib/versions";

export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geckoui.dev";

export async function GET() {
  const older = VERSIONS.filter((v) => !v.latest);

  const content = buildLlmsIndex({
    tree: source.pageTree,
    siteUrl,
    title: `Gecko UI ${LATEST.label}`,
    intro: [
      "> Gecko UI is a production-ready React component library built with TypeScript and Tailwind CSS.",
      "> It provides 40+ accessible components with react-hook-form built into every field, styled by",
      "> plain CSS custom properties you can override without a theme provider or a build step.",
      "",
      "## Docs",
      "",
      `- [Full Docs](${siteUrl}/llms-full.txt): Full text of every page in ${LATEST.label}.`,
      ...older.map(
        (v) =>
          `- [${v.label} Docs](${siteUrl}${v.basePath.replace(/\/docs$/, "")}/llms.txt): Superseded ${v.label} documentation.`
      )
    ]
  });

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
