import { SiteHeader } from "@/components/site/site-header";
import type * as PageTree from "fumadocs-core/page-tree";
import type { ReactNode } from "react";

import { Sidebar } from "./sidebar";

export interface DocsShellProps {
  tree: PageTree.Root;
  slugsByVersion: Record<string, string[]>;
  children: ReactNode;
}

export function DocsShell({ tree, slugsByVersion, children }: DocsShellProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader tree={tree} slugsByVersion={slugsByVersion} />
      <div className="mx-auto flex max-w-[96rem] px-4 md:px-8">
        <aside className="gk-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto py-6 pr-4 lg:block">
          <Sidebar tree={tree} />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
