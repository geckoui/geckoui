---
"@geckoui/geckoui": minor
---

`Step` and the slider thumb can be drawn yourself.

Both were reachable only by overriding the component's own CSS, which is a poor way to build:
the rules are the component's to change, utility classes do not reliably win against them, and
the result breaks quietly on an upgrade.

`Step` takes a `render`, handed `{ value, index, status, reachable, disabled, select, children,
description }`, and draws nothing of its own — no marker, no classes, no styles to work around.
The list item, the joint to the next step and the reachability rules stay, so it is still a
list, still joined up, and `select` still does nothing on a step you cannot get to.

`Stepper` also takes a `separator`, the way `Breadcrumb` does, for an arrow or a dot in place
of the line.

`Slider` and `RangeSlider` take a `renderThumb`, handed `{ value, index, percent, dragging,
focused }`. It draws **inside** the thumb rather than in place of it, so the drag, the arrow
keys and the `role="slider"` stay on the element that is positioned — handing over what it
looks like does not hand over how it works. The component's own circle is dropped when you do.
