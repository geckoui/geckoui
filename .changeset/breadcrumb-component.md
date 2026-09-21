---
"@geckoui/geckoui": minor
---

New `Breadcrumb` and `BreadcrumbItem` components.

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
  <BreadcrumbItem>Profile</BreadcrumbItem>
</Breadcrumb>
```

Renders a named `nav` around an `ol`, which is what a screen reader expects of a trail: the
list carries the order and the depth, so the separators are hidden from it.

The last crumb is the page you are on, so it is drawn as text rather than a link even when it
was given an `href`, and carries `aria-current="page"`. Setting `current` on another crumb
**moves** that marker rather than adding a second — the last one gives it up and goes back to
being a link. There is only ever one page you are on.

Past `maxItems` the middle folds away behind an ellipsis, which opens the folded crumbs as a
list rather than unfolding them in place. On a narrow screen unfolding a deep trail only wraps
it over three lines, which is no easier to read than the ellipsis was. The ends are what is
kept, since they are what tell you where you started and where you are.

`asChild` hands a crumb to your own element for a router link, and `separator` takes a node.
There is no icon prop: an icon is part of the crumb.

The links are the loud ones and the current page is the quiet one, which is the reverse of the
usual. You already know where you are; what a trail is for is the way back.
