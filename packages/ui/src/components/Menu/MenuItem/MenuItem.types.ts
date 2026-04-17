import type { ReactNode } from "react";

export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /**
   * Text label for the menu item.
   * Used as the default rendered content if no `children` is provided.
   */
  label: string;

  /**
   * Whether the menu item is disabled
   */
  disabled?: boolean;

  /**
   * Additional class name for the menu item
   */
  className?: string;

  /**
   * Callback fired when the menu item is clicked.
   * The menu will close automatically after the callback.
   */
  onClick?: () => void;

  /**
   * Custom content for the menu item.
   * If not provided, `label` is rendered as text.
   */
  children?: ReactNode;
}
