import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import type { Node, Root } from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

const llmSection: Node[] = [
  { type: "separator", name: "LLM" },
  { type: "page", name: "Docs List", url: "/llms.txt", external: true },
  { type: "page", name: "Full Docs", url: "/llms-full.txt", external: true }
];

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree: Root = {
    ...source.pageTree,
    children: [...source.pageTree.children, ...llmSection]
  };

  return (
    <DocsLayout tree={tree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
