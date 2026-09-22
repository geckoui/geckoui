# Changelog

## 2.0.1

### Patch Changes

- 64770ce: Bring the package README up to v2. It showed `Button variant="contained"`, which is not a
  variant, and `Alert variant="success"`, which is `color` now, and Quick Start never mounted
  `GeckoUIProvider`.

## 2.0.0

### Major Changes

- ded065f: `Alert`'s `variant` prop is renamed to `color`.

  `variant` meant two different things across the library. On `Button` and `Badge`
  it is the visual treatment — filled, outlined, soft. On `Alert` it was the
  meaning — error, warning, info. Same word, opposite axis.

  `Alert` was the odd one out and the cheapest to move, so it now matches:

  ```diff
  -<Alert variant="error" title="Upload failed" />
  +<Alert color="error" title="Upload failed" />
  ```

  `AlertVariantMap` becomes `AlertColorMap`, and the styling hook is `data-color`
  rather than `data-variant`:

  ```diff
  -.GeckoUIAlert[data-variant="critical"] { ... }
  +.GeckoUIAlert[data-color="critical"] { ... }
  ```

  This also frees `variant` on `Alert` for the treatment axis it does not have yet.
  A solid red alert and a tinted red alert are both reasonable requests, and there
  was previously nowhere to put that. When it arrives it will read the same as
  `Badge`: `variant="filled" | "soft" | "outlined"` alongside `color`.

  After this, every component that carries both axes agrees: `variant` is how it
  looks, `color` is what it means.

- 697bea2: Replace `hasError` with `aria-invalid`.

  `hasError` was a prop of the library's own doing a job the platform already has a standard
  attribute for. Worse, because it was only a prop, nothing reached assistive technology: a
  field could be red to sighted users and silent to a screen reader. `aria-invalid` was set
  nowhere in the library.

  Every component that had `hasError` now reads `aria-invalid` instead, which is both the
  styling hook and what gets announced:

  ```diff
  -<ColorInput hasError value={colour} onChange={setColour} />
  +<ColorInput aria-invalid value={colour} onChange={setColour} />
  ```

  The `RHF*` wrappers set it from the field's own error, as they did with `hasError`, so forms
  need no change.

  It also settles a split that had grown up: six components took a `hasError` prop while five
  others had their error drawn by the RHF wrapper through a `data-error` attribute and a
  stylesheet of its own. Both are now the one attribute, styled by the base component, and the
  five RHF-side stylesheets are gone.

  `Checkbox`, `Radio`, `Switch`, `Select`, `OTPInput` and `CounterInput` gained an error state
  they never had.

  The red is a theme token now, not a hardcoded `red-500`. `--color-border-invalid` and
  `--color-border-invalid-hover` retint every field that can be invalid at once, and
  `InputError`'s message and the required marker on `Label` take `--color-error` rather than
  their own reds.

- c59f162: `Calendar` now renders only the weeks a month needs, and gains a `fixedWeeks` prop.

  Two things were tangled together before. The grid always emitted 42 cells, and on
  top of that a month starting on a Sunday was given a whole extra leading week of
  the previous month, pushing its 1st down to row two.

  The leading week is gone. `getDay()` is already Sunday-first, matching the
  `S M T W T F S` header, so the 1st now lands in the right column with no
  remapping — including when it is a Sunday, where it takes the very first cell.

  Row count now follows the month, between four and six weeks, which is what MUI X
  and react-day-picker both do by default. Pass `fixedWeeks` for the old six-row
  behaviour:

  ```tsx
  <Calendar fixedWeeks selectedDate={date} onSelectDate={setDate} />
  <DateInput fixedWeeks value={date} onChange={setDate} />
  <DateRangeInput fixedWeeks value={range} onChange={setRange} />
  ```

  `RHFDateInput` and `RHFDateRangeInput` pass it through with the rest of their props.

  **Breaking:** a calendar changes height as you page between months unless you opt
  in. If yours sits in a popup or next to other content and you do not want it to
  resize, add `fixedWeeks`. Note that the padding is applied at the end of the grid,
  so even with `fixedWeeks` the 1st stays in row one.

- a4d04ab: `CounterInput` value is now a string, and it no longer eats decimal points.

  Typing `2.8` and then deleting the `8` left `"2."`, which the component pushed
  through `parseFloat` to get `2`. The parent then sent `2` back down and the
  string mirror was rewritten to `"2"`, deleting the decimal point as the user
  typed. Reaching `2.5` by editing `2.8` was impossible. `"2.0"` collapsed the
  same way, so no value with a trailing zero could be typed either.

  The value is now carried as a string and only converted to a number for the
  buttons and for clamping:

  ```diff
  -const [quantity, setQuantity] = useState(0);
  +const [quantity, setQuantity] = useState("0");

   <CounterInput value={quantity} onChange={setQuantity} />

  +// convert where you need a number
  +const total = Number(quantity || 0) * price;
  ```

  `RHFCounterInput` stores a string in the form too, so a `zod` schema needs
  `z.coerce.number()` or a string field, and `defaultValues` should hold strings:

  ```diff
   const schema = z.object({
  -  quantity: z.number().min(1)
  +  quantity: z.coerce.number().min(1)
   });

   useForm({
  -  defaultValues: { quantity: 1 }
  +  defaultValues: { quantity: "1" }
   });
  ```

  `formatNumericInput` coerces with `String()` before sanitising, so an unmigrated
  numeric default renders instead of throwing.

  Also changed:
  - Clamping to `min` / `max` now happens on blur and on the buttons, not on every
    keystroke. Typing `1` on the way to `10` is no longer snapped to the minimum.
  - New `strict`, `positiveOnly`, `maxFractionDigits` and `maxWholeDigitPlaces`
    props, matching `RHFNumberInput`.
  - Empty input is allowed while typing and settles to `""` on blur.
  - The increment and decrement buttons round to the step's precision, so stepping
    `0.1` by `0.2` gives `0.3` rather than `0.30000000000000004`.
  - With `positiveOnly`, stepping down from `0` stays at `0` instead of producing
    `-1` and formatting it back to `1`.
  - `inputMode` is `decimal` rather than `numeric`, so mobile keyboards offer the
    decimal point.

  The sanitising logic that `RHFNumberInput` already used is now shared as the
  exported `formatNumericInput` utility, and both components use it.

