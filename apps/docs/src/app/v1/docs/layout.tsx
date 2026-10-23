import { DocsShell } from "@/components/docs/shell";
import { slugsByVersion, sourceV1 } from "@/lib/source";
import type { Node, Root } from "fumadocs-core/page-tree";

const llmSection: Node[] = [
  { type: "separator", name: "For LLMs" },
  { type: "page", name: "Docs list", url: "/v1/llms.txt", external: true },
  { type: "page", name: "Full docs", url: "/v1/llms-full.txt", external: true }
];

export default function Layout({ children }: LayoutProps<"/v1/docs">) {
  const tree: Root = {
    ...sourceV1.pageTree,
    children: [...sourceV1.pageTree.children, ...llmSection]
  };

  return (
    <DocsShell tree={tree} slugsByVersion={slugsByVersion()}>
      {children}
    </DocsShell>
  );
}
