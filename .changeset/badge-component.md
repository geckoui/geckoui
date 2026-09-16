---
"@geckoui/geckoui": minor
---

New `Badge` component: a small inline label for status, counts and categories.

Two axes work independently. `variant` is how the badge is filled, `color` is what
it means, so a success badge can be solid, tinted or outlined without changing
what it says.

```tsx
<Badge>Draft</Badge>
<Badge color="success">Active</Badge>
<Badge variant="filled" color="error">Failed</Badge>
<Badge variant="outlined" color="info" size="sm">Beta</Badge>
<Badge color="success" dot>Live</Badge>
<Badge shape="pill" color="primary">New</Badge>
```

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `filled`, `soft`, `outlined` | `soft` |
| `color` | `default`, `primary`, `success`, `error`, `warning`, `info` | `default` |
| `size` | `sm`, `md`, `lg` | `md` |
| `shape` | `rounded`, `pill`, `square` | `rounded` |
| `dot` | `boolean` | `false` |
| `icon` | `ReactNode \| FC` | - |

All four axes are extensible maps, so a consumer can add keys through module
augmentation and style them with CSS alone:

```tsx
declare module "@geckoui/geckoui" {
  interface BadgeColorMap {
    brand: unknown;
  }
}
```

```css
.GeckoUIBadge[data-color="brand"] {
  --gecko-badge-accent: oklch(0.62 0.21 320);
}
```

Colours come from the shared `--color-success`, `--color-error`, `--color-warning`
and `--color-info` tokens, so overriding one updates Badge, Alert and Toast
together. The badge also exposes `--gecko-badge-accent`, `--gecko-badge-on-accent`,
`--gecko-badge-radius`, `--gecko-badge-soft-mix` and `--gecko-badge-outline-mix`.

`icon` is rendered exactly as given, with no wrapper element and no injected
classes, so styling lives where the icon is defined.

The text on a `filled` badge follows `--color-surface-primary`, which is light in
light mode and dark in dark mode, so it stays readable as the accents invert.
`primary` is the exception and keeps `--color-text-on-primary`, because the
primary scale is not lifted in dark mode.
