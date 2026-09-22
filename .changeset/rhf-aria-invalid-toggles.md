---
"@geckoui/geckoui": patch
---

Mark `RHFCheckbox`, `RHFRadio` and `RHFSwitch` invalid when their field fails validation.

All three base components had `aria-invalid` styling, but their wrappers never set it, so a
required checkbox or switch never turned red and a screen reader was never told the field
was invalid.
