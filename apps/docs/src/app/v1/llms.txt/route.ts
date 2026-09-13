import { buildLlmsIndex } from "@/lib/llms";
import { sourceV1 } from "@/lib/source";
import { LATEST } from "@/lib/versions";

export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geckoui.dev";

export async function GET() {
  const content = buildLlmsIndex({
    tree: sourceV1.pageTree,
    siteUrl,
    title: "Gecko UI v1",
    intro: [
      "> Documentation for Gecko UI v1, a React component library built with TypeScript and Tailwind CSS.",
      `> This version is superseded by ${LATEST.label} and is kept for projects that have not migrated.`,
      "",
      "## Docs",
      "",
      `- [Full v1 Docs](${siteUrl}/v1/llms-full.txt): Full text of every v1 page.`,
      `- [Current Docs](${siteUrl}/llms.txt): ${LATEST.label}, the supported version.`
    ]
  });

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
