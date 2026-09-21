---
"@geckoui/geckoui": minor
---

New `Stepper` and `Step` components.

```tsx
<Stepper value={step} onChange={setStep}>
  <Step value="cart" description="3 items">
    Cart
  </Step>
  <Step value="delivery">Delivery</Step>
  <Step value="payment">Payment</Step>
</Stepper>
```

It shows progress and takes you back through it; what each step holds is yours to render. A
wizard is usually one form with fields shown and hidden rather than separate panels, and when
panels are what you want, `Tabs` already is that component.

Where a step stands comes from where it sits against the current one, so a straight run needs
nothing said. `status` overrides that, which is how a step already passed can show an error
rather than a tick.

Steps behind you can be clicked and the ones ahead cannot, since skipping ahead in a wizard
usually means arriving somewhere that depends on an answer not yet given. `linear={false}`
opens it up. Without an `onChange` nothing is clickable and the keyboard walks straight past,
rather than tabbing through a row of buttons that do nothing.

`orientation` runs the steps across or down, and every colour and dimension is a
`--gecko-stepper-*` variable. It renders a named `nav` around an `ol`, with `aria-current`
on the step you are on.
