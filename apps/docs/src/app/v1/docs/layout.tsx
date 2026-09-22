import { VersionSelect } from "@/components/version-select";
import { baseOptions } from "@/lib/layout.shared";
import { sourceV1 } from "@/lib/source";
import type { Node, Root } from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

const llmSection: Node[] = [
  { type: "separator", name: "LLM" },
  { type: "page", name: "Docs List", url: "/v1/llms.txt", external: true },
  { type: "page", name: "Full Docs", url: "/v1/llms-full.txt", external: true }
];

export default function Layout({ children }: LayoutProps<"/v1/docs">) {
  const tree: Root = {
    ...sourceV1.pageTree,
    children: [...sourceV1.pageTree.children, ...llmSection]
  };

  return (
    <DocsLayout tree={tree} sidebar={{ banner: <VersionSelect /> }} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
