import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react";
import type { RefObject } from "react";
import { Children, useCallback, useRef, useState } from "react";

import { useClickOutside } from "../../../hooks";
import { classNames } from "../../../utils/classNames";
import { isMenuTrigger } from "../Menu.utils";
import { MenuButton } from "../MenuButton";
import { MenuPanel } from "../MenuPanel";
import { MenuContext } from "../useMenu";
import type { MenuProps } from "./Menu.types";

const Menu = ({
  label,
  disabled = false,
  placement = "bottom-start",
  floatingStrategy,
  className,
  menuClassName,
  buttonClassName,
  children
}: MenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  const floating = useFloating({
    placement,
    strategy: floatingStrategy,
    middleware: [flip({ padding: 6 }), offset({ mainAxis: 6 })],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen
  });

  const { refs } = floating;

  const openMenu = useCallback(() => {
    if (disabled || open) return;
    setOpen(true);
  }, [disabled, open]);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [open, openMenu, closeMenu]);

  useClickOutside(() => {
    closeMenu();
  }, [refs.reference as unknown as RefObject<HTMLElement>]);

  const childArray = Children.toArray(children);
  const trigger = childArray.find(isMenuTrigger);
  const menuItems = childArray.filter((el) => !isMenuTrigger(el));

  return (
    <MenuContext.Provider
      value={{
        open,
        setOpen,
        floating,
        openMenu,
        closeMenu,
        toggleMenu,
        disabled,
        menuRef
      }}>
      <div className={classNames("GeckoUIMenu", className)} ref={(r) => refs.setReference(r)}>
        {trigger ?? <MenuButton className={buttonClassName}>{label ?? "Menu"}</MenuButton>}
        <MenuPanel className={menuClassName}>{menuItems}</MenuPanel>
      </div>
    </MenuContext.Provider>
  );
};

Menu.displayName = "Menu";

export default Menu;
