---
"@geckoui/geckoui": patch
---

`Menu` now focuses the first item when you open it with ArrowDown.

`MenuButton` looked the item up in the same tick it called `openMenu()`:

```tsx
if (!open) openMenu();
const firstItem = menuRef.current?.querySelector("[role=menuitem]");
setTimeout(() => firstItem?.focus());
```

`openMenu()` only schedules a state update, so the panel was still unmounted on
the next line. `menuRef.current` was `null`, `firstItem` was `undefined`, and the
queued `focus()` had nothing to focus. The menu opened with focus sitting on the
panel, so you had to press ArrowDown a second time to reach the first item.

The lookup now happens inside the timeout, after the panel has mounted, and it
skips disabled items to match the arrow navigation already in `MenuPanel`.
