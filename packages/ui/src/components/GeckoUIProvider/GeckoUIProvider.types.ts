import type { ReactNode } from "react";
import type { ToasterOptions } from "../Toast";

/**
 * Props for `GeckoUIProvider`, the required wrapper component that owns the overlay
 * stack and renders the toast stacks. Place it below your own context providers
 * so that `Dialog.show()` / `Drawer.show()` content can read app-level React context.
 */
export interface GeckoUIProviderProps {
  /**
   * The app's component tree.
   *
   * Place `GeckoUIProvider` below your own context providers so overlays opened via
   * `Dialog.show()` / `Drawer.show()` can read those contexts.
   *
   * @example
   * ```tsx
   * <AuthProvider>
   *   <GeckoUIProvider>
   *     <App />
   *   </GeckoUIProvider>
   * </AuthProvider>
   * ```
   */
  children: ReactNode;

  /**
   * Defaults for every toast, and where the stacks sit.
   *
   * @example
   * ```tsx
   * <GeckoUIProvider toastOptions={{ duration: 3000 }}>
   *   <App />
   * </GeckoUIProvider>
   * ```
   */
  toastOptions?: ToasterOptions;
}
