---
"@geckoui/geckoui": minor
---

Drop the default tooltip `delayDuration` from 700ms to 200ms.

700ms is long enough that a tooltip reads as broken: you rest on a control, nothing happens,
and you have moved on before it arrives. 200ms still keeps it quiet while the pointer
crosses a toolbar on its way somewhere else.

Pass `delayDuration` to keep the old timing.