- 1732f5d: Replace `RHFFileInput` and `RHFFilePicker` with one `FileInput`.

  File upload was the only capability in the library with no base component — both old
  components were React Hook Form only, behind an optional peer dependency, and `RHFFileInput`
  had no `FileInput` behind it, which broke the naming convention every other pair follows.

  **`FileInput` is the field, `RHFFileInput` wraps it.** Click it to browse or drop onto it;
  drag and drop, directory picking and `accept` enforcement all come with the one component.

  It follows the native file input where it can:
  - One file by default. `multiple` gives a list, and decides whether the value is a
    `PickedFile` or a `PickedFile[]` — TypeScript narrows it from that prop alone.
  - A new pick replaces what is held. `append` adds instead.
  - `append`, `unique` and `max` are only accepted alongside `multiple`.

  Other changes from the old pair:
  - `keepOldFiles` is now `append`, `removeDuplicates` is now `unique`.
  - `preview` is off by default: an object URL pins the file's bytes until revoked, so it is
    opt in, and `file.preview` is typed only when you asked for it. The URLs are revoked as
    files leave the field and when it unmounts.
  - `FileWithPreview` and `FilePickerFile` are both now `PickedFile`, with `path` always
    present.
  - Files turned away now reach `onReject` with a reason — `"type"`, `"duplicate"` or
    `"max"` — rather than disappearing.

  **To migrate:** `RHFFilePicker` becomes `RHFFileInput multiple`, `keepOldFiles` becomes
  `append`, `removeDuplicates` becomes `unique`, and add `preview` if you were reading
  `file.preview`.

- 54781f8: Replace `GeckoUIPortal` with `GeckoUIProvider` — a context-aware, stackable overlay system.

  ## Breaking change

  `<GeckoUIPortal />` (self-closing, placed once at the root) is removed. Replace it with
  `<GeckoUIProvider>` wrapping your app's component tree:

  **Before:**

  ```tsx
  // app/layout.tsx
  import { GeckoUIPortal } from "@geckoui/geckoui";

  export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          {children}
          <GeckoUIPortal />
        </body>
      </html>
    );
  }
  ```

  **After:**

  ```tsx
  // app/layout.tsx
  import { GeckoUIProvider } from "@geckoui/geckoui";

  export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          <GeckoUIProvider>{children}</GeckoUIProvider>
        </body>
      </html>
    );
  }
  ```

  Place `GeckoUIProvider` **below** your own context providers so that overlay content
  opened via `Dialog.show()` / `Drawer.show()` can read those contexts.

  ## What changed
  - `Dialog.show()` / `Drawer.show()` now push onto a shared overlay stack instead of
    mounting a detached `createRoot`. This means:
    - React context (e.g. `AuthContext`, `ThemeContext`) flows into overlay content.
    - Multiple dialogs/drawers can be open simultaneously; they stack visually.
    - `show()` returns an `id` string. Pass it to `dismiss(id)` to close a specific overlay;
      call `dismiss()` with no argument to close the topmost overlay.
  - Per-overlay Esc and click-outside only act on the **topmost** entry.
  - `ConfirmDialog` works unchanged — it wraps `Dialog`.
  - Toast (`sonner`) is now hosted inside `GeckoUIProvider` and works identically.
  - `GeckoUIPortalProps` is removed; pass toast options as `<GeckoUIProvider toastOptions={...}>`.

  ## Dialog now works declaratively too

  `Dialog` is a component as well as an imperative API, matching `Drawer`:

  ```tsx
  const [open, setOpen] = useState(false);

  <Dialog open={open} onClose={() => setOpen(false)}>
    <h2>Hello</h2>
  </Dialog>;
  ```

  `Dialog.show()` / `Dialog.dismiss()` keep working unchanged. The declarative form renders in
  place and does not need `GeckoUIProvider`.

  ## `handleClose` is renamed to `onClose`

  `Drawer`'s `handleClose` prop is now `onClose`, matching React convention and the rest of the
  library (`onChange`, `onSubmit`, `onConfirm`). The new declarative `Dialog` uses `onClose` too.
  There is no alias — rename every usage:

  ```diff
  -<Drawer open={open} handleClose={() => setOpen(false)} />
  +<Drawer open={open} onClose={() => setOpen(false)} />
  ```

  The same applies to the options passed to `Drawer.show(node, { onClose })`.

  ## Prop renames for consistency

  | Component                 | Before         | After                                                                |
  | ------------------------- | -------------- | -------------------------------------------------------------------- |
  | `Drawer`, `Dialog`        | `handleClose`  | `onClose`                                                            |
  | `Dialog`                  | `dismissOnEsc` | `dismissOnEscape` (matches `Drawer`)                                 |
  | `CounterInput`            | `editable`     | `allowTyping` (it sat next to `readOnly` and read like its opposite) |
  | `Checkbox`, `RHFCheckbox` | `partial`      | `indeterminate` (the standard DOM name)                              |

  ## Other behaviour changes
  - Dialogs always render above drawers (z-index `2000` vs `1000`). Stacked overlays get an
    explicit per-entry z-index instead of relying on DOM insertion order, and the topmost overlay
    — the one that owns Esc and click-outside — is picked by stacking order, not open order.
  - `Dialog.dismiss()` and `Drawer.dismiss()` with no argument now only close overlays of their
    own type. Previously either one closed the topmost overlay, whatever it was.
  - Clicking inside a dialog no longer dismisses it. Dismissal is driven by the dialog's own
    backdrop rather than a document-level click-outside listener, so popups portalled out of the
    dialog (`Select`, `Menu`, date pickers) no longer close it. Drag-selecting text out past the
    edge of the dialog no longer closes it either.
  - `Drawer.show(node, { onClose })` calls your `onClose` again. The provider used to overwrite
    it, so it was silently dropped.
  - Clicking the backdrop closes a `<Drawer>` again when `allowClickOutside` is `false`. The
    backdrop click handler had been dropped, which left the default drawer closable only by Esc.
  - `Dialog.show()` / `Drawer.show()` log an error when no `<GeckoUIProvider>` is mounted, instead
    of doing nothing. When more than one provider is mounted, the innermost one owns the overlay
    stack and the `<Toaster>` and the others render nothing, with a warning so accidental
    duplicates are easy to spot.
  - Overlays give up topmost status as soon as they start closing, so the overlay underneath
    responds to Esc immediately instead of after the 300ms exit animation.
  - `<Drawer>` accepts a `style` prop, and the drawer panel carries `role="dialog"`.
  - `useClickOutside` (exported) keeps one stable listener instead of re-subscribing on every
    render. It now reads the latest handler and refs at event time, so passing an inline handler
    or a freshly built refs array no longer detaches and reattaches the listener. Behaviour for
    callers is unchanged; only the subscription churn is gone.

  ## Still not handled

  Overlays have no focus trap and do not restore focus to the trigger on close.

