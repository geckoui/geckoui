"use client";

import { SearchButton } from "@/components/docs/search";
import { Sidebar } from "@/components/docs/sidebar";
import { VersionSwitch } from "@/components/docs/version-switch";
import { classNames } from "@/lib/classNames";
import { versionFromPathname } from "@/lib/versions";
import { Drawer } from "@geckoui/geckoui";
import type * as PageTree from "fumadocs-core/page-tree";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { GitHubIcon } from "./github-icon";
import { ThemeToggle } from "./theme-toggle";

export const GITHUB_URL = "https://github.com/geckoui/geckoui";

const GUIDES = ["/docs", "/docs/installation", "/docs/migrating-to-v2", "/docs/gecko-ui-provider"];

const NAV = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/accordion", label: "Components" },
  { href: "/docs/theming", label: "Theming" }
];

function activeNavFor(pathname: string) {
  if (pathname === "/docs/theming") return "/docs/theming";
  if (GUIDES.includes(pathname)) return "/docs";
  if (pathname.startsWith("/docs/")) return "/docs/accordion";
  return undefined;
}

export interface SiteHeaderProps {
  tree?: PageTree.Root;
  slugsByVersion?: Record<string, string[]>;
}

export function SiteHeader({ tree, slugsByVersion }: SiteHeaderProps) {
  const pathname = usePathname();
  const version = versionFromPathname(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeNav = activeNavFor(pathname);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border">
        <div aria-hidden className="absolute inset-0 -z-10 bg-background/85 backdrop-blur-md" />
        <div className="mx-auto flex h-14 max-w-[96rem] items-center gap-4 px-4 md:px-8">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden">
            <Menu className="size-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt=""
              width={22}
              height={22}
              className="dark:invert dark:hue-rotate-180"
            />
            <span className="font-semibold tracking-tight">GeckoUI</span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "transition-colors hover:text-foreground",
                  activeNav === item.href ? "text-foreground" : "text-muted-foreground"
                )}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <SearchButton version={version} />
            {slugsByVersion && <VersionSwitch slugsByVersion={slugsByVersion} />}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GeckoUI on GitHub"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
              <GitHubIcon className="size-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        placement="left"
        allowClickOutside
        dismissOnEscape
        className="gk-scroll w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-background p-4 text-foreground">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt=""
              width={22}
              height={22}
              className="dark:invert dark:hue-rotate-180"
            />
            <span className="font-semibold tracking-tight">GeckoUI</span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
        {tree ? (
          <Sidebar tree={tree} />
        ) : (
          <nav className="flex flex-col gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-1.5 hover:bg-accent">
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </Drawer>
    </>
  );
}
