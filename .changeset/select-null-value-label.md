---
"@geckoui/geckoui": patch
---

`Select` no longer crashes on an object value holding a `null`, and never renders
an empty trigger.

When a value is not in the options list, `Select` works out the trigger text from
the value itself. It walked into an object and took the first property, and
because `typeof null === "object"` a null property fell through to
`Object.values(null)` and threw *"Cannot convert undefined or null to object"*.

```tsx
// crashed, because `id` is null and no option matches
<Select value={{ id: null, name: "Ann" }} onChange={setValue}>
  <SelectOption value="apple" label="Apple" />
</Select>
```

Nil entries are now skipped rather than walked into, so that value reads as "Ann".

Anything that would leave the trigger blank falls through to the placeholder
instead of rendering an empty box — `null`, `undefined`, `""`, a whitespace only
string, `{}`, `[]`, and objects whose properties are all nil or empty.

A matching option still wins over all of this, which is how to control what an
empty or null value reads as:

```tsx
<SelectOption value="" label="All Countries" />
<SelectOption value={null} label="All Items" />
```

Property order still decides the text when nothing is nil: `{ id: 7, name: "Ann" }`
reads as "7". Give the value a `label` key to control it.

`isNil` is now a type predicate, so it narrows `null | undefined` at call sites.
