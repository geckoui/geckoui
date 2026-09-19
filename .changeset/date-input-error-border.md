---
"@geckoui/geckoui": patch
---

`DateInput` and `DateRangeInput` keep their red border while they are being typed into.

`[data-state="enabled"]:focus-within` outweighs a bare `[data-error]`, so the border went
back to blue the moment the field was used — which is exactly when the error matters most.
The focused state is now stated for the error too.
