---
"@geckoui/geckoui": minor
---

Add ColorPicker, ColorInput and RHFColorInput.

`ColorPicker` is the panel — a saturation square, a hue slider and an opacity slider —
and `ColorInput` is a field that opens it in a popover, the same split as `Calendar` and
`DateInput`.

- `onChange` fires on every pointer move for a live preview; `onChangeComplete` fires once
  the drag ends, and on a keyboard move, a committed text edit or a picked swatch.
- `formats` decides what the format dropdown offers, in what order, and what it starts on.
  A single entry pins the format and drops the dropdown.
- The opacity slider is always there. Alpha reaches the value only when it is below 1, so
  a solid colour stays `#3b82f6`.
- `swatches` shows nothing until you pass some, and `eyeDropper` renders only where the
  browser has the API.
- `renderSaturation`, `renderHueThumb` and `renderAlphaThumb` draw inside the handle that
  moves, and `render` on `ColorInput` draws inside the trigger, so the drag, the keyboard
  and the aria stay with the component.
- `parseColor` and `formatColor` are exported. A colour survives a round trip to the exact
  channel.
