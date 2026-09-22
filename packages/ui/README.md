<p align="center">
  <img src="https://github.com/geckoui/geckoui/raw/develop/GeckoUI.png" alt="Gecko UI" width="120" />
</p>

<h1 align="center">Gecko UI</h1>

<p align="center">
  The only thing our Gecko 🦎 eats is bugs! 🐛<br />
</p>

📚 **Documentation**: [Gecko](https://geckoui.dev)

Upgrading from v1? See the [migration guide](https://geckoui.dev/docs/migrating-to-v2).

## Installation

```bash
npm install @geckoui/geckoui
# or
pnpm add @geckoui/geckoui
# or
yarn add @geckoui/geckoui
```

## Install react-hook-form for form components

```bash
npm install react-hook-form

# or
pnpm add react-hook-form

# or
yarn add react-hook-form
```

## Quick Start

### 1. Import Styles

Import the component styles in your app:

```tsx
import "@geckoui/geckoui/styles.css";
```

> If you use `tailwindcss`, make sure to import the css inside `layer` directive to correctly override the styles:

```css title="src/global.css"
@import "tailwindcss";

@layer components {
  @import "@geckoui/geckoui/styles.css";
}
```

### 2. Wrap Your App

`GeckoUIProvider` owns the overlay stack. `Toast`, `ConfirmDialog` and the imperative
`Dialog.show()` / `Drawer.show()` need it; the declarative `<Dialog open>` and
`<Drawer open>` forms do not. Put it below your own context providers, so content opened
from anywhere can still read them.

```tsx
import { GeckoUIProvider } from "@geckoui/geckoui";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GeckoUIProvider>{children}</GeckoUIProvider>
      </body>
    </html>
  );
}
```

### 3. Use Components

```tsx
import { Alert, Button, Input } from "@geckoui/geckoui";

function App() {
  return (
    <div>
      <Button variant="filled" color="primary">
        Click me
      </Button>

      <Input placeholder="Enter your name" />

      <Alert color="success" title="Operation completed successfully!" />
    </div>
  );
}
```

## Theming

GeckoUI uses [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color values with CSS custom properties (`--color-*`) powered by Tailwind CSS v4. You can override colors using **any CSS color format** — oklch, hex, rgb, hsl, etc.

### Dark Mode

Nothing switches on its own. Add the `dark` class above your app — normally `<html>` — or
every component stays light:

```tsx
<html lang="en" className="dark">
```

On a wrapper instead of the root, it themes only that subtree.

### Customizing Colors

Override CSS variables to match your brand:

```css
:root {
  --color-primary-500: oklch(0.65 0.24 330);
  --color-primary-600: oklch(0.55 0.22 330);

  /* hex works too */
  --color-primary-700: #6d28d9;
}
```

Import after the base styles:

```tsx
import "@geckoui/geckoui/styles.css";

import "./my-theme.css";
```

## Advanced Usage

### Custom Styling with Data Attributes

Components use `data-*` attributes for variant/state styling:

```css
/* Target specific variants */
.GeckoUIButton[data-variant="filled"][data-color="primary"] {
  /* Your custom styles */
}

.GeckoUIInput__input {
  /* Style the inner input element */
}
```

## TypeScript

All components are fully typed. Import types as needed:

```tsx
import type { ButtonProps, InputProps } from "@geckoui/geckoui";
```

## AI Skills

Install the GeckoUI skill to help AI assistants (Claude Code, etc.) generate accurate component code and themes:

```
npx skills add GeckoUI/skills
```

The skill provides component API references, theming variables, and class name mappings so AI agents can generate correct GeckoUI code without hallucination.

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please visit our [@geckoui/geckoui](https://github.com/geckoui/geckoui).
