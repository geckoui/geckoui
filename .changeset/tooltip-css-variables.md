---
"@geckoui/geckoui": patch
---

`Tooltip` colours now come from CSS variables, like the other components.

```css
.GeckoUITooltip {
  --gecko-tooltip-bg: var(--color-surface-emphasis);
  --gecko-tooltip-text: var(--color-surface-primary);
  --gecko-tooltip-radius: 0.5rem;
}
```

It looks the same as before. The bubble stays inverted against the page rather than matching
the surface the way `Popover` does, because a tooltip is transient and holds nothing you can
click, so contrast alone separates it and it needs no border. Both tokens flip in dark mode,
so it stays inverted there too.

`backgroundColor` now sets `--gecko-tooltip-bg` instead of the background directly, so the
arrow follows the panel from the cascade rather than being coloured a second time. Overriding
the variables through `className` also lets you fix the text colour alongside the background,
which the prop on its own could not do.
