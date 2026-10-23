"use client";

import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Pagination,
  Progress,
  Slider,
  Step,
  Stepper,
  Switch
} from "@geckoui/geckoui";
import { type ReactNode, useState } from "react";

export const ACCENTS = [
  { name: "Lilac", hue: 290 },
  { name: "Blue", hue: 260 },
  { name: "Green", hue: 150 },
  { name: "Coral", hue: 25 },
  { name: "Pink", hue: 350 }
] as const;

export type Accent = (typeof ACCENTS)[number];

export function accentVars(hue: number) {
  return {
    "--color-primary-300": `oklch(0.81 0.1 ${hue})`,
    "--color-primary-500": `oklch(0.62 0.19 ${hue})`,
    "--color-primary-600": `oklch(0.55 0.2 ${hue})`
  };
}

const sticker =
  "rounded-3xl border-[3px] border-[var(--edge)] bg-[var(--card)] p-6 text-[var(--card-ink)] shadow-[6px_6px_0_var(--edge)]";

function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-5 overflow-x-auto rounded-2xl bg-[#1d1638] p-4 font-mono text-[13px] leading-relaxed text-[#ece6ff]">
      <code>{children}</code>
    </pre>
  );
}

function Card({
  title,
  body,
  className = "",
  children
}: {
  title: string;
  body: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`${sticker} flex min-w-0 flex-col ${className}`}>
      <h3 className="font-display text-2xl sm:text-3xl">{title}</h3>
      <p className="mt-2 max-w-prose opacity-75">{body}</p>
      {children}
    </article>
  );
}

function ThemeDemo({ accent, onAccent }: { accent: Accent; onAccent: (accent: Accent) => void }) {
  const [on, setOn] = useState(true);
  const [value, setValue] = useState(60);
  const [page, setPage] = useState(2);
  const [step, setStep] = useState("ship");

  return (
    <div className="mt-5 flex flex-1 flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Primary color">
        {ACCENTS.map((a) => (
          <button
            key={a.name}
            type="button"
            aria-pressed={accent.name === a.name}
            onClick={() => onAccent(a)}
            className="flex items-center gap-2 rounded-full border-2 border-[var(--edge)] px-3 py-1.5 text-sm font-medium aria-pressed:bg-[var(--card-ink)] aria-pressed:text-[var(--card)]">
            <span
              className="size-4 rounded-full"
              style={{ background: `oklch(0.62 0.19 ${a.hue})` }}
            />
            {a.name}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6 rounded-2xl border-2 border-dashed border-[var(--edge)]/30 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar name="Gecko UI" color="primary" />
          <Button>Save</Button>
          <Button variant="outlined">Cancel</Button>
          <Badge color="primary">New</Badge>
          <Switch checked={on} onChange={setOn} />
        </div>
        <Stepper value={step} onChange={setStep}>
          <Step value="cart">Cart</Step>
          <Step value="ship">Shipping</Step>
          <Step value="pay">Payment</Step>
        </Stepper>
        <div className="grid gap-4 sm:grid-cols-2">
          <Slider value={value} onChange={setValue} aria-label="Demo slider" />
          <Progress value={value} aria-label="Demo progress" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            Remember me
          </label>
          <Pagination currentPage={page} totalPages={5} onChange={setPage} />
        </div>
      </div>

      <Code>{`:root {\n  --color-primary-500: oklch(0.62 0.19 ${accent.hue});\n}`}</Code>
    </div>
  );
}

const VARIANTS = ["filled", "outlined", "ghost", "icon"];

function TypeHint() {
  return (
    <div className="mt-5 rounded-2xl bg-[#1d1638] p-4 font-mono text-[13px] text-[#ece6ff]">
      <div>
        {'<Button variant="'}
        <span className="animate-pulse border-r-2 border-[#ece6ff]" />
        {'" />'}
      </div>
      <ul className="mt-2 ml-[8.5ch] w-44 overflow-hidden rounded-lg border border-white/15 bg-[#2a2150] py-1 shadow-lg">
        {VARIANTS.map((v, i) => (
          <li key={v} className={`flex justify-between px-3 py-1 ${i === 0 ? "bg-[#4b3a8f]" : ""}`}>
            <span>&quot;{v}&quot;</span>
            <span className="opacity-40">string</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillCommand() {
  const command = "npx skills add GeckoUI/skills";
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
      className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[#1d1638] p-4 text-left font-mono text-[13px] text-[#ece6ff]">
      <span>
        <span className="opacity-50">$ </span>
        {command}
      </span>
      <span className="text-xs opacity-60">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function Features({
  accent,
  onAccent
}: {
  accent: Accent;
  onAccent: (accent: Accent) => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <h2 className="font-display max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95]">
        Everything you need.
        <br />
        No glue code.
      </h2>

      <div className="mt-12 grid gap-8 lg:grid-cols-6">
        <Card
          title="Forms that wire themselves"
          body="Every input has a react-hook-form version. Give it a name and it registers, validates and shows its own error."
          className="lg:col-span-3 lg:-rotate-1">
          <Code>{`<form onSubmit={handleSubmit(save)}>
  <RHFInput name="email" label="Email" />
  <RHFSelect name="plan" label="Plan" />
  <RHFDateInput name="startsOn" />
</form>`}</Code>
        </Card>

        <Card
          title="Your brand color, one line"
          body="Themes are CSS variables, in any color format. Pick one below and every component on this page follows."
          className="lg:col-span-3 lg:row-span-2 lg:rotate-1">
          <ThemeDemo accent={accent} onAccent={onAccent} />
        </Card>

        <Card
          title="Typed props"
          body="Your editor lists every option before you run anything."
          className="lg:col-span-3 lg:rotate-[0.5deg]">
          <TypeHint />
        </Card>

        <Card
          title="Plain CSS overrides"
          body="Every part has a stable class and data attributes. Change what you need and keep the rest."
          className="lg:col-span-3 lg:rotate-[-0.5deg]">
          <Code>{`.GeckoUIButton[data-variant="filled"] {
  border-radius: 999px;
}`}</Code>
        </Card>

        <Card
          title="Your AI agent knows it too"
          body="Install the skill and Claude Code and other agents get the real API, theme variables and class names."
          className="lg:col-span-3 lg:rotate-1">
          <SkillCommand />
        </Card>
      </div>
    </section>
  );
}
