import type { Placement, Strategy, useFloating } from "@floating-ui/react";
import type { Dispatch, PropsWithChildren, RefObject, SetStateAction } from "react";

export interface MenuProps extends PropsWithChildren {
  /**
   * Text label for the default menu button.
   * If `MenuTrigger` is provided as a child, this is ignored.
   */
  label?: string;

  /**
   * Whether the menu is disabled
   */
  disabled?: boolean;

  /**
   * Placement of the dropdown panel relative to the trigger.
   * @default "bottom-start"
   */
  placement?: Placement;

  /**
   * Floating strategy for the dropdown panel
   */
  floatingStrategy?: Strategy;

  /**
   * Additional class name for the menu wrapper
   */
  className?: string;

  /**
   * Additional class name for the dropdown panel
   */
  menuClassName?: string;

  /**
   * Additional class name for the default menu button.
   * Only applies when no `MenuTrigger` is provided.
   */
  buttonClassName?: string;
}

export interface MenuContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  floating: ReturnType<typeof useFloating>;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  disabled: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
}
