---
"@geckoui/geckoui": minor
---

`Alert` variant colours now come from the shared semantic tokens.

It previously hardcoded `text-red-500`, `bg-orange-500` and friends, so the
theming story did not reach it: overriding your CSS variables changed every other
component but left alerts on the stock Tailwind palette.

Each variant now sets one `--gecko-alert-accent`, drawn from `--color-error`,
`--color-warning`, `--color-info` and `--color-success`. Those are the same
tokens `Toast` uses, so a single override updates both:

```css
:root {
  --color-error: oklch(0.6 0.22 25);
}
```

The alert also exposes `--gecko-alert-bg`, `--gecko-alert-border`,
`--gecko-alert-accent` and `--gecko-alert-radius`, so a variant can be restyled
without overriding a class:

```css
.GeckoUIAlert[data-variant="error"] {
  --gecko-alert-bg: var(--color-error);
  --gecko-alert-accent: white;
}
```

Variant colours shift very slightly, since the tokens are not pixel-identical to
the Tailwind values they replace.
