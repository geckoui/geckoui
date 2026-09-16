---
"@geckoui/geckoui": patch
---

`ConfirmDialog` now awaits `onCancel`.

`handleCancel` called `onCancel` without awaiting it, then cleared the loading
state on the next line. For an `async` onCancel the spinner was turned on and off
in the same tick, so it never appeared, and `attachPreventDefault` ran before the
callback finished, so a `preventDefault()` called inside an async onCancel came
too late to stop the dialog closing.

`onCancel` now behaves like `onConfirm`: the spinner lasts as long as the work
does, and `preventDefault()` lands in time.

The docs claimed `onCancel` showed a loading state, which was never true. They
also described the loading state as triggering when a callback "returns a
Promise". The check is `fn.constructor.name === "AsyncFunction"`, so it looks at
the declaration rather than the return value, and a promise-returning function
without the `async` keyword gets no loading state. Both pages now say so, in v1
and v2.
