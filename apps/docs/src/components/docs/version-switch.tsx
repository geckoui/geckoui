"use client";

import { VERSIONS, hrefForVersion, slugFromPathname, versionFromPathname } from "@/lib/versions";
import { Popover, PopoverContent, PopoverTrigger } from "@geckoui/geckoui";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface VersionSwitchProps {
  slugsByVersion: Record<string, string[]>;
}

export function VersionSwitch({ slugsByVersion }: VersionSwitchProps) {
  const pathname = usePathname();
  const current = versionFromPathname(pathname);
  const slug = slugFromPathname(pathname);

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <button
          type="button"
          aria-label={`Documentation version: ${current.label}`}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-2.5 text-sm font-medium transition-colors hover:bg-accent">
          {current.label}
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-36 p-1">
          {VERSIONS.map((v) => (
            <Link
              key={v.id}
              href={hrefForVersion(v, slug, slugsByVersion[v.id])}
              aria-current={v.id === current.id ? "page" : undefined}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">
              <Check className={v.id === current.id ? "size-3.5" : "size-3.5 opacity-0"} />
              <span className="flex-1">{v.label}</span>
              {v.latest && <span className="text-xs opacity-60">Latest</span>}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
