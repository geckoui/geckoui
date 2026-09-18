---
"@geckoui/geckoui": patch
---

`asChild`-style triggers no longer crash the page when they cannot merge into their child.

`Tooltip` (with `triggerAsChild`), `Tab` (with `asChild`) and `PopoverTrigger` used
`Children.only`, which throws. Under React Server Components a child does not always reach
a client component as an element: it can arrive as an unresolved lazy chunk, and the throw
took down the whole route rather than the one trigger. This showed up on the Tooltip docs
page as `React.Children.only expected to receive a single React element child.`

They now fall back to their wrapper element when there is no single element to clone.
`Tooltip` renders its `GeckoUITooltip__trigger` span, `Tab` renders its button, and
`PopoverTrigger` wraps the child in a span instead of rendering nothing.
