import type { TableOfContents } from "fumadocs-core/toc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Pager, type PagerProps } from "./pager";
import { Toc } from "./toc";

export interface DocsPageProps extends PagerProps {
  title: string;
  description?: string;
  toc: TableOfContents;
  githubPath?: string;
  children: ReactNode;
}

const iconLink =
  "inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

export function DocsPage({
  title,
  description,
  toc,
  githubPath,
  previous,
  next,
  children
}: DocsPageProps) {
  return (
    <div className="flex gap-12">
      <main className="min-w-0 flex-1 py-8 lg:py-10">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <div className="flex shrink-0 gap-1.5 pt-1">
              {previous && (
                <Link
                  href={previous.url}
                  aria-label={`Previous: ${previous.name}`}
                  className={iconLink}>
                  <ChevronLeft className="size-4" />
                </Link>
              )}
              {next && (
                <Link href={next.url} aria-label={`Next: ${next.name}`} className={iconLink}>
                  <ChevronRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
          {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}

          <div className="gk-prose mt-8">{children}</div>

          <div className="mt-14 border-t border-border pt-6">
            {githubPath && (
              <a
                href={`https://github.com/geckoui/geckoui/blob/develop/apps/docs/${githubPath}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Edit this page on GitHub
              </a>
            )}
            <Pager previous={previous} next={next} />
          </div>
        </div>
      </main>
      <aside className="gk-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-10 xl:block">
        <Toc toc={toc} />
      </aside>
    </div>
  );
}
