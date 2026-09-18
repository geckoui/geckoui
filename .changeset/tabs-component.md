---
"@geckoui/geckoui": minor
---

New `Tabs` component, for switching between panels or for navigation.

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
