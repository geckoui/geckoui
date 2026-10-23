import { classNames } from "@/lib/classNames";
import Link from "next/link";
import type { ReactNode } from "react";

interface PagerLink {
  name: ReactNode;
  url: string;
}

export interface PagerProps {
  previous?: PagerLink;
  next?: PagerLink;
}

function PagerCard({
  link,
  label,
  align
}: {
  link: PagerLink;
  label: string;
  align: "left" | "right";
}) {
  return (
    <Link
      href={link.url}
      className={classNames(
        "flex flex-col gap-0.5 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-accent",
        align === "right" && "items-end text-right sm:col-start-2"
      )}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{link.name}</span>
    </Link>
  );
}

export function Pager({ previous, next }: PagerProps) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="Previous and next page" className="mt-6 grid gap-3 sm:grid-cols-2">
      {previous && <PagerCard link={previous} label="Previous" align="left" />}
      {next && <PagerCard link={next} label="Next" align="right" />}
    </nav>
  );
}
