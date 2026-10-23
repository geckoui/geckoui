import { classNames } from "@/lib/classNames";
import type { ReactNode } from "react";

export interface PreviewProps {
  children: ReactNode;
  className?: string;
}

export function Preview({ children, className }: PreviewProps) {
  return (
    <div className="gk-preview not-prose my-6 rounded-xl border border-border">
      <div className="flex min-h-40 items-center p-6 sm:p-10">
        <div className={classNames("w-full", className)}>{children}</div>
      </div>
    </div>
  );
}