- 9fa93c3: Toast is now built in house. `sonner` is no longer a dependency.

  The API is unchanged for normal use: `toast()`, `toast.success` / `.error` /
  `.warning` / `.info` / `.loading`, `toast.promise`, `toast.custom` and
  `toast.dismiss(id?)` all behave as before, and `<GeckoUIProvider>` still renders
  the stacks.

  ## Removed options

  `toastOptions` no longer accepts these sonner-specific settings:

  | Removed      | Why                                                                              |
  | ------------ | -------------------------------------------------------------------------------- |
  | `richColors` | Variant colours are the default now, so there is nothing to opt into             |
  | `theme`      | Toasts read the library's own colour variables and follow your theme             |
  | `expand`     | The collapsed stack that expanded on hover is gone; the stack is always expanded |

  `toastOptions.className` and `toastOptions.style` are renamed to `toastClassName`
  and `toastStyle`, since `className` now targets the stack element. `offset` is a
  number of pixels rather than a string.

  ## Dismissing a promise toast

  Dismissing the loading toast now cancels the follow-up, so the success or error
  toast no longer appears over a dismissal. Pushing to the id yourself still shows
  it, because that is an explicit request rather than the library finishing its own
  lifecycle.

  ## Styling

  Every value is a CSS custom property, so the whole system can be restyled without
  overriding a class: `--gecko-toast-width`, `--gecko-toast-offset`,
  `--gecko-toast-bg`, `--gecko-toast-fg`, `--gecko-toast-accent`,
  `--gecko-toast-radius`, `--gecko-toast-padding`, `--gecko-toast-shadow`,
  `--gecko-toast-duration` and more.

  Variant colours come from new shared semantic tokens, `--color-success`,
  `--color-error`, `--color-warning` and `--color-info`, so overriding one updates
  every component that reports status.

  Per-part class hooks match the rest of the library: `iconClassName`,
  `messageClassName`, `descriptionClassName`, `actionClassName`, `cancelClassName`
  and `closeClassName`.

  ## Behaviour
  - Hovering a stack pauses every timer in it, so a toast cannot expire while you
    are reading the one above it.
  - Replacing a toast by id restarts its timer.
  - Errors use `role="alert"` with `aria-live="assertive"`; everything else uses
    `status` and `polite`.
  - `prefers-reduced-motion` drops the scale animation.
  - The message and description are rendered in `div` elements, not `p`. Both accept
    arbitrary `ReactNode`, and a caller passing a `div` or another `p` into a `p`
    produces invalid markup and a hydration error.

- d45c40e: The red error border now actually renders on `RHFInput`, `RHFSelect`,
  `RHFCounterInput` and `RHFOTPInput`.

  Each of these styles its error state as `.GeckoUIRHFX[data-error]`, but the
  attribute never reached the element carrying that class:
  - `RHFInput` put the class on the wrapping `<label>` and `data-error` on the
    inner `<input>`.
  - `RHFSelect`, `RHFCounterInput` and `RHFOTPInput` passed `data-error` to a
    component that never forwarded it to the DOM at all, so it vanished.

  So the message appeared but the field kept its normal border. `RHFTextarea` was
  the only one that worked, because there the class and the attribute are on the
  same element.

  `data-error` now lands on the element that carries the class, next to the
  `data-state` and `data-size` attributes the styles already key off.

  **Breaking:** `data-*` attributes passed to `Input` and `CounterInput` now land
  on the root element instead of the inner `<input>`. This matches `className`,
  which already targets the root, and the state attributes that live there. If you
  relied on `data-*` reaching the inner input — a `data-testid` used with
  `getByTestId`, say — point it at the root or use `inputClassName` instead.

  ```diff
  -<label class="GeckoUIInput GeckoUIRHFInput">
  -  <input class="GeckoUIInput__input" data-error="true">
  +<label class="GeckoUIInput GeckoUIRHFInput" data-error="true">
  +  <input class="GeckoUIInput__input">
   </label>
  ```

- 087aa5a: `RHFCheckbox`, `RHFRadio` and `RHFSwitch` call `onBlur` with no arguments.

  They were the only wrappers still forwarding the native `FocusEvent`, while every other one
  hands back the value or nothing. Read the value from the form instead:

  ```diff
  -<RHFSwitch name="on" onBlur={(e) => log(e.target.checked)} />
  +<RHFSwitch name="on" onBlur={() => log(getValues("on"))} />
  ```

- d720eae: `BaseDateRangeInput` is no longer exported.

  It was public by accident. Its sibling `BaseDateInput` was never exported, it
  appeared in no documentation page in any version, and it exists only as the
  internal implementation that `DateRangeInput` builds on.

  Use `DateRangeInput`, which wraps it and adds the calendar popup:

  ```diff
  -import { BaseDateRangeInput } from "@geckoui/geckoui";
  +import { DateRangeInput } from "@geckoui/geckoui";
  ```

  The `DateRange` type is unaffected — it is still exported, from `DateRangeInput`.
  `DateRangeInputProps` still extends the base props, which remain in the published
  types as an internal declaration, so prop typing is unchanged.

### Minor Changes

- de740e8: New `Accordion` component.

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

- 799965d: `Alert` variant colours now come from the shared semantic tokens.

  It previously hardcoded `text-red-500`, `bg-orange-500` and friends, so the
  theming story did not reach it: overriding your CSS variables changed every other
  component but left alerts on the stock Tailwind palette.

  Each variant now sets one `--gecko-alert-accent`, drawn from `--color-error`,
  `--color-warning`, `--color-info` and `--color-success`. Those are the same
  tokens `Toast` uses, so a single override updates both:

  ```css
  :root {
    --color-error: oklch(0.6 0.22 25);
  }
  ```

  The alert also exposes `--gecko-alert-bg`, `--gecko-alert-border`,
  `--gecko-alert-accent` and `--gecko-alert-radius`, so a variant can be restyled
  without overriding a class:

  ```css
  .GeckoUIAlert[data-variant="error"] {
    --gecko-alert-bg: var(--color-error);
    --gecko-alert-accent: white;
  }
  ```

  Variant colours shift very slightly, since the tokens are not pixel-identical to
  the Tailwind values they replace.

  The tokens are lifted in dark mode, since the light values sit too dark on a dark
  surface. Override them inside `.dark` as well if you change them.

- b014dec: New `Avatar` and `AvatarGroup` components.

  ```tsx
  <Avatar name="Ada Lovelace" src={user.image} />
  <Avatar name="Ada Lovelace" size="lg" color="primary" />
  <Avatar shape="rounded" fallback={<BotIcon />} />
  ```

  It shows, in order: the image, then `fallback`, then the initials from `name`, then a person
  icon. An image that fails to load falls through the same chain, and a new `src` gets a fresh
  attempt, so one dead URL does not hide every image after it in a list.

  `onClick` turns it into a button: it joins the tab order, answers Enter and Space, and takes a
  focus ring, so a clickable avatar does not have to be wrapped in one.

  ```tsx
  <AvatarGroup max={3}>
    <Avatar name="Ada Lovelace" />
    <Avatar name="Grace Hopper" />
    <Avatar name="Alan Turing" />
    <Avatar name="Katherine Johnson" />
  </AvatarGroup>
  ```

  Avatars overlap, each sitting over the one after it. `size` and `shape` on the group apply to
  everything inside, and an avatar can still set its own.

  Hovering an avatar lifts it and names it; hovering the count opens an overlay listing the rest.
  `renderOverflow` fills that overlay, receiving `avatars` — the props of everyone past `max` —
  so it can show anything, not only avatars. `interactive={false}` drops all of it and leaves a
  static row.

  `size` is `xs` to `xl`, `shape` is `circle`, `rounded` or `square`, and `color` is the same six
  as Badge. Every map is open to module augmentation, and every value is a `--gecko-avatar-*`
  variable. The lift is dropped under `prefers-reduced-motion`.

