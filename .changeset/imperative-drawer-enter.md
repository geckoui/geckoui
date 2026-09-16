---
"@geckoui/geckoui": patch
---

`Drawer.show()` now slides in, and holds the scroll lock until it has slid out.

An imperative drawer mounted with `open` already `true`, so there was no closed
frame for the CSS transition to animate away from and it appeared instantly. The
drawer now holds its open state back by one frame, which gives the transition
something to start from. A declarative `<Drawer>` that mounts already open gains
the same entrance.

The scroll lock was also released the moment `open` flipped to `false`, 300ms
before the drawer finished sliding out, so the page jumped sideways mid
animation. It is now held through the exit, matching `Dialog`.
