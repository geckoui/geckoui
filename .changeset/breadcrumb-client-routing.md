---
"@geckoui/geckoui": minor
---

Make client routing the documented way to use Breadcrumb.

`asChild` with your own router link is now what the docs and the skill lead with. `href` is
still there, but it renders a plain anchor that reloads the page, so it is for apps without
a router.

A crumb with an `onClick` and no `href` now renders a real `<button type="button">` rather
than a `<span>` with a handler on it, so it takes focus and answers <kbd>Enter</kbd> and
<kbd>Space</kbd>. `asChild` also forwards an `onClick` given on the item down to your
element, leaving the child's own handler alone when there is none.
