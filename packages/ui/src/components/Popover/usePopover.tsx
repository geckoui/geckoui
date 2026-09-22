import { createContext, useContext } from "react";

import type { PopoverContextProps } from "./Popover.types";

export const PopoverContext = createContext<PopoverContextProps | undefined>(undefined);

/**
 * Read the popover's state from anything inside it — a Cancel button that needs to close
 * it, say.
 *
 * @example
 * ```tsx
 * const { close } = usePopover();
 *
 * <Button onClick={close}>Cancel</Button>
 * ```
 */
export const usePopover = () => {
  const context = useContext(PopoverContext);

  if (context === undefined) {
    throw new Error("usePopover must be used within a Popover");
  }

  return context;
};
