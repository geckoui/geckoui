---
"@geckoui/geckoui": minor
---

New `TimeInput` and `RHFTimeInput` components.

```tsx
<TimeInput value={time} onChange={setTime} />
<TimeInput value={time} onChange={setTime} format="hh:mm A" step={30} />
<RHFTimeInput name="startsAt" rules={{ required: "Pick a time" }} />
```

`DateInput`, `DateRangeInput` and `Calendar` had no concept of hours or minutes, so a time
could not be entered at all. These fill that in as a field of their own, next to a date
rather than inside it, so nothing already shipped changes.

`value` is always 24 hour `HH:mm`, or `HH:mm:ss` when the format asks for seconds. It sorts
and compares as it is, so a resolver can check `endsAt > startsAt` without parsing either.
`format` decides only what is on screen: a 12 hour field shows `04:05 PM` and still reports
`"16:05"`.

Clicking anywhere in the field opens a picker with one scrolling column per segment, the way
the platform's own does. `step` is the minutes between entries in the minute column, every
minute by default, and typing is unaffected by it.

`disabledTime({ hour, minute, second })` decides what cannot be chosen, always in 24 hour
numbers so one rule holds for every format. Cells grey out when nothing they could become is
allowed, reading the columns to their left as settled and leaving the ones to their right
free. That direction matters: if every column answered to every other, allowing only the
early morning and late afternoon would let a chosen `PM` grey out `01`, while a chosen `04`
greyed out `AM`, and neither could be changed without emptying the field.
