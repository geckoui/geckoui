---
"@geckoui/geckoui": minor
---

New `Slider` and `RangeSlider` components, with `RHFSlider` and `RHFRangeSlider` alongside
them.

```tsx
<Slider value={volume} onChange={setVolume} label={({ value }) => `${value}%`} />
<Slider value={volume} onChange={setVolume} onChangeEnd={save} step={5} />

<RangeSlider value={price} onChange={setPrice} min={0} max={500} step={10} minGap={50} />

<RHFSlider name="volume" />
```

Two components rather than one taking `number | [number, number]`, so `onChange` is not a
union and no call site has to narrow it. They share their internals, so the drag, the
keyboard and the marks are written once.

`onChange` fires all the way through a drag, which is what keeps the slider controlled and
following the pointer. `onChangeEnd` fires once, on release or after a key press, and is
where anything expensive belongs.

Steps are measured from `min` rather than from zero, so `min={1} step={5}` gives 1, 6, 11.
The result is rounded to the step's own precision, so `step={0.1}` gives `0.3` and not
`0.30000000000000004`.

Range thumbs stop at each other rather than swapping, so `value` is always in order, and
`minGap` holds them further apart. Each thumb reports its own room through `aria-valuemin`
and `aria-valuemax` rather than the whole track, so a screen reader says how far that thumb
can actually go.

`marks` puts ticks along the track, with a label on the ones that want one. `label` is a
bubble above the thumb while it is being dragged or focused. `color` is the same six as
Badge and `size` is `sm`, `md` or `lg`; both maps are open to module augmentation, and every
value is a `--gecko-slider-*` variable.

There is no vertical orientation.
