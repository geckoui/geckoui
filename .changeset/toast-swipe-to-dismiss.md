---
"@geckoui/geckoui": minor
---

Toasts can be swiped away.

Until now a toast could only be waited out, or closed through a `closeButton` that is off by
default — so `duration: Infinity` left no way to be rid of one at all.

`dismissible`, on by default, lets a toast be dragged away. It leaves by the edges it sits
near, so a `bottom-right` one goes right or down and a `top-left` one goes up or left; a
centred one has only the one way out, since either side would be across the screen rather
than off it. The drag settles on an axis once it has gone far enough to tell, so a diagonal
one does not jitter between the two, and dragging back inwards does nothing.

Either a long drag or a quick flick will do it. A flick still has a distance to clear, since
speed alone would read a stray twitch as a very fast swipe.

Custom toasts are swiped away the same way. They had no dismissal at all before, because
`toast.custom` renders its own node and skipped everything a plain toast gets.

A press that starts on a button inside a toast is never taken as the start of a drag, so the
action, cancel and close buttons behave as they did.

`closeButton` is still yours to turn on, and nothing turns it on for you. Worth doing for a
toast that neither closes itself nor can be swiped: swiping is pointer only, and that
combination leaves a keyboard user no way out.
