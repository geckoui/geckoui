---
"@geckoui/geckoui": patch
---

Range calendars now show the days either side of the month instead of blank cells.

`Calendar` in `mode="range"` rendered an empty `<span>` for every day outside the
active month, so a month could open with a half empty first row — and, before the
week fix, an entirely empty one. Single mode had always shown those days greyed
out.

Range mode now renders them the same way, and range highlighting extends across
them, so a range running from one month into the next reads correctly instead of
stopping at the month boundary. They are selectable, like in single mode.
