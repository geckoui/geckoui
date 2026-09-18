---
"@geckoui/geckoui": major
---

Toast is now built in house. `sonner` is no longer a dependency.

The API is unchanged for normal use: `toast()`, `toast.success` / `.error` /
`.warning` / `.info` / `.loading`, `toast.promise`, `toast.custom` and
`toast.dismiss(id?)` all behave as before, and `<GeckoUIProvider>` still renders
the stacks.

## Removed options

`toastOptions` no longer accepts these sonner-specific settings:

| Removed      | Why                                                                              |
| ------------ | -------------------------------------------------------------------------------- |
| `richColors` | Variant colours are the default now, so there is nothing to opt into             |
| `theme`      | Toasts read the library's own colour variables and follow your theme             |
| `expand`     | The collapsed stack that expanded on hover is gone; the stack is always expanded |

`toastOptions.className` and `toastOptions.style` are renamed to `toastClassName`
and `toastStyle`, since `className` now targets the stack element. `offset` is a
number of pixels rather than a string.

## Dismissing a promise toast

Dismissing the loading toast now cancels the follow-up, so the success or error
toast no longer appears over a dismissal. Pushing to the id yourself still shows
it, because that is an explicit request rather than the library finishing its own
lifecycle.

## Styling

Every value is a CSS custom property, so the whole system can be restyled without
overriding a class: `--gecko-toast-width`, `--gecko-toast-offset`,
`--gecko-toast-bg`, `--gecko-toast-fg`, `--gecko-toast-accent`,
`--gecko-toast-radius`, `--gecko-toast-padding`, `--gecko-toast-shadow`,
`--gecko-toast-duration` and more.

Variant colours come from new shared semantic tokens, `--color-success`,
`--color-error`, `--color-warning` and `--color-info`, so overriding one updates
every component that reports status.

Per-part class hooks match the rest of the library: `iconClassName`,
`messageClassName`, `descriptionClassName`, `actionClassName`, `cancelClassName`
and `closeClassName`.

## Behaviour

- Hovering a stack pauses every timer in it, so a toast cannot expire while you
  are reading the one above it.
- Replacing a toast by id restarts its timer.
- Errors use `role="alert"` with `aria-live="assertive"`; everything else uses
  `status` and `polite`.
- `prefers-reduced-motion` drops the scale animation.
- The message and description are rendered in `div` elements, not `p`. Both accept
  arbitrary `ReactNode`, and a caller passing a `div` or another `p` into a `p`
  produces invalid markup and a hydration error.
