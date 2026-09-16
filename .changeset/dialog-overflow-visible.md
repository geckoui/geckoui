---
"@geckoui/geckoui": patch
---

The dialog panel no longer clips floating children.

`.GeckoUIDialog__dialog` was `overflow: hidden`, so a `Select` menu or `Menu`
dropdown opened inside a dialog was cut off at the dialog edge. Those menus are
positioned by floating-ui but still render inline in the DOM, so the dialog's
clipping applied to them.

The panel is now `overflow: visible`. Nothing needed the clipping: a tall dialog
scrolls on `.GeckoUIDialog`, which is the full viewport, not on the panel.

If you relied on the panel clipping its own content to the rounded corners, set
it back on your own content:

```css
.GeckoUIDialog__dialog > .my-media { overflow: hidden; border-radius: inherit; }
```
