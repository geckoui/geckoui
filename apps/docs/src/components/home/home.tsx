"use client";

import Link from "next/link";
import { type CSSProperties, useState } from "react";

import { ACCENTS, type Accent, Features, accentVars } from "./features";
import { Floater, HomeFooter, HomeNav, InstallCommand } from "./shared";
import {
  CheckoutStepper,
  NotifySwitch,
  OTPWidget,
  QuantityCounter,
  RatingWidget,
  StatusBadges,
  TeamAvatars,
  ToastButton,
  VolumeSlider
} from "./widgets";

const sticker =
  "rounded-2xl border-[3px] border-[var(--edge)] bg-[var(--card)] p-4 text-[var(--card-ink)] shadow-[6px_6px_0_var(--edge)]";

export function GeckoHome() {
  const [accent, setAccent] = useState<Accent>(ACCENTS[0]);

  return (
    <div
      style={accentVars(accent.hue) as CSSProperties}
      className="gk-home min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
      <HomeNav className="text-[var(--muted)]" />

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:pt-14">
        <h1 className="font-display max-w-4xl text-[clamp(3.25rem,9vw,7.5rem)] leading-[0.92]">
          Cute components. Serious React.
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg text-[var(--muted)]">
            GeckoUI gives you 40+ accessible, typed components, react-hook-form wrappers, and themes
            that are just CSS variables. Peel off any sticker below and play with it.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/docs"
              className="rounded-xl border-[3px] border-[var(--edge)] bg-[var(--sun)] px-6 py-3 font-bold text-black shadow-[4px_4px_0_var(--edge)] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_var(--edge)]">
              Read the docs
            </Link>
            <InstallCommand className="rounded-xl border-[3px] border-[var(--edge)] bg-[var(--card)] px-4 py-3 text-[var(--card-ink)] shadow-[4px_4px_0_var(--edge)]" />
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative flex flex-wrap justify-center gap-6 lg:block lg:h-[560px]">
          <Floater top="2%" left="0%" rotate={-6} duration={6} className={sticker}>
            <NotifySwitch />
          </Floater>
          <Floater top="0%" left="30%" rotate={4} duration={7} delay={-2} className={sticker}>
            <RatingWidget />
          </Floater>
          <Floater top="8%" left="58%" rotate={-3} duration={6.5} delay={-4} className={sticker}>
            <CheckoutStepper />
          </Floater>
          <Floater top="34%" left="8%" rotate={5} duration={7.5} delay={-1} className={sticker}>
            <OTPWidget />
          </Floater>
          <Floater top="38%" left="42%" rotate={-5} duration={6} delay={-3} className={sticker}>
            <ToastButton />
          </Floater>
          <Floater top="34%" left="70%" rotate={7} duration={8} delay={-5} className={sticker}>
            <VolumeSlider />
          </Floater>
          <Floater top="68%" left="2%" rotate={-2} duration={7} delay={-2.5} className={sticker}>
            <StatusBadges />
          </Floater>
          <Floater top="70%" left="34%" rotate={3} duration={6.5} delay={-6} className={sticker}>
            <TeamAvatars />
          </Floater>
          <Floater top="66%" left="66%" rotate={-6} duration={7.5} delay={-3.5} className={sticker}>
            <QuantityCounter />
          </Floater>
        </div>
      </section>

      <Features accent={accent} onAccent={setAccent} />

      <HomeFooter className="border-t-[3px] border-[var(--edge)] text-[var(--muted)]" />
    </div>
  );
}
