---
"@geckoui/geckoui": minor
---

New `Rating` component, with `RHFRating` alongside it.

```tsx
<Rating value={score} onChange={setScore} aria-label="Score" />
<Rating value={score} onChange={setScore} precision={0.5} />
<Rating value={4.3} readOnly />
<Rating value={hearts} onChange={setHearts} color="error" icon={<HeartIcon />} />
```

Any fraction is drawn exactly, whether the rating can be picked or not, so an average of 4.3
reads as 4.3 rather than being rounded to something the reader was never told. `precision`
decides only what a click lands on — `0.5` for halves, `0.1` for tenths — and the arrow keys
step by it too, which is how a tenth stays reachable where a two pixel pointer target is not.
`readOnly` takes the interaction away and nothing else.

Picking the rating it already has sets it back to `0`, which is the only way to undo a
mis-click with a mouse. `clearable={false}` turns that off.

Built as a radio group, because a rating is a one of many choice: visually hidden radios carry
the semantics, the arrow keys and the form posting, while the icons are what is seen. Each
icon is two copies of the same glyph stacked with the filled one clipped to a width, which is
what lets a fraction be a fraction.

`icon` alone is used for both halves of each one, with only the colour between them; add
`emptyIcon` when the empty state is a different shape, like an outline against a solid.

`RHFRating` holds a number. Nothing picked is `0` rather than `undefined`, so `required` will
not catch an untouched rating and `min` is what to reach for.
