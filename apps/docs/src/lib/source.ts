import { docs, docsV1 } from "@/.source";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()]
});

export const sourceV1 = loader({
  baseUrl: "/v1/docs",
  source: docsV1.toFumadocsSource(),
  plugins: [lucideIconsPlugin()]
});

export const LATEST_VERSION = "v2";

export const versions = [
  { name: "v2 (latest)", url: "/docs" },
  { name: "v1", url: "/v1/docs" }
];

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`
  };
}

export type AnyDocsPage = InferPageType<typeof source> | InferPageType<typeof sourceV1>;

export async function getLLMText(page: AnyDocsPage) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
