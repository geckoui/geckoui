---
"@geckoui/geckoui": minor
---

Drop `react-textarea-autosize` and grow the textarea ourselves.

The library ran for every `Textarea`, `autoResize` or not — a fixed one was faked by setting
its min and max rows to the same number. That left `height: …px !important` inline on every
textarea in the app, so CSS could not size one at all, not even with `!important` of its own.

Without `autoResize` it is now a plain `<textarea>`: `rows` sets the height, nothing is
written to its `style`, CSS works and so does the drag handle. With `autoResize` it grows
between `rows` and `maxRows`, in controlled and uncontrolled fields alike, and shrinks back
when text is removed.

`TextareaProps` extends `TextareaHTMLAttributes` rather than `TextareaAutosizeProps`. The
props themselves are unchanged.
