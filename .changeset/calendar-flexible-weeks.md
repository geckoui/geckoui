---
"@geckoui/geckoui": major
---

`Calendar` now renders only the weeks a month needs, and gains a `fixedWeeks` prop.

Two things were tangled together before. The grid always emitted 42 cells, and on
top of that a month starting on a Sunday was given a whole extra leading week of
the previous month, pushing its 1st down to row two.

The leading week is gone. `getDay()` is already Sunday-first, matching the
`S M T W T F S` header, so the 1st now lands in the right column with no
remapping — including when it is a Sunday, where it takes the very first cell.

Row count now follows the month, between four and six weeks, which is what MUI X
and react-day-picker both do by default. Pass `fixedWeeks` for the old six-row
behaviour:

```tsx
<Calendar fixedWeeks selectedDate={date} onSelectDate={setDate} />
<DateInput fixedWeeks value={date} onChange={setDate} />
<DateRangeInput fixedWeeks value={range} onChange={setRange} />
```

`RHFDateInput` and `RHFDateRangeInput` pass it through with the rest of their props.

**Breaking:** a calendar changes height as you page between months unless you opt
in. If yours sits in a popup or next to other content and you do not want it to
resize, add `fixedWeeks`. Note that the padding is applied at the end of the grid,
so even with `fixedWeeks` the 1st stays in row one.
