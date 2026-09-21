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

/*
 * Where a click landed. Styled as a readout rather than as text, so it does not read as
 * another crumb.
 */
function useFakeRouter(start = "") {
  const [path, go] = useState(start);

  const went = (
    <div
      className="flex w-fit items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs"
      style={{
        background: "var(--color-surface-secondary)",
        borderColor: "var(--color-border-primary)"
      }}>
      <span
        className="text-[10px] tracking-widest uppercase"
        style={{ color: "var(--color-text-placeholder)" }}>
        route
      </span>

      {path ? (
        <span style={{ color: "var(--color-primary-600)" }}>{path}</span>
      ) : (
        <span style={{ color: "var(--color-text-placeholder)" }}>click a crumb</span>
      )}
    </div>
  );

  return { go, went };
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
  const { go, went } = useFakeRouter();

  return (
    <div className="space-y-3">
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <Link href="/" onClick={() => go("/")}>
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem asChild>
          <Link href="/settings" onClick={() => go("/settings")}>
            Settings
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
      </Breadcrumb>

      {went}
    </div>
  );
}

export function BreadcrumbRouterExample() {
  const { go, went } = useFakeRouter("/library/data");

  return (
    <div className="space-y-3">
      <Breadcrumb>
        {DEEP.slice(0, 3).map(([href, label]) => (
          <BreadcrumbItem key={label} asChild>
            <Link href={href} onClick={() => go(href ?? "/")}>
              {label}
            </Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      {went}
    </div>
  );
}

export function BreadcrumbCollapsedExample() {
  const { go, went } = useFakeRouter();

  const trail = (props: Parameters<typeof Breadcrumb>[0]) => (
    <Breadcrumb {...props}>
      {DEEP.map(([href, label]) => (
        <BreadcrumbItem key={label} asChild={Boolean(href)}>
          {href ? (
            <Link href={href} onClick={() => go(href)}>
              {label}
            </Link>
          ) : (
            label
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );

  return (
    <div className="space-y-3">
      {trail({ maxItems: 3 })}
      {trail({ maxItems: 4, itemsBeforeCollapse: 2, itemsAfterCollapse: 2 })}
      {went}
    </div>
  );
}

export function BreadcrumbSeparatorExample() {
  const { go, went } = useFakeRouter();

  const trail = (separator: ReactNode) => (
    <Breadcrumb separator={separator}>
      <BreadcrumbItem asChild>
        <Link href="/" onClick={() => go("/")}>
          Home
        </Link>
      </BreadcrumbItem>
      <BreadcrumbItem asChild>
        <Link href="/docs" onClick={() => go("/docs")}>
          Docs
        </Link>
      </BreadcrumbItem>
      <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
    </Breadcrumb>
  );

  return (
    <div className="space-y-3">
      {trail("/")}
      {trail(<span className="text-xs">•</span>)}
      {went}
    </div>
  );
}

export function BreadcrumbIconsExample() {
  const { go, went } = useFakeRouter();

  return (
    <div className="space-y-3">
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <Link href="/" onClick={() => go("/")}>
            🏠 Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem asChild>
          <Link href="/settings" onClick={() => go("/settings")}>
            ⚙️ Settings
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
      </Breadcrumb>

      {went}
    </div>
  );
}

export function BreadcrumbCurrentExample() {
  const { go, went } = useFakeRouter();

  return (
    <div className="space-y-3">
      <Breadcrumb>
        <BreadcrumbItem asChild>
          <Link href="/" onClick={() => go("/")}>
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem current>Settings</BreadcrumbItem>
        <BreadcrumbItem asChild>
          <Link href="/settings/profile" onClick={() => go("/settings/profile")}>
            Profile
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>

      {went}
    </div>
  );
}

export function BreadcrumbButtonExample() {
  const { go, went } = useFakeRouter();

  return (
    <div className="space-y-3">
      <Breadcrumb>
        <BreadcrumbItem onClick={() => go("/")}>Home</BreadcrumbItem>
        <BreadcrumbItem onClick={() => go("/library")}>Library</BreadcrumbItem>
        <BreadcrumbItem>Data</BreadcrumbItem>
      </Breadcrumb>

      {went}
    </div>
  );
}

export function BreadcrumbSizesExample() {
  const { go, went } = useFakeRouter();

  return (
    <div className="space-y-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Breadcrumb key={size} size={size}>
          <BreadcrumbItem asChild>
            <Link href="/" onClick={() => go("/")}>
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem asChild>
            <Link href="/docs" onClick={() => go("/docs")}>
              Docs
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{size}</BreadcrumbItem>
        </Breadcrumb>
      ))}

      {went}
    </div>
  );
}