- 134061f: New `Badge` component: a small inline label for status, counts and categories.

  Two axes work independently. `variant` is how the badge is filled, `color` is what
  it means, so a success badge can be solid, tinted or outlined without changing
  what it says.

  ```tsx
  <Badge>Draft</Badge>
  <Badge color="success">Active</Badge>
  <Badge variant="filled" color="error">Failed</Badge>
  <Badge variant="outlined" color="info" size="sm">Beta</Badge>
  <Badge color="success" dot>Live</Badge>
  <Badge shape="pill" color="primary">New</Badge>
  ```

  | Prop      | Values                                                      | Default   |
  | --------- | ----------------------------------------------------------- | --------- |
  | `variant` | `filled`, `soft`, `outlined`                                | `soft`    |
  | `color`   | `default`, `primary`, `success`, `error`, `warning`, `info` | `default` |
  | `size`    | `sm`, `md`, `lg`                                            | `md`      |
  | `shape`   | `rounded`, `pill`, `square`                                 | `rounded` |
  | `dot`     | `boolean`                                                   | `false`   |
  | `icon`    | `ReactNode \| FC`                                           | -         |

  All four axes are extensible maps, so a consumer can add keys through module
  augmentation and style them with CSS alone:

  ```tsx
  declare module "@geckoui/geckoui" {
    interface BadgeColorMap {
      brand: unknown;
    }
  }
  ```

  ```css
  .GeckoUIBadge[data-color="brand"] {
    --gecko-badge-accent: oklch(0.62 0.21 320);
  }
  ```

  Colours come from the shared `--color-success`, `--color-error`, `--color-warning`
  and `--color-info` tokens, so overriding one updates Badge, Alert and Toast
  together. The badge also exposes `--gecko-badge-accent`, `--gecko-badge-on-accent`,
  `--gecko-badge-radius`, `--gecko-badge-soft-mix` and `--gecko-badge-outline-mix`.

  `icon` is rendered exactly as given, with no wrapper element and no injected
  classes, so styling lives where the icon is defined.

  The text on a `filled` badge follows `--color-surface-primary`, which is light in
  light mode and dark in dark mode, so it stays readable as the accents invert.
  `primary` is the exception and keeps `--color-text-on-primary`, because the
  primary scale is not lifted in dark mode.

- c590095: Make client routing the documented way to use Breadcrumb.

  `asChild` with your own router link is now what the docs and the skill lead with. `href` is
  still there, but it renders a plain anchor that reloads the page, so it is for apps without
  a router.

  A crumb with an `onClick` and no `href` now renders a real `<button type="button">` rather
  than a `<span>` with a handler on it, so it takes focus and answers <kbd>Enter</kbd> and
  <kbd>Space</kbd>. `asChild` also forwards an `onClick` given on the item down to your
  element, leaving the child's own handler alone when there is none.

- 451c31c: New `Breadcrumb` and `BreadcrumbItem` components.

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

- d4bc74a: `Checkbox` now behaves like a native checkbox in the indeterminate state.

  `indeterminate` only swapped which icon was rendered. The icon was hidden unless
  the input matched `:checked`, and the box only filled on `:checked`, so setting
  `indeterminate` on its own displayed nothing — you had to pass `checked` as well
  just to make the dash appear.

  That forced the wrong semantics on the common case. A "select all" box with some
  rows selected has to be unchecked, so that clicking it selects everything rather
  than clearing it, and so the submitted value is right. Passing `checked` to get
  the dash inverted that.

  The component now writes the native `indeterminate` DOM property to the input,
  and the styles respond to `:indeterminate` as well as `:checked`:

  ```diff
   <Checkbox
  -  checked={someSelected}
  +  checked={allSelected}
     indeterminate={someSelected && !allSelected}
     onChange={handleSelectAll}
   />
  ```

  `indeterminate` is now independent of `checked`, matching the platform:

  | `checked` | `indeterminate` | Shows     |
  | --------- | --------------- | --------- |
  | `false`   | `false`         | empty box |
  | `false`   | `true`          | dash      |
  | `true`    | `false`         | tick      |
  | `true`    | `true`          | dash      |

  Because the property is set on the element, `:indeterminate` now matches in CSS
  and assistive tech reports the mixed state. The same applies to `RHFCheckbox`,
  which forwards the prop.

  The property is re-applied on every render, since the browser clears it itself
  when the box is clicked. Without that, a controlled checkbox that keeps
  `indeterminate` set would lose the dash after the first click.

- acd38dc: Add ColorPicker, ColorInput and RHFColorInput.

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

- 7debef2: New `Popover` component.

  ```tsx
  <Popover placement="bottom-start" arrow>
    <PopoverTrigger>
      <Button>Filters</Button>
    </PopoverTrigger>

    <PopoverContent>
      <FilterForm />
    </PopoverContent>
  </Popover>
  ```

  `PopoverTrigger` uses its child as the trigger rather than wrapping it, so the button keeps
  its own tag, styling and click handler. `PopoverContent` holds anything — a form, a list, a
  chart.

  `usePopover()` gives anything inside the panel `open`, `close()`, `toggle()` and `setOpen()`,
  so a Cancel button or a form submit can shut it.

  Focus moves into the panel when it opens and returns to the trigger when it closes, so it
  works from the keyboard. Escape closes it even from inside a text field, which is where it
  differs from `Dialog` and `Drawer` — those leave Escape alone while you type, and a popover
  holding a form should not.

  The panel renders inline rather than in a portal, so it stays inside a dialog and keeps
  React context. Position with `placement` and `offset`; it flips and shifts to stay on
  screen. `arrow` adds a pointer, off by default.

  Which to reach for: `Tooltip` for a label on hover, `Popover` for a panel you click open,
  `Menu` for a list of actions.

- eff3c75: New `Progress` component.

  ```tsx
  <Progress value={40} label={({ percent }) => `${percent}%`} />
  <Progress value={3} max={7} label={({ value, max }) => `${value} of ${max} files`} />
  <Progress />
  <Progress value={100} color="success" size="lg" />
  ```

  Leaving `value` out is what makes it indeterminate, so there is no second prop that can
  contradict the first. It also drops `aria-valuenow`, which is what tells a screen reader the
  value is unknown rather than zero. `value={0}` is a known value and draws an empty bar.

  `value` is clamped into range, and the `label` function is handed the clamped number, so it
  cannot report more than the bar shows. `percent` is rounded to whole numbers and drives the
  bar width too, so the number and the bar never disagree. A `label` node shows while the value
  is unknown; a `label` function is only called when there is a value to report.

  `color` is the same six as Badge, defaulting to `primary`, and `size` is `sm`, `md` or `lg`.
  Both maps are open to module augmentation, and every value is a `--gecko-progress-*` variable.

  Under `prefers-reduced-motion` the indeterminate bar becomes a full-width pulse rather than
  stopping, which would read as stalled work.

- f6ef1a4: New `Rating` component, with `RHFRating` alongside it.

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

