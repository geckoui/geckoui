---
"@geckoui/geckoui": minor
---

New `Skeleton` component.

```tsx
<Skeleton />
<Skeleton lines={3} />
<Skeleton shape="circle" className="size-12" />
<Skeleton shape="rounded" className="h-24 w-40" />
```

There are no `width` and `height` props. Size it through `className` the way you size the
element it stands in for, so the two cannot drift apart. A `text` skeleton takes its height
from the current font size, and `lines` draws a paragraph with the last line short, which is
what makes a stack of bars read as text rather than as a table.

`loading` lets it wrap the real thing instead of leaving a ternary at every call site:

```tsx
<Skeleton loading={isLoading} lines={2}>
  <p>{user.bio}</p>
</Skeleton>
```

Children are never rendered while loading, so nothing inside has to guard against data that
has not arrived yet. Once loading is over the wrapper is gone too, leaving only your own
markup.

`shape` is `text`, `rounded` or `circle` and `animation` is `pulse`, `wave` or `none`; both
maps are open to module augmentation. Every value is a `--gecko-skeleton-*` variable. Both
animations are dropped under `prefers-reduced-motion`.

It is marked `aria-busy` with no role of its own, so a page of placeholders does not announce
itself once per placeholder.
