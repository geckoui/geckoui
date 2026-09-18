import { source } from "@/lib/source";
import { LATEST } from "@/lib/versions";
import Link from "next/link";

export function VersionNotice({ slugs }: { slugs: string[] }) {
  const samePage = source.getPage(slugs);
  const href = samePage ? samePage.url : LATEST.basePath;

  return (
    <div className="not-prose mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
      <p className="m-0">
        You are reading the <strong>v1</strong> docs. {LATEST.label} renamed several props and
        replaced <code>GeckoUIPortal</code> with <code>GeckoUIProvider</code>.{" "}
        <Link href={href} className="font-medium underline">
          {samePage ? `Read this page in ${LATEST.label}` : `Go to the ${LATEST.label} docs`}
        </Link>
        .
      </p>
      <p className="m-0 mt-1 text-fd-muted-foreground">
        Live examples are only rendered in the {LATEST.label} docs.
      </p>
    </div>
  );
}
