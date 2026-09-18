---
"@geckoui/geckoui": patch
---

`Select` no longer crashes on an object value that holds a `null`.

When a value is not in the options list, `Select` works out the trigger text from
the value itself. It walks into an object and takes the first property, and
because `typeof null === "object"` a null property fell through to
`Object.values(null)` and threw *"Cannot convert undefined or null to object"*.

```tsx
// crashed, because `id` is null and no option matches
<Select value={{ id: null, name: "Ann" }} onChange={setValue}>
  <SelectOption value="apple" label="Apple" />
</Select>
```

Nil entries are now skipped rather than printed, so the value above reads as
"Ann". An object whose properties are all nil renders nothing instead of
crashing, and a bare `null` or `undefined` comes back untouched.

Property order still decides the text when nothing is nil: `{ id: 7, name: "Ann" }`
reads as "7", unchanged. Add a `label` key to control it.

`isNil` is now a type predicate, so it narrows `null | undefined` at call sites.
