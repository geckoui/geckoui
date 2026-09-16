import "@geckoui/geckoui";

declare module "@geckoui/geckoui" {
  interface ButtonColorMap {
    secondary: unknown;
    danger: unknown;
  }

  interface SwitchSizeMap {
    lg: unknown;
  }

  interface AlertColorMap {
    critical: unknown;
  }

  interface CounterInputSizeMap {
    xl: unknown;
  }
}
