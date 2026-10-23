"use client";

import { ThemeToggle } from "fumadocs-ui/components/layout/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type ReactNode, useState } from "react";

import "./home.css";

export const INSTALL = "pnpm add @geckoui/geckoui";
export const GITHUB_URL = "https://github.com/geckoui/geckoui";

export function InstallCommand({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy install command"
      className={`group inline-flex items-center gap-3 font-mono text-sm ${className}`}>
      <span className="opacity-50">$</span>
      <span>{INSTALL}</span>
      <span className="text-xs opacity-60 group-hover:opacity-100">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

export function HomeNav({ className = "" }: { className?: string }) {
  return (
    <nav
      className={`relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 ${className}`}>
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Image src="/logo.png" alt="" width={28} height={28} className="gk-logo" />
        <span>GeckoUI</span>
      </Link>
      <div className="flex items-center gap-5 text-sm">
        <Link href="/docs" className="hover:underline">
          Docs
        </Link>
        <a href={GITHUB_URL} className="hover:underline">
          GitHub
        </a>
        <ThemeToggle mode="light-dark" />
      </div>
    </nav>
  );
}

export function HomeFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10 text-sm sm:px-6 ${className}`}>
      <span>MIT licensed. The only thing our gecko eats is bugs.</span>
      <div className="flex gap-5">
        <Link href="/docs" className="hover:underline">
          Docs
        </Link>
        <Link href="/docs/installation" className="hover:underline">
          Installation
        </Link>
        <a href={GITHUB_URL} className="hover:underline">
          GitHub
        </a>
        <a href="https://www.npmjs.com/package/@geckoui/geckoui" className="hover:underline">
          npm
        </a>
      </div>
    </footer>
  );
}

export interface FloaterProps {
  children: ReactNode;
  className?: string;
  top?: string;
  left?: string;
  rotate?: number;
  duration?: number;
  delay?: number;
}

export function Floater({
  children,
  className = "",
  top,
  left,
  rotate = 0,
  duration = 7,
  delay = 0
}: FloaterProps) {
  const style = {
    top,
    left,
    "--r": `${rotate}deg`,
    "--dur": `${duration}s`,
    "--delay": `${delay}s`
  } as CSSProperties;

  return (
    <div className={`gk-float lg:absolute ${className}`} style={style}>
      {children}
    </div>
  );
}
