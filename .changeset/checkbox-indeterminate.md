---
"@geckoui/geckoui": minor
---

`Checkbox` now behaves like a native checkbox in the indeterminate state.

`indeterminate` only swapped which icon was rendered. The icon was hidden unless
the input matched `:checked`, and the box only filled on `:checked`, so setting
`indeterminate` on its own displayed nothing — you had to pass `checked` as well
just to make the dash appear.

That forced the wrong semantics on the common case. A "select all" box with some
rows selected has to be unchecked, so that clicking it selects everything rather
than clearing it, and so the submitted value is right. Passing `checked` to get
the dash inverted that.

The component now writes the native `indeterminate` DOM property to the input,
and the styles respond to `:indeterminate` as well as `:checked`:

```diff
 <Checkbox
-  checked={someSelected}
+  checked={allSelected}
   indeterminate={someSelected && !allSelected}
   onChange={handleSelectAll}
 />
```

`indeterminate` is now independent of `checked`, matching the platform:

| `checked` | `indeterminate` | Shows |
| --- | --- | --- |
| `false` | `false` | empty box |
| `false` | `true` | dash |
| `true` | `false` | tick |
| `true` | `true` | dash |

Because the property is set on the element, `:indeterminate` now matches in CSS
and assistive tech reports the mixed state. The same applies to `RHFCheckbox`,
which forwards the prop.

The property is re-applied on every render, since the browser clears it itself
when the box is clicked. Without that, a controlled checkbox that keeps
`indeterminate` set would lose the dash after the first click.
