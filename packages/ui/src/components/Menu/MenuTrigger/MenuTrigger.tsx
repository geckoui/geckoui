import { useMenu } from "../useMenu";
import type { MenuTriggerProps } from "./MenuTrigger.types";

const MenuTrigger = ({ children }: MenuTriggerProps) => {
  const { open, openMenu, closeMenu, toggleMenu, disabled } = useMenu();

  return children({ open, openMenu, closeMenu, toggleMenu, disabled });
};

MenuTrigger.displayName = "MenuTrigger";

export default MenuTrigger;
