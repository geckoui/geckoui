"use client";

import { classNames } from "@/lib/classNames";
import { AnchorProvider, TOCItem, type TableOfContents, useActiveAnchor } from "fumadocs-core/toc";

function Items({ toc }: { toc: TableOfContents }) {
  const active = useActiveAnchor();

  return (
    <ul className="space-y-2 text-[13px]">
      {toc.map((item) => (
        <li key={item.url} style={{ paddingLeft: `${(item.depth - 2) * 0.75}rem` }}>
          <TOCItem
            href={item.url}
            className={classNames(
              "block transition-colors hover:text-foreground",
              active === item.url.slice(1) ? "font-medium text-foreground" : "text-muted-foreground"
            )}>
            {item.title}
          </TOCItem>
        </li>
      ))}
    </ul>
  );
}

export function Toc({ toc: all }: { toc: TableOfContents }) {
  const toc = all.filter((item) => item.depth >= 2);
  if (toc.length === 0) return null;

  return (
    <AnchorProvider toc={toc} single>
      <p className="mb-3 text-sm font-medium">On this page</p>
      <Items toc={toc} />
    </AnchorProvider>
  );
}