- e8e0953: `Step` and the slider thumb can be drawn yourself.

  Both were reachable only by overriding the component's own CSS, which is a poor way to build:
  the rules are the component's to change, utility classes do not reliably win against them, and
  the result breaks quietly on an upgrade.

  `Step` takes a `render`, handed `{ value, index, status, reachable, disabled, select, children,
description }`, and draws nothing of its own — no marker, no classes, no styles to work around.
  The list item, the joint to the next step and the reachability rules stay, so it is still a
  list, still joined up, and `select` still does nothing on a step you cannot get to.

  `Stepper` also takes a `separator`, the way `Breadcrumb` does, for an arrow or a dot in place
  of the line.

  `Slider` and `RangeSlider` take a `renderThumb`, handed `{ value, index, percent, dragging,
focused }`. It draws **inside** the thumb rather than in place of it, so the drag, the arrow
  keys and the `role="slider"` stay on the element that is positioned — handing over what it
  looks like does not hand over how it works. The component's own circle is dropped when you do.

- bf01f5a: `Dialog` and `Drawer` now lock page scrolling while they are open, without the
  sideways jump.

  Setting `overflow: hidden` on the body removes the scrollbar, which widens the
  viewport and shifts everything right by its width. The lock measures that width
  and pays it back as padding, so nothing moves:

  ```ts
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  ```

  It is reference counted, so stacked overlays do not fight over it. Opening a
  dialog on top of a drawer locks once, and the page only unlocks when the last
  overlay has finished closing. The lock is held through the exit animation, since
  releasing it early makes the page jump while the overlay is still fading.

  While a lock is held, `--gecko-scrollbar-width` is set on the root element so
  elements pinned to the right edge can compensate as well. Right aligned toast
  stacks already do.

  A `Drawer` with `allowClickOutside` does not lock, because that drawer
  deliberately leaves the page usable behind it.

  The hook is exported as `useScrollLock(enabled)` if you need the same behaviour
  for your own overlays.

  Known gap: iOS Safari ignores `overflow: hidden` on the body, so the page behind
  can still be dragged there. Desktop browsers and Android are unaffected.

- cec98b2: New `Skeleton` component.

  ```tsx
  <Skeleton />
  <Skeleton lines={3} />
  <Skeleton shape="circle" className="size-12" />
  <Skeleton shape="rounded" className="h-24 w-40" />
  ```

  There are no `width` and `height` props. Size it through `className` the way you size the
  element it stands in for, so the two cannot drift apart. A `text` skeleton takes its height
  from the current font size, and `lines` draws a paragraph with the last line short, which is
  what makes a stack of bars read as text rather than as a table.

  `loading` lets it wrap the real thing instead of leaving a ternary at every call site:

  ```tsx
  <Skeleton loading={isLoading} lines={2}>
    <p>{user.bio}</p>
  </Skeleton>
  ```

  Children are never rendered while loading, so nothing inside has to guard against data that
  has not arrived yet. Once loading is over the wrapper is gone too, leaving only your own
  markup.

  `shape` is `text`, `rounded` or `circle` and `animation` is `pulse`, `wave` or `none`; both
  maps are open to module augmentation. Every value is a `--gecko-skeleton-*` variable. Both
  animations are dropped under `prefers-reduced-motion`.

  It is marked `aria-busy` with no role of its own, so a page of placeholders does not announce
  itself once per placeholder.

- f683417: New `Slider` and `RangeSlider` components, with `RHFSlider` and `RHFRangeSlider` alongside
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

- f20608f: New `Stepper` and `Step` components.

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

- f5e91d9: New `Tabs` component, for switching between panels or for navigation.

  ```tsx
  <Tabs defaultValue="profile" variant="underline">
    <TabList>
      <Tab value="profile">Profile</Tab>
      <Tab value="billing">
        Billing <Badge color="error">2</Badge>
      </Tab>
    </TabList>

    <TabPanel value="profile">
      <ProfileForm />
    </TabPanel>
    <TabPanel value="billing">
      <BillingForm />
    </TabPanel>
  </Tabs>
  ```

  Four parts, paired by `value`. Whatever sits inside `Tab` is what the tab shows, so an
  icon or a badge needs no prop of its own. `TabList` can live anywhere in the layout — a
  sticky header with the panels scrolling below it, say.

  `variant` is `underline`, `segmented` or `soft`, with `size`, `orientation` and
  `fullWidth` alongside. All of it is driven by `--gecko-tabs-*` variables and
  `data-*` attributes, and `TabsVariantMap` and `TabsSizeMap` are open to module
  augmentation, so a new variant is a type declaration and a CSS block.

  The strip scrolls sideways when the tabs outgrow it, centring the selected one. Arrow
  keys move focus along the strip without changing the panel; Enter or Space selects.
  Hidden panels unmount unless you pass `keepMounted`, which is worth it for a panel
  holding a half filled form.

  Tabs that change the URL are navigation rather than tabs, and a screen reader treats the
  two differently. `as="nav"` renders a `nav` of links with `aria-current="page"` instead
  of a tablist, and `asChild` hands the wiring to your own link:

  ```tsx
  <Tabs as="nav" value={pathname}>
    <TabList>
      <Tab value="/settings/profile" asChild>
        <Link href="/settings/profile">Profile</Link>
      </Tab>
    </TabList>
  </Tabs>
  ```

- 5aaab67: New `TagInput` and `TagInputOption`, with `RHFTagInput` alongside them.

  ```tsx
  <TagInput value={tags} onChange={setTags} placeholder="Add a tag" />

  <TagInput value={tags} onChange={setTags}>
    <TagInputOption value="React">React</TagInputOption>
    <TagInputOption value="Vue">Vue</TagInputOption>
  </TagInput>
  ```

  Options are declared as children, the way they are for `Select`, and filter as you type.
  Anything that is not an option can still be typed in, which is what separates this from a
  multiple `Select`. An option already added drops out of the list, since the chip in the field
  is where it is now and its own cross is how it comes back.

  `preferOption`, on by default, matches what was typed against the options ignoring case and
  any extra spacing, and takes the option's own spelling: `vue` becomes `Vue`, `united  state`
  becomes `United State`. Only case and spacing are folded, so `United States` stays separate
  from `United State`. It also means a differently cased repeat is caught as a duplicate.

  A tag `validate` turns down is not added and stays in the field to be corrected, so `value`
  only ever holds tags that passed. `onReject` reports everything turned away, whether by a
  rule, a duplicate or `max` — which is what makes a paste of fifty addresses usable, since the
  three bad ones are named rather than silently dropped. A paste only becomes several tags when
  it actually holds more than one.

  The styles are its own, copied from `Select` rather than shared, so the two can look alike
  without being tied together. There is no size prop: the field's height comes from the tags
  in it.

- 06b3f61: Drop `react-textarea-autosize` and grow the textarea ourselves.

  The library ran for every `Textarea`, `autoResize` or not — a fixed one was faked by setting
  its min and max rows to the same number. That left `height: …px !important` inline on every
  textarea in the app, so CSS could not size one at all, not even with `!important` of its own.

  Without `autoResize` it is now a plain `<textarea>`: `rows` sets the height, nothing is
  written to its `style`, CSS works and so does the drag handle. With `autoResize` it grows
  between `rows` and `maxRows`, in controlled and uncontrolled fields alike, and shrinks back
  when text is removed.

  It reads the element's own computed box each time it fits, so it follows whatever font,
  size, line height and padding you give it, and refits when a web font lands — with
  `font-display: swap` the first fit would otherwise measure the fallback.

  `TextareaProps` extends `TextareaHTMLAttributes` rather than `TextareaAutosizeProps`. The
  props themselves are unchanged.

  A field with `autoResize` no longer offers the drag handle. It owns its own height, so a
  manual resize was undone by the next keystroke. `resize` is set in CSS against
  `[data-auto-resize]`, so it can be overridden.

