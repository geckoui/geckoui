"use client";

import { Breadcrumb, BreadcrumbItem } from "@geckoui/geckoui";
import { type AnchorHTMLAttributes, type ReactNode, useState } from "react";

/*
 * Stands in for next/link so the previews behave like a router without leaving the page.
 * In your own app this is your real Link.
 */
function Link({
  children,
  onClick,
  ...rest
}: { children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}>
      {children}
    </a>
  );
}

const DEEP = [
  ["/", "Home"],
  ["/library", "Library"],
  ["/library/data", "Data"],
  ["/library/data/2026", "2026"],
  ["/library/data/2026/q3", "Q3"],
  [undefined, "September"]
] as const;

export function BreadcrumbBasicExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem asChild>
        <Link href="/">Home</Link>
      </BreadcrumbItem>
      <BreadcrumbItem asChild>
        <Link href="/settings">Settings</Link>
      </BreadcrumbItem>
      <BreadcrumbItem>Profile</BreadcrumbItem>
    </Breadcrumb>
  );
}

export function BreadcrumbRouterExample() {
  const [path, setPath] = useState("/library/data");

  return (
    <div className="space-y-3">
      <Breadcrumb>
        {DEEP.slice(0, 3).map(([href, label]) => (
          <BreadcrumbItem key={label} asChild>
            <Link href={href} onClick={() => setPath(href ?? "/")}>
              {label}
            </Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <p className="text-text-tertiary text-sm">
        Went to <code>{path}</code> without a reload.
      </p>
    </div>
  );
}

export function BreadcrumbCollapsedExample() {
  return (
    <div className="space-y-3">
      <Breadcrumb maxItems={3}>
        {DEEP.map(([href, label]) => (
          <BreadcrumbItem key={label} asChild={Boolean(href)}>
            {href ? <Link href={href}>{label}</Link> : label}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <Breadcrumb maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2}>
        {DEEP.map(([href, label]) => (
          <BreadcrumbItem key={label} asChild={Boolean(href)}>
            {href ? <Link href={href}>{label}</Link> : label}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  );
}

export function BreadcrumbSeparatorExample() {
  return (
    <div className="space-y-3">
      <Breadcrumb separator="/">
        <BreadcrumbItem asChild>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem asChild>
          <Link href="/docs">Docs</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
      </Breadcrumb>

      <Breadcrumb separator={<span className="text-xs">•</span>}>
        <BreadcrumbItem asChild>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem asChild>
          <Link href="/docs">Docs</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

export function BreadcrumbIconsExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem asChild>
        <Link href="/">🏠 Home</Link>
      </BreadcrumbItem>
      <BreadcrumbItem asChild>
        <Link href="/settings">⚙️ Settings</Link>
      </BreadcrumbItem>
      <BreadcrumbItem>Profile</BreadcrumbItem>
    </Breadcrumb>
  );
}

export function BreadcrumbCurrentExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem asChild>
        <Link href="/">Home</Link>
      </BreadcrumbItem>
      <BreadcrumbItem current>Settings</BreadcrumbItem>
      <BreadcrumbItem asChild>
        <Link href="/settings/profile">Profile</Link>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

export function BreadcrumbButtonExample() {
  const [path, setPath] = useState("/library");

  return (
    <div className="space-y-3">
      <Breadcrumb>
        <BreadcrumbItem onClick={() => setPath("/")}>Home</BreadcrumbItem>
        <BreadcrumbItem onClick={() => setPath("/library")}>Library</BreadcrumbItem>
        <BreadcrumbItem>Data</BreadcrumbItem>
      </Breadcrumb>

      <p className="text-text-tertiary text-sm">
        Went to <code>{path}</code>.
      </p>
    </div>
  );
}

export function BreadcrumbSizesExample() {
  return (
    <div className="space-y-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Breadcrumb key={size} size={size}>
          <BreadcrumbItem asChild>
            <Link href="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem asChild>
            <Link href="/docs">Docs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{size}</BreadcrumbItem>
        </Breadcrumb>
      ))}
    </div>
  );
}
