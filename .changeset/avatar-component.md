---
"@geckoui/geckoui": minor
---

New `Avatar` and `AvatarGroup` components.

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
