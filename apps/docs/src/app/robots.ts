import { siteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
