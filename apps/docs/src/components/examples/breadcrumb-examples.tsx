"use client";

import { Breadcrumb, BreadcrumbItem } from "@geckoui/geckoui";

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
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
      <BreadcrumbItem>Profile</BreadcrumbItem>
    </Breadcrumb>
  );
}

export function BreadcrumbCollapsedExample() {
  return (
    <div className="space-y-3">
      <Breadcrumb maxItems={3}>
        {DEEP.map(([href, label]) => (
          <BreadcrumbItem key={label} href={href}>
            {label}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <Breadcrumb maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2}>
        {DEEP.map(([href, label]) => (
          <BreadcrumbItem key={label} href={href}>
            {label}
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
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
        <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
      </Breadcrumb>

      <Breadcrumb separator={<span className="text-xs">•</span>}>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
        <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

export function BreadcrumbIconsExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">🏠 Home</BreadcrumbItem>
      <BreadcrumbItem href="/settings">⚙️ Settings</BreadcrumbItem>
      <BreadcrumbItem>Profile</BreadcrumbItem>
    </Breadcrumb>
  );
}

export function BreadcrumbCurrentExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem current>Settings</BreadcrumbItem>
      <BreadcrumbItem href="/settings/profile">Profile</BreadcrumbItem>
    </Breadcrumb>
  );
}

export function BreadcrumbSizesExample() {
  return (
    <div className="space-y-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Breadcrumb key={size} size={size}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
          <BreadcrumbItem>{size}</BreadcrumbItem>
        </Breadcrumb>
      ))}
    </div>
  );
}
