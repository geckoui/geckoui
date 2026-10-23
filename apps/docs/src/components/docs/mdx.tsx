import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";

import { CodeBlock } from "./code-block";
import { heading } from "./heading";
import { Preview } from "./preview";

function Anchor({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;

  return <a href={href} target="_blank" rel="noreferrer" {...props} />;
}

function Table(props: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table {...props} />
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    a: Anchor,
    pre: CodeBlock,
    table: Table,
    Preview,
    ...components
  };
}
