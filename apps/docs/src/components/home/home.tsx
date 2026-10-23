import { GITHUB_URL, SiteHeader } from "@/components/site/site-header";
import { Accessibility, Bot, Braces, ClipboardCheck, Paintbrush, Palette } from "lucide-react";
import Link from "next/link";

import { InstallCommand } from "./install-command";
import { Showcase } from "./showcase";

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Forms built in",
    body: "Every input has a react-hook-form version that registers, validates and shows its own error."
  },
  {
    icon: Palette,
    title: "Themes are CSS variables",
    body: "Set --color-primary-500 in any color format and every component follows. Dark mode is one class."
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    body: "Keyboard navigation, focus management and ARIA attributes come with every component."
  },
  {
    icon: Braces,
    title: "Typed end to end",
    body: "Props, events and refs are fully typed, so your editor shows what each component accepts."
  },
  {
    icon: Paintbrush,
    title: "Style with plain CSS",
    body: "Each part has a stable class and data attributes. Override what you need and keep the rest."
  },
  {
    icon: Bot,
    title: "Ready for AI agents",
    body: "Install the GeckoUI skill and your coding agent gets the real API, variables and class names."
  }
];

export function GeckoHome() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 pb-14 text-center md:pt-24">
          <Link
            href="/docs/migrating-to-v2"
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs transition-colors hover:bg-accent">
            <span className="font-medium">GeckoUI v2 is here</span>
            <span className="text-muted-foreground">See what changed</span>
          </Link>
          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl">
            React components with forms built in
          </h1>
          <p className="mt-5 max-w-2xl text-base text-balance text-muted-foreground sm:text-lg">
            GeckoUI is a library of 40+ accessible, typed React components. Every input works with
            react-hook-form, and every color is a CSS variable you can change.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Get started
            </Link>
            <Link
              href="/docs/accordion"
              className="inline-flex h-10 items-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-accent">
              Browse components
            </Link>
          </div>
          <InstallCommand command="pnpm add @geckoui/geckoui" className="mt-5" />
        </section>

        <section className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="rounded-2xl border border-border bg-muted/40 p-4 md:p-6">
            <Showcase />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-24 md:px-8">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight">
            Everything a product UI needs, nothing to wire up
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <f.icon className="size-5 text-muted-foreground" />
                <h3 className="mt-3 font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:px-8">
          <span>MIT licensed. Built with GeckoUI.</span>
          <div className="flex gap-5">
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@geckoui/geckoui"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground">
              npm
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
