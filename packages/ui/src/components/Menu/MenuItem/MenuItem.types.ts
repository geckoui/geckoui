export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
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
}
