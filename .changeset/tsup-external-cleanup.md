---
"@geckoui/geckoui": patch
---

Tidied the tsup `external` list, which had drifted from what the library uses.

`sonner` went when Toast was rewritten, and `next-themes`,
`class-variance-authority` and `prop-types` were never dependencies at all.
`tailwind-merge` was listed twice, and `lodash.isequal` was missing.

tsup already treats `dependencies` and `peerDependencies` as external, so the list
was belt and braces either way — the build output is byte for byte identical before
and after. No change for consumers.
