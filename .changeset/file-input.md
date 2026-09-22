---
"@geckoui/geckoui": major
---

Replace `RHFFileInput` and `RHFFilePicker` with one `FileInput`.

File upload was the only capability in the library with no base component — both old
components were React Hook Form only, behind an optional peer dependency, and `RHFFileInput`
had no `FileInput` behind it, which broke the naming convention every other pair follows.

**`FileInput` is the field, `RHFFileInput` wraps it.** Click it to browse or drop onto it;
drag and drop, directory picking and `accept` enforcement all come with the one component.

It follows the native file input where it can:

- One file by default. `multiple` gives a list, and decides whether the value is a
  `PickedFile` or a `PickedFile[]` — TypeScript narrows it from that prop alone.
- A new pick replaces what is held. `append` adds instead.
- `append`, `unique` and `max` are only accepted alongside `multiple`.

Other changes from the old pair:

- `keepOldFiles` is now `append`, `removeDuplicates` is now `unique`.
- `preview` is off by default: an object URL pins the file's bytes until revoked, so it is
  opt in, and `file.preview` is typed only when you asked for it. The URLs are revoked as
  files leave the field and when it unmounts.
- `FileWithPreview` and `FilePickerFile` are both now `PickedFile`, with `path` always
  present.
- Files turned away now reach `onReject` with a reason — `"type"`, `"duplicate"` or
  `"max"` — rather than disappearing.

**To migrate:** `RHFFilePicker` becomes `RHFFileInput multiple`, `keepOldFiles` becomes
`append`, `removeDuplicates` becomes `unique`, and add `preview` if you were reading
`file.preview`.
