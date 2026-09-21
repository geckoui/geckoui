---
"@geckoui/geckoui": patch
---

`TagInput` puts the caret at the start of an empty field, and says when it is full.

The text box sat after the placeholder in the flow, so the caret appeared to its right rather
than where the text would begin. It is now taken out of flow while the placeholder has the
row and pinned to the field's own inset, the way `Select` does it, and goes back beside the
tags once there is one.

The field also carries `data-full` at `max`, and the text being typed is cleared when that
was the only thing standing in its way. Text turned down by `validate` is still kept, because
a typo can be corrected — no amount of correcting makes room.