- 70ed06d: New `TimeInput` and `RHFTimeInput` components.

  ```tsx
  <TimeInput value={time} onChange={setTime} />
  <TimeInput value={time} onChange={setTime} format="hh:mm A" step={30} />
  <RHFTimeInput name="startsAt" rules={{ required: "Pick a time" }} />
  ```

  `DateInput`, `DateRangeInput` and `Calendar` had no concept of hours or minutes, so a time
  could not be entered at all. These fill that in as a field of their own, next to a date
  rather than inside it, so nothing already shipped changes.

  `value` is always 24 hour `HH:mm`, or `HH:mm:ss` when the format asks for seconds. It sorts
  and compares as it is, so a resolver can check `endsAt > startsAt` without parsing either.
  `format` decides only what is on screen: a 12 hour field shows `04:05 PM` and still reports
  `"16:05"`.

  Clicking anywhere in the field opens a picker with one scrolling column per segment, the way
  the platform's own does. `step` is the minutes between entries in the minute column, every
  minute by default, and typing is unaffected by it.

  `disabledTime({ hour, minute, second })` decides what cannot be chosen, always in 24 hour
  numbers so one rule holds for every format. Cells grey out when nothing they could become is
  allowed, reading the columns to their left as settled and leaving the ones to their right
  free. That direction matters: if every column answered to every other, allowing only the
  early morning and late afternoon would let a chosen `PM` grey out `01`, while a chosen `04`
  greyed out `AM`, and neither could be changed without emptying the field.

- 34393f6: Toasts can be swiped away.

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

- f760cdb: Drop the default tooltip `delayDuration` from 700ms to 200ms.

  700ms is long enough that a tooltip reads as broken: you rest on a control, nothing happens,
  and you have moved on before it arrives. 200ms still keeps it quiet while the pointer
  crosses a toolbar on its way somewhere else.

  Pass `delayDuration` to keep the old timing.

### Patch Changes

- 8afe097: `asChild`-style triggers no longer crash the page when they cannot merge into their child.

  `Tooltip` (with `triggerAsChild`), `Tab` (with `asChild`) and `PopoverTrigger` used
  `Children.only`, which throws. Under React Server Components a child does not always reach
  a client component as an element: it can arrive as an unresolved lazy chunk, and the throw
  took down the whole route rather than the one trigger. This showed up on the Tooltip docs
  page as `React.Children.only expected to receive a single React element child.`

  They now fall back to their wrapper element when there is no single element to clone.
  `Tooltip` renders its `GeckoUITooltip__trigger` span, `Tab` renders its button, and
  `PopoverTrigger` wraps the child in a span instead of rendering nothing.

- c59f162: Range calendars now show the days either side of the month instead of blank cells.

  `Calendar` in `mode="range"` rendered an empty `<span>` for every day outside the
  active month, so a month could open with a half empty first row — and, before the
  week fix, an entirely empty one. Single mode had always shown those days greyed
  out.

  Range mode now renders them the same way, and range highlighting extends across
  them, so a range running from one month into the next reads correctly instead of
  stopping at the month boundary. They are selectable, like in single mode.

- 50e53bc: `ConfirmDialog` now awaits `onCancel`.

  `handleCancel` called `onCancel` without awaiting it, then cleared the loading
  state on the next line. For an `async` onCancel the spinner was turned on and off
  in the same tick, so it never appeared, and `attachPreventDefault` ran before the
  callback finished, so a `preventDefault()` called inside an async onCancel came
  too late to stop the dialog closing.

  `onCancel` now behaves like `onConfirm`: the spinner lasts as long as the work
  does, and `preventDefault()` lands in time.

  The docs claimed `onCancel` showed a loading state, which was never true. They
  also described the loading state as triggering when a callback "returns a
  Promise". The check is `fn.constructor.name === "AsyncFunction"`, so it looks at
  the declaration rather than the return value, and a promise-returning function
  without the `async` keyword gets no loading state. Both pages now say so, in v1
  and v2.

- 5aaab67: `DateInput` and `DateRangeInput` keep their red border while they are being typed into.

  `[data-state="enabled"]:focus-within` outweighs a bare `[data-error]`, so the border went
  back to blue the moment the field was used — which is exactly when the error matters most.
  The focused state is now stated for the error too.

- 09de279: Library warnings are now development only, and no longer crash a page without a
  bundler.

  Every `console.warn` and `console.error` in the library now goes through a shared
  `devWarn`, which prefixes `[GeckoUI]` and stays silent when `NODE_ENV` is
  `production`. That covers the missing provider, several providers, invalid calendar
  dates, `RHFInputGroup` misuse, and a new one: a `Select` given a value that matches
  no `SelectOption`.

  Two things made this fiddly, and both are fixed:
  - **The build baked the value in.** With tsup's `platform: "browser"`, esbuild
    replaced `process.env.NODE_ENV` while building the library, so the check became
    `if (true)` and the warnings fired in every consumer's production build. A
    `define` now opts out, leaving the consumer's bundler to resolve it.
  - **`process` may not exist at all.** Somewhere that does not replace the value —
    raw browser ESM, no bundler — the bare identifier threw
    `ReferenceError: process is not defined`. The read is now wrapped, and an unknown
    environment counts as development: a warning nobody sees beats a crash.

  The warning text still ships (about 1kb), it just never prints in production.

- 2a0c270: The dialog panel no longer clips floating children.

  `.GeckoUIDialog__dialog` was `overflow: hidden`, so a `Select` menu or `Menu`
  dropdown opened inside a dialog was cut off at the dialog edge. Those menus are
  positioned by floating-ui but still render inline in the DOM, so the dialog's
  clipping applied to them.

  The panel is now `overflow: visible`. Nothing needed the clipping: a tall dialog
  scrolls on `.GeckoUIDialog`, which is the full viewport, not on the panel.

  If you relied on the panel clipping its own content to the rounded corners, set
  it back on your own content:

  ```css
  .GeckoUIDialog__dialog > .my-media {
    overflow: hidden;
    border-radius: inherit;
  }
  ```

- fcb9bbe: Put `Dialog` and `Drawer` z-index behind `--gecko-dialog-z` and `--gecko-drawer-z`, so
  every tier in the stacking order is retunable like the rest.
- 4a3b569: A `Drawer` that changes placement while closed now opens from the right edge.

  Switching a closed drawer from `left` to `right` and opening it in the same click
  made it slide in from the left and flicker. The anchor properties are not
  transitioned, so the element snapped to `right-0` immediately, but it still
  carried `-translate-x-full` from its left placement. That put it a full width to
  the left of the right edge, and the transform then animated to zero, sliding it
  across the screen from the wrong side.

  The drawer now renders one untransitioned frame in the new placement's closed
  position before animating open, so the slide always starts from the correct edge.

  This applies to both `<Drawer>` and `Drawer.show()`, though only the declarative
  form could hit it: an imperative drawer is a fresh element each time, so its
  placement never changes under it.

