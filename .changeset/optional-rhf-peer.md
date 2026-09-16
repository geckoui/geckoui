---
"@geckoui/geckoui": patch
---

`react-hook-form` is now an optional peer dependency.

It was required, so installing the library for `Button` or `Badge` alone still
forced `react-hook-form` into your tree or produced a peer warning. Only the
`RHF*` components import it, and nothing else in the package touches it.

Nothing changes if you use the `RHF*` components: keep `react-hook-form`
installed as before.
