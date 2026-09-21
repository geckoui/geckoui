---
"@geckoui/geckoui": patch
---

The date pickers stack with the other floating panels, and every tier is a variable.

`DateInput` and `DateRangeInput` pinned their calendar at `z-index: 9999` inline, which put
it over `Dialog` and `Toast` and could not be changed without overriding the element's own
style. Both now sit at `50` with `Tooltip`, `Menu` and `Popover`, through
`--gecko-date-input-z` and `--gecko-date-range-input-z`.

The tiers that were hardcoded are variables too, so any of them can be retuned:
`--gecko-select-menu-z`, `--gecko-breadcrumb-z`, `--gecko-tooltip-z` and `--gecko-menu-z`.

The order is now: inline dropdowns `10`, floating panels `50`, then Drawer `1000`, Dialog
`2000` and Toast `3000`.