- fcb9bbe: Remove the `.GeckoUICalendar__dual`, `.GeckoUICalendar__dual__item`, `data-position` and
  `data-calendars` rules. A range calendar has rendered a single grid since v2, so nothing
  matched them.
- bf01f5a: `Drawer.show()` now slides in, and holds the scroll lock until it has slid out.

  An imperative drawer mounted with `open` already `true`, so there was no closed
  frame for the CSS transition to animate away from and it appeared instantly. The
  drawer now holds its open state back by one frame, which gives the transition
  something to start from. A declarative `<Drawer>` that mounts already open gains
  the same entrance.

  The scroll lock was also released the moment `open` flipped to `false`, 300ms
  before the drawer finished sliding out, so the page jumped sideways mid
  animation. It is now held through the exit, matching `Dialog`.

- d45c40e: `Menu` now focuses the first item when you open it with ArrowDown.

  `MenuButton` looked the item up in the same tick it called `openMenu()`:

  ```tsx
  if (!open) openMenu();
  const firstItem = menuRef.current?.querySelector("[role=menuitem]");
  setTimeout(() => firstItem?.focus());
  ```

  `openMenu()` only schedules a state update, so the panel was still unmounted on
  the next line. `menuRef.current` was `null`, `firstItem` was `undefined`, and the
  queued `focus()` had nothing to focus. The menu opened with focus sitting on the
  panel, so you had to press ArrowDown a second time to reach the first item.

  The lookup now happens inside the timeout, after the panel has mounted, and it
  skips disabled items to match the arrow navigation already in `MenuPanel`.

- 2560edd: `react-hook-form` is now an optional peer dependency.

  It was required, so installing the library for `Button` or `Badge` alone still
  forced `react-hook-form` into your tree or produced a peer warning. Only the
  `RHF*` components import it, and nothing else in the package touches it.

  Nothing changes if you use the `RHF*` components: keep `react-hook-form`
  installed as before.

- 282d4f0: Stop `OTPInput` stealing clicks from a dropdown opened over it.

  Its overlay button — the transparent layer that gives the field focus wherever you click —
  sat at `z-index: 10`, the same tier the stacking order reserves for inline dropdowns. A tie
  is broken by document order, so a `Select` opening over an `OTPInput` painted above it and
  still lost the click to it: the option under the pointer never fired and the OTP field took
  focus instead.

  The field is now its own stacking context, so the overlay only has to clear the cells beside
  it rather than competing with the page.

- 65b029b: The date pickers stack with the other floating panels, and every tier is a variable.

  `DateInput` and `DateRangeInput` pinned their calendar at `z-index: 9999` inline, which put
  it over `Dialog` and `Toast` and could not be changed without overriding the element's own
  style. Both now sit at `50` with `Tooltip`, `Menu` and `Popover`, through
  `--gecko-date-input-z` and `--gecko-date-range-input-z`.

  The tiers that were hardcoded are variables too, so any of them can be retuned:
  `--gecko-select-menu-z`, `--gecko-breadcrumb-z`, `--gecko-tooltip-z` and `--gecko-menu-z`.

  The order is now: inline dropdowns `10`, floating panels `50`, then Drawer `1000`, Dialog
  `2000` and Toast `3000`.

- 7aa2154: `Rating` is gold by default, and takes the rest of its props.

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

- fcb9bbe: Mark `RHFCheckbox`, `RHFRadio` and `RHFSwitch` invalid when their field fails validation.

  All three base components had `aria-invalid` styling, but their wrappers never set it, so a
  required checkbox or switch never turned red and a screen reader was never told the field
  was invalid.

- c501530: `Select` no longer crashes on an object value holding a `null`, and never renders
  an empty trigger.

  When a value is not in the options list, `Select` works out the trigger text from
  the value itself. It walked into an object and took the first property, and
  because `typeof null === "object"` a null property fell through to
  `Object.values(null)` and threw _"Cannot convert undefined or null to object"_.

  ```tsx
  // crashed, because `id` is null and no option matches
  <Select value={{ id: null, name: "Ann" }} onChange={setValue}>
    <SelectOption value="apple" label="Apple" />
  </Select>
  ```

  Nil entries are now skipped rather than walked into, so that value reads as "Ann".

  Anything that would leave the trigger blank falls through to the placeholder
  instead of rendering an empty box — `null`, `undefined`, `""`, a whitespace only
  string, `{}`, `[]`, and objects whose properties are all nil or empty.

  A matching option still wins over all of this, which is how to control what an
  empty or null value reads as:

  ```tsx
  <SelectOption value="" label="All Countries" />
  <SelectOption value={null} label="All Items" />
  ```

  Property order still decides the text when nothing is nil: `{ id: 7, name: "Ann" }`
  reads as "7". Give the value a `label` key to control it.

  `isNil` is now a type predicate, so it narrows `null | undefined` at call sites.

- 3618298: `TagInput` puts the caret at the start of an empty field, and says when it is full.

  The text box sat after the placeholder in the flow, so the caret appeared to its right rather
  than where the text would begin. It is now taken out of flow while the placeholder has the
  row and pinned to the field's own inset, the way `Select` does it, and goes back beside the
  tags once there is one.

  The field also carries `data-full` at `max`, and the text being typed is cleared when that
  was the only thing standing in its way. Text turned down by `validate` is still kept, because
  a typo can be corrected — no amount of correcting makes room.

- afcf12f: `Tooltip` colours now come from CSS variables, like the other components.

  ```css
  .GeckoUITooltip {
    --gecko-tooltip-bg: var(--color-surface-emphasis);
    --gecko-tooltip-text: var(--color-surface-primary);
    --gecko-tooltip-radius: 0.5rem;
  }
  ```

  It looks the same as before. The bubble stays inverted against the page rather than matching
  the surface the way `Popover` does, because a tooltip is transient and holds nothing you can
  click, so contrast alone separates it and it needs no border. Both tokens flip in dark mode,
  so it stays inverted there too.

  `backgroundColor` now sets `--gecko-tooltip-bg` instead of the background directly, so the
  arrow follows the panel from the cascade rather than being coloured a second time. Overriding
  the variables through `className` also lets you fix the text colour alongside the background,
  which the prop on its own could not do.

- 09de279: Tidied the tsup `external` list, which had drifted from what the library uses.

  `sonner` went when Toast was rewritten, and `next-themes`,
  `class-variance-authority` and `prop-types` were never dependencies at all.
  `tailwind-merge` was listed twice, and `lodash.isequal` was missing.

  tsup already treats `dependencies` and `peerDependencies` as external, so the list
  was belt and braces either way — the build output is byte for byte identical before
  and after. No change for consumers.

## [1.6.4]

