import { siteUrl } from "@/lib/site";
import { source } from "@/lib/source";
import type { MetadataRoute } from "next";

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap[number] = {
    url: `${siteUrl}/`,
    changeFrequency: "weekly",
    priority: 1
  };

  const docs: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${siteUrl}${page.url}`,
    changeFrequency: "weekly",
    priority: page.url === "/docs" ? 0.9 : 0.8
  }));

  return [home, ...docs];
}
