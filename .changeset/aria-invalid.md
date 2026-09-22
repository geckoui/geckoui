---
"@geckoui/geckoui": major
---

Replace `hasError` with `aria-invalid`.

`hasError` was a prop of the library's own doing a job the platform already has a standard
attribute for. Worse, because it was only a prop, nothing reached assistive technology: a
field could be red to sighted users and silent to a screen reader. `aria-invalid` was set
nowhere in the library.

Every component that had `hasError` now reads `aria-invalid` instead, which is both the
styling hook and what gets announced:

```diff
-<ColorInput hasError value={colour} onChange={setColour} />
+<ColorInput aria-invalid value={colour} onChange={setColour} />
```

The `RHF*` wrappers set it from the field's own error, as they did with `hasError`, so forms
need no change.

It also settles a split that had grown up: six components took a `hasError` prop while five
others had their error drawn by the RHF wrapper through a `data-error` attribute and a
stylesheet of its own. Both are now the one attribute, styled by the base component, and the
five RHF-side stylesheets are gone.

`Checkbox`, `Radio`, `Switch`, `Select`, `OTPInput` and `CounterInput` gained an error state
they never had.
