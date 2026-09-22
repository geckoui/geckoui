---
"@geckoui/geckoui": patch
---

Stop leaking object URLs, and let RHFFilePicker be disabled.

`URL.createObjectURL` was called for every picked file and never revoked, so each file's
bytes stayed pinned for the life of the document. Replacing a selection leaked everything
picked before it, and unmounting the field leaked whatever it still held. Previews are now
revoked both as files leave the list and on unmount, in `RHFFileInput` and anything built
on the file picker.

Previews that were already on screen when the field mounted are left alone, since they were
made by someone else.

`RHFFilePicker` takes `disabled`: the browse buttons are disabled, drops are ignored, the
root carries `data-disabled`, and a custom `render` is handed `disabled` so it can draw
its own dropzone accordingly.
