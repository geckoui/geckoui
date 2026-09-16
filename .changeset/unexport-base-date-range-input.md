---
"@geckoui/geckoui": major
---

`BaseDateRangeInput` is no longer exported.

It was public by accident. Its sibling `BaseDateInput` was never exported, it
appeared in no documentation page in any version, and it exists only as the
internal implementation that `DateRangeInput` builds on.

Use `DateRangeInput`, which wraps it and adds the calendar popup:

```diff
-import { BaseDateRangeInput } from "@geckoui/geckoui";
+import { DateRangeInput } from "@geckoui/geckoui";
```

The `DateRange` type is unaffected — it is still exported, from `DateRangeInput`.
`DateRangeInputProps` still extends the base props, which remain in the published
types as an internal declaration, so prop typing is unchanged.
