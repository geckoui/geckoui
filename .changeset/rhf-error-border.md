---
"@geckoui/geckoui": major
---

The red error border now actually renders on `RHFInput`, `RHFSelect`,
`RHFCounterInput` and `RHFOTPInput`.

Each of these styles its error state as `.GeckoUIRHFX[data-error]`, but the
attribute never reached the element carrying that class:

- `RHFInput` put the class on the wrapping `<label>` and `data-error` on the
  inner `<input>`.
- `RHFSelect`, `RHFCounterInput` and `RHFOTPInput` passed `data-error` to a
  component that never forwarded it to the DOM at all, so it vanished.

So the message appeared but the field kept its normal border. `RHFTextarea` was
the only one that worked, because there the class and the attribute are on the
same element.

`data-error` now lands on the element that carries the class, next to the
`data-state` and `data-size` attributes the styles already key off.

**Breaking:** `data-*` attributes passed to `Input` and `CounterInput` now land
on the root element instead of the inner `<input>`. This matches `className`,
which already targets the root, and the state attributes that live there. If you
relied on `data-*` reaching the inner input — a `data-testid` used with
`getByTestId`, say — point it at the root or use `inputClassName` instead.

```diff
-<label class="GeckoUIInput GeckoUIRHFInput">
-  <input class="GeckoUIInput__input" data-error="true">
+<label class="GeckoUIInput GeckoUIRHFInput" data-error="true">
+  <input class="GeckoUIInput__input">
 </label>
```
