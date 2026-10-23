"use client";

import { classNames } from "@/lib/classNames";
import type * as PageTree from "fumadocs-core/page-tree";
import Link from "next/link";
import { usePathname } from "next/navigation";

function PageLink({ item }: { item: PageTree.Item }) {
  const active = usePathname() === item.url;

  return (
    <Link
      href={item.url}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      aria-current={active ? "page" : undefined}
      className={classNames(
        "flex h-8 items-center rounded-md px-2 text-sm transition-colors",
        active
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
      )}>
      {item.name}
    </Link>
  );
}

function Nodes({ nodes }: { nodes: PageTree.Node[] }) {
  return nodes.map((node, i) => {
    if (node.type === "separator") {
      return (
        <h4 key={`sep-${i}`} className="mt-6 mb-1 px-2 text-xs font-medium text-foreground">
          {node.name}
        </h4>
      );
    }

    if (node.type === "folder") {
      return (
        <div key={`folder-${i}`}>
          {node.index ? (
            <PageLink item={{ ...node.index, name: node.name }} />
          ) : (
            <span className="flex h-8 items-center px-2 text-sm font-medium">{node.name}</span>
          )}
          <div className="ml-3 border-l border-border pl-2">
            <Nodes nodes={node.children} />
          </div>
        </div>
      );
    }

    return <PageLink key={node.url} item={node} />;
  });
}

export function Sidebar({ tree }: { tree: PageTree.Root }) {
  return (
    <nav aria-label="Docs" className="pb-10">
      <Nodes nodes={tree.children} />
    </nav>
  );
}
