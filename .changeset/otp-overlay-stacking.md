---
"@geckoui/geckoui": patch
---

Stop `OTPInput` stealing clicks from a dropdown opened over it.

Its overlay button — the transparent layer that gives the field focus wherever you click —
sat at `z-index: 10`, the same tier the stacking order reserves for inline dropdowns. A tie
is broken by document order, so a `Select` opening over an `OTPInput` painted above it and
still lost the click to it: the option under the pointer never fired and the OTP field took
focus instead.

The field is now its own stacking context, so the overlay only has to clear the cells beside
it rather than competing with the page.
