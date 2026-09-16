---
"@geckoui/geckoui": minor
---

`Dialog` and `Drawer` now lock page scrolling while they are open, without the
sideways jump.

Setting `overflow: hidden` on the body removes the scrollbar, which widens the
viewport and shifts everything right by its width. The lock measures that width
and pays it back as padding, so nothing moves:

```ts
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
```

It is reference counted, so stacked overlays do not fight over it. Opening a
dialog on top of a drawer locks once, and the page only unlocks when the last
overlay has finished closing. The lock is held through the exit animation, since
releasing it early makes the page jump while the overlay is still fading.

While a lock is held, `--gecko-scrollbar-width` is set on the root element so
elements pinned to the right edge can compensate as well. Right aligned toast
stacks already do.

A `Drawer` with `allowClickOutside` does not lock, because that drawer
deliberately leaves the page usable behind it.

The hook is exported as `useScrollLock(enabled)` if you need the same behaviour
for your own overlays.

Known gap: iOS Safari ignores `overflow: hidden` on the body, so the page behind
can still be dragged there. Desktop browsers and Android are unaffected.
