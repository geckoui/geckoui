---
"@geckoui/geckoui": patch
---

Floating menus inside an open `Drawer` are no longer trapped by it. The open panel kept
`translate: 0 0`, and any translate other than `none` makes an element the containing
block for `position: fixed` descendants. A `Select`, `Popover` or other floating menu with
`floatingStrategy="fixed"` was positioned against the drawer instead of the viewport and cut
off by its `overflow-y: auto`. The open panel is now `translate: none`, which still animates
from the closed position.
