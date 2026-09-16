---
"@geckoui/geckoui": major
---

`CounterInput` value is now a string, and it no longer eats decimal points.

Typing `2.8` and then deleting the `8` left `"2."`, which the component pushed
through `parseFloat` to get `2`. The parent then sent `2` back down and the
string mirror was rewritten to `"2"`, deleting the decimal point as the user
typed. Reaching `2.5` by editing `2.8` was impossible. `"2.0"` collapsed the
same way, so no value with a trailing zero could be typed either.

The value is now carried as a string and only converted to a number for the
buttons and for clamping:

```diff
-const [quantity, setQuantity] = useState(0);
+const [quantity, setQuantity] = useState("0");

 <CounterInput value={quantity} onChange={setQuantity} />

+// convert where you need a number
+const total = Number(quantity || 0) * price;
```

`RHFCounterInput` stores a string in the form too, so a `zod` schema needs
`z.coerce.number()` or a string field, and `defaultValues` should hold strings:

```diff
 const schema = z.object({
-  quantity: z.number().min(1)
+  quantity: z.coerce.number().min(1)
 });

 useForm({
-  defaultValues: { quantity: 1 }
+  defaultValues: { quantity: "1" }
 });
```

`formatNumericInput` coerces with `String()` before sanitising, so an unmigrated
numeric default renders instead of throwing.

Also changed:

- Clamping to `min` / `max` now happens on blur and on the buttons, not on every
  keystroke. Typing `1` on the way to `10` is no longer snapped to the minimum.
- New `strict`, `positiveOnly`, `maxFractionDigits` and `maxWholeDigitPlaces`
  props, matching `RHFNumberInput`.
- Empty input is allowed while typing and settles to `""` on blur.
- The increment and decrement buttons round to the step's precision, so stepping
  `0.1` by `0.2` gives `0.3` rather than `0.30000000000000004`.
- With `positiveOnly`, stepping down from `0` stays at `0` instead of producing
  `-1` and formatting it back to `1`.
- `inputMode` is `decimal` rather than `numeric`, so mobile keyboards offer the
  decimal point.

The sanitising logic that `RHFNumberInput` already used is now shared as the
exported `formatNumericInput` utility, and both components use it.
