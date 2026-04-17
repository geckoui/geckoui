<p align="center">
  <img src="https://github.com/geckoui/geckoui/raw/develop/GeckoUI.png" alt="Gecko UI" width="120" />
</p>

<h1 align="center">Gecko UI</h1>

<p align="center">
  The only thing our Gecko 🦎 eats is bugs! 🐛<br />
</p>

📚 **Documentation**: [Gecko](https://gecko.productionbug.com)

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

### 2. Use Components

```tsx
import { Alert, Button, Input } from "@geckoui/geckoui";

function App() {
  return (
    <div>
      <Button variant="contained" color="primary">
        Click me
      </Button>

      <Input placeholder="Enter your name" />

      <Alert variant="success" title="Operation completed successfully!" />
    </div>
  );
}
```

## Theming

GeckoUI uses [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color values with CSS custom properties (`--color-*`) powered by Tailwind CSS v4. You can override colors using **any CSS color format** — oklch, hex, rgb, hsl, etc.

### Dark Mode

Add the `.dark` class to your root element:

```tsx
<div className="dark">
  <App />
</div>
```

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

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please visit our [@geckoui/geckoui](https://github.com/geckoui/geckoui).
