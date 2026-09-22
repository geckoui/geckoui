"use client";

import { VERSIONS, hrefForVersion, slugFromPathname, versionFromPathname } from "@/lib/versions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface VersionSwitchProps {
  /** version id -> slugs it contains, so switching keeps you on the same page */
  slugsByVersion: Record<string, string[]>;
}

export function VersionSwitch({ slugsByVersion }: VersionSwitchProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = versionFromPathname(pathname);
  const slug = slugFromPathname(pathname);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    // On desktop the sidebar header leaves a gap between the title and the collapse
    // button; sit in it. On mobile the header is laid out differently, so stay in flow.
    <div ref={ref} className="relative w-fit md:absolute md:right-14 md:top-4 md:z-20">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Documentation version: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-fd-border px-2 py-1 text-xs font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground">
        {current.label}
        <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
          <path
            d="M2 4l3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-28 overflow-hidden rounded-md border border-fd-border bg-fd-popover p-1 shadow-lg">
          {VERSIONS.map((v) => {
            const active = v.id === current.id;

            return (
              <Link
                key={v.id}
                role="menuitem"
                href={hrefForVersion(v, slug, slugsByVersion[v.id])}
                className={`flex items-center justify-between gap-2 rounded px-2 py-1 text-xs ${
                  active
                    ? "bg-fd-accent font-semibold text-fd-accent-foreground"
                    : "text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-foreground"
                }`}>
                <span>{v.label}</span>
                {v.latest && <span className="text-[10px] uppercase opacity-60">latest</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