- `isAsyncFn`: No longer calls the function it is checking. It now only reads `fn.constructor?.name === "AsyncFunction"`, so passing a normal function does not trigger a side effect.
- SelectButton: Scrollbar-hiding styles (`scrollbar-width`, `scrollbar-color`, `scrollbar-gutter`) are now `!important` so consumer styles cannot override them by accident.

## [1.6.3]

- Select: Menu width is now `min-width: trigger` — it grows to fit long option labels (capped to the viewport) instead of being fixed to the trigger width.

## [1.6.2]

- Select: Menu positions to the selected option on open again (removed in 1.6.1), now as an instant jump without the smooth-scroll animation.

## [1.6.1]

- Select: Menu no longer auto-scrolls to the selected option on open.

## [1.6.0]

- Select: Menu width now matches the trigger with `floatingStrategy="fixed"`, and long labels wrap instead of overflowing.
- Menu: Panel now has a default `max-h-[240px]` — override with `menuClassName`.
- SelectOption: Check icon space is now always reserved, preventing layout shift on selection.
- Select: Menu now opens correctly when the component is wrapped in a `<label>` element.
- Checkbox: Rebuilt as a styled native input (removed inner button/label wrappers, and the `GeckoUICheckbox__button` / `GeckoUICheckbox__box` classes) — toggling now works when wrapped in a `<label>`.
- Calendar: Year picker now shows the correct decade for years ending in 5-9 (previously rounded to the next decade).

## [1.5.0]

### Breaking Changes

- SelectButton: Default placeholder changed from "Select Item" to "Select option" (BREAKING for consumers relying on the old literal in tests).
- Tooltip: Renamed `side` prop to `placement` (BREAKING).
- Calendar: Removed `numberOfMonths` from `CalendarRangeModeProps`. Range mode now always renders one month (BREAKING).
- DateInput / DateRangeInput: Changed `'YYYY/MM/DD'` format option to `'YYYY-MM-DD'` (ISO standard, BREAKING).

## [1.4.0]

### Breaking Changes

- RHFError: Removed deprecated `children` prop — use `render` instead.
- RHFInput / RHFTextarea: Narrowed `onChange` type from `(value: string | null) => void` to `(value: string) => void`.
- OTPInput: Switched from CSS grid (`max-w-xs`) to flex layout with cells `flex-1 max-w-[56px]` — adapts to parent width on narrow screens, no longer hard-capped at 320px.

### Fixed

- RHFCheckbox: Boolean-toggle when no `value` prop is passed now works as documented.

### Added

- RHFTextarea: New `transform` prop for input/output value transformation (mirrors RHFInput).
- RHFOTPInput: New consumer-facing `onChange(value)` and `onBlur()` callbacks fired alongside RHF's internal handlers.

### Changed

- RHFCurrencyInput: Currency `symbol` and `code` are now optional.

## [1.3.3]

- Menu: Removed inner `GeckoUIMenu__scroll-container`. Menu panel now fits content width by default and has no max-height — set `menuClassName="max-h-[300px]"` if you need to constrain height.

## [1.3.2]

- MenuItem: Removed `label` prop — use `children` instead (e.g. `<MenuItem>Edit</MenuItem>`).
- ConfirmDialog `dismissOnEsc` and `dismissOnOutsideClick` now default to `true`, consistent with Dialog.

## [1.3.0]

### Breaking Changes

- **Tailwind CSS v4**: Migrated from Tailwind CSS v3 to v4. Consumers using Tailwind should update to v4.
- **OKLCH color system**: Theme colors now use full CSS color values instead of space-separated RGB channels. Override with any CSS color format — `oklch()`, `hex`, `rgb()`, `hsl()`, etc.
- **CSS variable rename**: Theme variables changed from `--gecko-ui-*` to `--color-*` (Tailwind v4 convention).
- **Data attributes replace BEM modifiers**: Component modifiers migrated from BEM classes (`GeckoUIButton--filled-primary`) to `data-*` attributes (`data-variant="filled" data-color="primary"`). Update CSS selectors accordingly (e.g. `.GeckoUIButton[data-variant="filled"]`).
- **Menu rewrite**: Menu component rebuilt from scratch with Floating UI. New API uses `Menu`, `MenuItem`, and `MenuTrigger`. Old compound components (`MenuButton`, `MenuItems`, `MenuSection`, `MenuHeading`, `MenuSeparator`) are removed.
- **Dropdown removed**: Use `Menu` component instead.

### Fixed

- Focus outline only shows on keyboard navigation (`focus-visible`), no longer visible by default.

## [1.1.3] - 2025-12-30

- Fix `disabled` color not applying on `Input` component.

## [1.1.2] - 2025-12-18

- Add `react-hook-form` as a peer dependency to avoid version conflicts

## [1.1.1] - 2025-12-18

- Fixed react and react-dom peer dependency versions in package.json

## [1.1.0] - 2025-12-16

- Added `clearable` prop to Select component for clearing selected value

## [1.0.0] - 2025-12-03

- Opensource initial release of GeckoUI React component library

### Added

#### Core Components

- Alert - Display important messages with different severity levels
- Button - Flexible button with multiple variants, sizes, and colors
- Calendar - Date picker calendar component
- Checkbox - Checkbox input with indeterminate state support
- ConfirmDialog - Confirmation dialog for destructive actions
- DateInput - Date input with calendar picker
- DateRangeInput - Date range selection input
- Dialog - Modal dialog component
- Drawer - Slide-out panel component
- Dropdown - Dropdown menu component
- Input - Text input with various states and addons
- InputError - Form field error message display
- Label - Form label component
- LoadingButton - Button with loading state
- Menu - Navigation menu component
- OTPInput - One-time password input
- Pagination - Page navigation component
- Radio - Radio button input
- Select - Dropdown select with search and multi-select
- Spinner - Loading spinner indicator
- Switch - Toggle switch component
- Textarea - Multi-line text input with auto-resize
- Toast - Toast notification system (powered by Sonner)
- Tooltip - Tooltip component

#### React Hook Form Components

- RHFCheckbox - Checkbox with React Hook Form integration
- RHFController - Generic RHF controller wrapper
- RHFCurrencyInput - Currency input with RHF integration
- RHFDateInput - Date input with RHF integration
- RHFDateRangeInput - Date range input with RHF integration
- RHFError - Form error display for RHF
- RHFFileInput - File input with RHF integration
- RHFFilePicker - File picker with drag & drop and RHF integration
- RHFInput - Text input with RHF integration
- RHFInputGroup - Input group with RHF integration
- RHFNumberInput - Number input with RHF integration
- RHFOTPInput - OTP input with RHF integration
- RHFRadio - Radio button with RHF integration
- RHFSelect - Select with RHF integration
- RHFSwitch - Switch with RHF integration
- RHFTextarea - Textarea with RHF integration

#### Utilities

- GeckoUIPortal - Portal container for modals and overlays
- DynamicComponentRenderer - Render components dynamically from config

#### Features

- Full TypeScript support with module augmentation for custom variants
- CSS variables for theming (light/dark mode)
- Accessible components following WAI-ARIA guidelines
- TailwindCSS integration with customizable styles
