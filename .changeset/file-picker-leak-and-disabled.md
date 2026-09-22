---
"@geckoui/geckoui": patch
---

Stop leaking object URLs, and let RHFFilePicker be disabled.

`URL.createObjectURL` was called for every picked file and never revoked, so each file's
bytes stayed pinned for the life of the document. Replacing a selection leaked everything
picked before it. Previews are now revoked as files leave the list, in both `RHFFileInput`
and anything built on the file picker.

`RHFFilePicker` takes `disabled`: the browse buttons are disabled, drops are ignored, the
root carries `data-disabled`, and a custom `render` is handed `disabled` so it can draw
its own dropzone accordingly.
