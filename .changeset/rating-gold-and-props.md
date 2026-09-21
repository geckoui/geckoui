---
"@geckoui/geckoui": patch
---

`Rating` is gold by default, and takes the rest of its props.

`gold` is a new key in `RatingColorMap` and the default `color`, so `<Rating />` is gold out
of the box while the six semantic colours stay there for a rating that means something else.
It is a fixed colour rather than a theme token, because gold is gold in either theme.

Deliberately a shade below a true `#FFD700`: at that lightness a filled star and an empty one
differ only in saturation, which is weak to scan and close to invisible without colour vision.
The only way to keep a true gold is to wash the empty star out to nearly white, which reads
worse on a light background than the problem it solves. Amazon's star gold avoids the trade,
so that is what this is.

`RatingProps` now extends `HTMLAttributes<HTMLDivElement>` and spreads onto the root, so
`style`, `id` and `data-*` work like they do everywhere else.
