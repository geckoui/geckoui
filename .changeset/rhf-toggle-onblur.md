---
"@geckoui/geckoui": major
---

`RHFCheckbox`, `RHFRadio` and `RHFSwitch` call `onBlur` with no arguments.

They were the only wrappers still forwarding the native `FocusEvent`, while every other one
hands back the value or nothing. Read the value from the form instead:

```diff
-<RHFSwitch name="on" onBlur={(e) => log(e.target.checked)} />
+<RHFSwitch name="on" onBlur={() => log(getValues("on"))} />
```
