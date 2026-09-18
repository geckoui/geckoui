---
"@geckoui/geckoui": patch
---

Library warnings are now development only, and no longer crash a page without a
bundler.

Every `console.warn` and `console.error` in the library now goes through a shared
`devWarn`, which prefixes `[GeckoUI]` and stays silent when `NODE_ENV` is
`production`. That covers the missing provider, several providers, invalid calendar
dates, `RHFInputGroup` misuse, and a new one: a `Select` given a value that matches
no `SelectOption`.

Two things made this fiddly, and both are fixed:

- **The build baked the value in.** With tsup's `platform: "browser"`, esbuild
  replaced `process.env.NODE_ENV` while building the library, so the check became
  `if (true)` and the warnings fired in every consumer's production build. A
  `define` now opts out, leaving the consumer's bundler to resolve it.
- **`process` may not exist at all.** Somewhere that does not replace the value —
  raw browser ESM, no bundler — the bare identifier threw
  `ReferenceError: process is not defined`. The read is now wrapped, and an unknown
  environment counts as development: a warning nobody sees beats a crash.

The warning text still ships (about 1kb), it just never prints in production.
