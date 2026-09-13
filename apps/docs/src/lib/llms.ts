import type * as PageTree from "fumadocs-core/page-tree";

export interface LlmsIndexOptions {
  tree: PageTree.Root;
  siteUrl: string;
  title: string;
  /** Lines placed under the title, before the sections. */
  intro: string[];
}

function renderNodes(nodes: PageTree.Node[], siteUrl: string, depth = 0): string[] {
  const lines: string[] = [];

  for (const node of nodes) {
    if (node.type === "separator") {
      lines.push("", `### ${node.name}`);
      continue;
    }

    if (node.type === "folder") {
      lines.push("", `### ${node.name}`);
      if (node.index) lines.push(renderPage(node.index, siteUrl));
      lines.push(...renderNodes(node.children, siteUrl, depth + 1));
      continue;
    }

    lines.push(renderPage(node, siteUrl));
  }

  return lines;
}

function renderPage(page: PageTree.Item, siteUrl: string): string {
  const description = page.description ? `: ${page.description}` : "";
  return `- [${page.name}](${siteUrl}${page.url})${description}`;
}

/**
 * Built from the page tree rather than hand-written, so the index cannot drift
 * from the pages that actually exist, and every link resolves to this version.
 */
export function buildLlmsIndex({ tree, siteUrl, title, intro }: LlmsIndexOptions): string {
  const body = renderNodes(tree.children, siteUrl).join("\n").replace(/^\n+/, "");

  return [`# ${title}`, "", ...intro, "", "## Components", "", body, ""].join("\n");
}
