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
      const firstItem = menuRef.current?.querySelector<HTMLElement>("[role=menuitem]");
      setTimeout(() => firstItem?.focus());
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
