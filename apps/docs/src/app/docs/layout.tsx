import { DocsShell } from "@/components/docs/shell";
import { slugsByVersion, source } from "@/lib/source";
import type { Node, Root } from "fumadocs-core/page-tree";

const llmSection: Node[] = [
  { type: "separator", name: "For LLMs" },
  { type: "page", name: "Docs list", url: "/llms.txt", external: true },
  { type: "page", name: "Full docs", url: "/llms-full.txt", external: true }
];

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree: Root = { ...source.pageTree, children: [...source.pageTree.children, ...llmSection] };

  return (
    <DocsShell tree={tree} slugsByVersion={slugsByVersion()}>
      {children}
    </DocsShell>
  );
}
