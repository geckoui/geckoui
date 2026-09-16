---
"@geckoui/geckoui": patch
---

A `Drawer` that changes placement while closed now opens from the right edge.

Switching a closed drawer from `left` to `right` and opening it in the same click
made it slide in from the left and flicker. The anchor properties are not
transitioned, so the element snapped to `right-0` immediately, but it still
carried `-translate-x-full` from its left placement. That put it a full width to
the left of the right edge, and the transform then animated to zero, sliding it
across the screen from the wrong side.

The drawer now renders one untransitioned frame in the new placement's closed
position before animating open, so the slide always starts from the correct edge.

This applies to both `<Drawer>` and `Drawer.show()`, though only the declarative
form could hit it: an imperative drawer is a fresh element each time, so its
placement never changes under it.
