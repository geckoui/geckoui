import { createContext, useContext } from "react";

import type { MenuContextProps } from "./Menu";

export const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);

  if (context === undefined) {
    throw new Error("useMenu must be used within a Menu");
  }

  return context;
};
