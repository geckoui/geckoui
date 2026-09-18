---
"@geckoui/geckoui": minor
---

New `Progress` component.

```tsx
<Progress value={40} label={({ percent }) => `${percent}%`} />
<Progress value={3} max={7} label={({ value, max }) => `${value} of ${max} files`} />
<Progress />
<Progress value={100} color="success" size="lg" />
```

Leaving `value` out is what makes it indeterminate, so there is no second prop that can
contradict the first. It also drops `aria-valuenow`, which is what tells a screen reader the
value is unknown rather than zero. `value={0}` is a known value and draws an empty bar.

`value` is clamped into range, and the `label` function is handed the clamped number, so it
cannot report more than the bar shows. `percent` is rounded to whole numbers and drives the
bar width too, so the number and the bar never disagree. A `label` node shows while the value
is unknown; a `label` function is only called when there is a value to report.

`color` is the same six as Badge, defaulting to `primary`, and `size` is `sm`, `md` or `lg`.
Both maps are open to module augmentation, and every value is a `--gecko-progress-*` variable.

Under `prefers-reduced-motion` the indeterminate bar becomes a full-width pulse rather than
stopping, which would read as stalled work.
