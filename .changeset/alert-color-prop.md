---
"@geckoui/geckoui": major
---

`Alert`'s `variant` prop is renamed to `color`.

`variant` meant two different things across the library. On `Button` and `Badge`
it is the visual treatment — filled, outlined, soft. On `Alert` it was the
meaning — error, warning, info. Same word, opposite axis.

`Alert` was the odd one out and the cheapest to move, so it now matches:

```diff
-<Alert variant="error" title="Upload failed" />
+<Alert color="error" title="Upload failed" />
```

`AlertVariantMap` becomes `AlertColorMap`, and the styling hook is `data-color`
rather than `data-variant`:

```diff
-.GeckoUIAlert[data-variant="critical"] { ... }
+.GeckoUIAlert[data-color="critical"] { ... }
```

This also frees `variant` on `Alert` for the treatment axis it does not have yet.
A solid red alert and a tinted red alert are both reasonable requests, and there
was previously nowhere to put that. When it arrives it will read the same as
`Badge`: `variant="filled" | "soft" | "outlined"` alongside `color`.

After this, every component that carries both axes agrees: `variant` is how it
looks, `color` is what it means.
