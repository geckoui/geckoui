import type { PropsWithChildren } from "react";

import { classNames } from "../../../utils/classNames";
import { useMenu } from "../useMenu";

interface MenuButtonProps extends PropsWithChildren {
  className?: string;
}

const MenuButton = ({ children, className }: MenuButtonProps) => {
  const { toggleMenu, openMenu, disabled, open, menuRef } = useMenu();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) openMenu();

      // The panel is not mounted yet on the opening keypress, so look the item up
      // inside the timeout rather than before it.
      setTimeout(() => {
        menuRef.current
          ?.querySelector<HTMLElement>("[role=menuitem]:not([data-disabled])")
          ?.focus();
      });
    }
  };

  return (
    <button
      type="button"
      className={classNames("GeckoUIMenu__button", className)}
      disabled={disabled}
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={toggleMenu}
      onKeyDown={handleKeyDown}>
      {children}
    </button>
  );
};

MenuButton.displayName = "MenuButton";

export default MenuButton;
