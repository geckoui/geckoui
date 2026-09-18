---
"@geckoui/geckoui": minor
---

New `Accordion` component.

```tsx
<Accordion defaultValue="shipping">
  <AccordionItem value="shipping">
    <AccordionHeader>Shipping</AccordionHeader>
    <AccordionPanel>Ships in two to three working days.</AccordionPanel>
  </AccordionItem>
</Accordion>
```

The header and the panel sit inside their item, so nothing is paired by hand. Whatever is
inside `AccordionHeader` is what it shows, so an icon or a badge needs no prop of its own.

One item opens at a time unless `multiple` is set, and `collapsible={false}` keeps one open
at all times. `variant` is `plain`, `separated` or `contained`, with `size` alongside; both
maps are open to module augmentation.

Closed panels stay in the DOM by default. That is what makes the open and close animate,
and it keeps a half filled form alive while its panel is shut. `keepMounted={false}` trades
the closing animation for a lighter DOM.

The animation runs a CSS grid row from `0fr` to `1fr` rather than a height, so it reaches
the content's real height with nothing measured in JavaScript and no `max-height` guess.
It is dropped under `prefers-reduced-motion`.
