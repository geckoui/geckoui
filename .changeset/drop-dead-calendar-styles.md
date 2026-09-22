---
"@geckoui/geckoui": patch
---

Remove the `.GeckoUICalendar__dual`, `.GeckoUICalendar__dual__item`, `data-position` and
`data-calendars` rules. A range calendar has rendered a single grid since v2, so nothing
matched them.
