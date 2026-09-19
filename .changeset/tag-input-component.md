---
"@geckoui/geckoui": minor
---

New `TagInput` and `TagInputOption`, with `RHFTagInput` alongside them.

```tsx
<TagInput value={tags} onChange={setTags} placeholder="Add a tag" />

<TagInput value={tags} onChange={setTags}>
  <TagInputOption value="React">React</TagInputOption>
  <TagInputOption value="Vue">Vue</TagInputOption>
</TagInput>
```

Options are declared as children, the way they are for `Select`, and filter as you type.
Anything that is not an option can still be typed in, which is what separates this from a
multiple `Select`. An option already added drops out of the list, since the chip in the field
is where it is now and its own cross is how it comes back.

`preferOption`, on by default, matches what was typed against the options ignoring case and
any extra spacing, and takes the option's own spelling: `vue` becomes `Vue`, `united  state`
becomes `United State`. Only case and spacing are folded, so `United States` stays separate
from `United State`. It also means a differently cased repeat is caught as a duplicate.

A tag `validate` turns down is not added and stays in the field to be corrected, so `value`
only ever holds tags that passed. `onReject` reports everything turned away, whether by a
rule, a duplicate or `max` — which is what makes a paste of fifty addresses usable, since the
three bad ones are named rather than silently dropped. A paste only becomes several tags when
it actually holds more than one.

The styles are its own, copied from `Select` rather than shared, so the two can look alike
without being tied together. There is no size prop: the field's height comes from the tags
in it.
