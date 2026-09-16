---
"@geckoui/geckoui": major
---

Replace `GeckoUIPortal` with `GeckoUIProvider` — a context-aware, stackable overlay system.

## Breaking change

`<GeckoUIPortal />` (self-closing, placed once at the root) is removed. Replace it with
`<GeckoUIProvider>` wrapping your app's component tree:

**Before:**

```tsx
// app/layout.tsx
import { GeckoUIPortal } from "@geckoui/geckoui";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GeckoUIPortal />
      </body>
    </html>
  );
}
```

**After:**

```tsx
// app/layout.tsx
import { GeckoUIProvider } from "@geckoui/geckoui";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GeckoUIProvider>{children}</GeckoUIProvider>
      </body>
    </html>
  );
}
```

Place `GeckoUIProvider` **below** your own context providers so that overlay content
opened via `Dialog.show()` / `Drawer.show()` can read those contexts.

## What changed

- `Dialog.show()` / `Drawer.show()` now push onto a shared overlay stack instead of
  mounting a detached `createRoot`. This means:
  - React context (e.g. `AuthContext`, `ThemeContext`) flows into overlay content.
  - Multiple dialogs/drawers can be open simultaneously; they stack visually.
  - `show()` returns an `id` string. Pass it to `dismiss(id)` to close a specific overlay;
    call `dismiss()` with no argument to close the topmost overlay.
- Per-overlay Esc and click-outside only act on the **topmost** entry.
- `ConfirmDialog` works unchanged — it wraps `Dialog`.
- Toast (`sonner`) is now hosted inside `GeckoUIProvider` and works identically.
- `GeckoUIPortalProps` is removed; pass toast options as `<GeckoUIProvider toastOptions={...}>`.

## Dialog now works declaratively too

`Dialog` is a component as well as an imperative API, matching `Drawer`:

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onClose={() => setOpen(false)}>
  <h2>Hello</h2>
</Dialog>
```

`Dialog.show()` / `Dialog.dismiss()` keep working unchanged. The declarative form renders in
place and does not need `GeckoUIProvider`.

## `handleClose` is renamed to `onClose`

`Drawer`'s `handleClose` prop is now `onClose`, matching React convention and the rest of the
library (`onChange`, `onSubmit`, `onConfirm`). The new declarative `Dialog` uses `onClose` too.
There is no alias — rename every usage:

```diff
-<Drawer open={open} handleClose={() => setOpen(false)} />
+<Drawer open={open} onClose={() => setOpen(false)} />
```

The same applies to the options passed to `Drawer.show(node, { onClose })`.

## Prop renames for consistency

| Component | Before | After |
| --- | --- | --- |
| `Drawer`, `Dialog` | `handleClose` | `onClose` |
| `Dialog` | `dismissOnEsc` | `dismissOnEscape` (matches `Drawer`) |
| `CounterInput` | `editable` | `allowTyping` (it sat next to `readOnly` and read like its opposite) |
| `Checkbox`, `RHFCheckbox` | `partial` | `indeterminate` (the standard DOM name) |

## Other behaviour changes

- Dialogs always render above drawers (z-index `2000` vs `1000`). Stacked overlays get an
  explicit per-entry z-index instead of relying on DOM insertion order, and the topmost overlay
  — the one that owns Esc and click-outside — is picked by stacking order, not open order.
- `Dialog.dismiss()` and `Drawer.dismiss()` with no argument now only close overlays of their
  own type. Previously either one closed the topmost overlay, whatever it was.
- Clicking inside a dialog no longer dismisses it. Dismissal is driven by the dialog's own
  backdrop rather than a document-level click-outside listener, so popups portalled out of the
  dialog (`Select`, `Menu`, date pickers) no longer close it. Drag-selecting text out past the
  edge of the dialog no longer closes it either.
- `Drawer.show(node, { onClose })` calls your `onClose` again. The provider used to overwrite
  it, so it was silently dropped.
- Clicking the backdrop closes a `<Drawer>` again when `allowClickOutside` is `false`. The
  backdrop click handler had been dropped, which left the default drawer closable only by Esc.
- `Dialog.show()` / `Drawer.show()` log an error when no `<GeckoUIProvider>` is mounted, instead
  of doing nothing. When more than one provider is mounted, the innermost one owns the overlay
  stack and the `<Toaster>` and the others render nothing, with a warning so accidental
  duplicates are easy to spot.
- Overlays give up topmost status as soon as they start closing, so the overlay underneath
  responds to Esc immediately instead of after the 300ms exit animation.
- `<Drawer>` accepts a `style` prop, and the drawer panel carries `role="dialog"`.
- `useClickOutside` (exported) keeps one stable listener instead of re-subscribing on every
  render. It now reads the latest handler and refs at event time, so passing an inline handler
  or a freshly built refs array no longer detaches and reattaches the listener. Behaviour for
  callers is unchanged; only the subscription churn is gone.

## Still not handled

Overlays have no focus trap and do not restore focus to the trigger on close.
