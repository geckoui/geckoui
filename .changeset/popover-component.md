---
"@geckoui/geckoui": minor
---

New `Popover` component.

```tsx
<Popover placement="bottom-start" arrow>
  <PopoverTrigger>
    <Button>Filters</Button>
  </PopoverTrigger>

  <PopoverContent>
    <FilterForm />
  </PopoverContent>
</Popover>
```

`PopoverTrigger` uses its child as the trigger rather than wrapping it, so the button keeps
its own tag, styling and click handler. `PopoverContent` holds anything — a form, a list, a
chart.

`usePopover()` gives anything inside the panel `open`, `close()`, `toggle()` and `setOpen()`,
so a Cancel button or a form submit can shut it.

Focus moves into the panel when it opens and returns to the trigger when it closes, so it
works from the keyboard. Escape closes it even from inside a text field, which is where it
differs from `Dialog` and `Drawer` — those leave Escape alone while you type, and a popover
holding a form should not.

The panel renders inline rather than in a portal, so it stays inside a dialog and keeps
React context. Position with `placement` and `offset`; it flips and shifts to stay on
screen. `arrow` adds a pointer, off by default.

Which to reach for: `Tooltip` for a label on hover, `Popover` for a panel you click open,
`Menu` for a list of actions.
