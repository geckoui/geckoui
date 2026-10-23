import { getPageImage, source } from "@/lib/source";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#faf8f3",
          color: "#1c1917"
        }}>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#78716c" }}>
          GeckoUI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
            {page.data.title}
          </div>
          {page.data.description && (
            <div style={{ fontSize: 34, color: "#78716c", lineHeight: 1.35 }}>
              {page.data.description}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: getPageImage(page).segments }));
}
