"use client";

import { classNames } from "@/lib/classNames";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function InstallCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${command}`}
      className={classNames(
        "inline-flex h-10 items-center gap-3 rounded-lg border border-border bg-muted/40 pr-2.5 pl-4 font-mono text-sm transition-colors hover:bg-accent",
        className
      )}>
      <span className="text-muted-foreground">$</span>
      <span>{command}</span>
      <span className="inline-flex size-6 items-center justify-center text-muted-foreground">
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </span>
    </button>
  );
}
