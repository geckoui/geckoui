import type { ReactNode } from "react";

export interface MenuTriggerRenderProps {
  /**
   * Whether the menu is currently open
   */
  open: boolean;

  /**
   * Open the menu
   */
  openMenu: () => void;

  /**
   * Close the menu
   */
  closeMenu: () => void;

  /**
   * Toggle the menu open/closed
   */
  toggleMenu: () => void;

  /**
   * Whether the menu is disabled
   */
  disabled: boolean;
}

export interface MenuTriggerProps {
  /**
   * Render function that receives menu state and controls.
   *
   * @example
   * ```tsx
   * <MenuTrigger>
   *   {({ open, toggleMenu }) => (
   *     <button onClick={toggleMenu}>
   *       Actions {open ? '▲' : '▼'}
   *     </button>
   *   )}
   * </MenuTrigger>
   * ```
   */
  children: (props: MenuTriggerRenderProps) => ReactNode;
}
