"use client";

import { classNames } from "@/lib/classNames";
import { Check, Copy, FileCode2 } from "lucide-react";
import { type ComponentProps, useRef, useState } from "react";

export function CodeBlock({ title, children, ...props }: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(ref.current?.textContent ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <figure className="gk-code relative my-6 overflow-hidden rounded-xl border border-border bg-code">
      {title && (
        <figcaption className="flex h-10 items-center gap-2 border-b border-border px-4 font-mono text-xs text-muted-foreground">
          <FileCode2 className="size-3.5" />
          {title}
        </figcaption>
      )}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={classNames(
          "absolute right-2 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          title ? "top-1.5" : "top-2"
        )}>
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      <pre ref={ref} {...props}>
        {children}
      </pre>
    </figure>
  );
}
