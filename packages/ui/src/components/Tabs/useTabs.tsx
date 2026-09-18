import { createContext, useContext } from "react";

import type { TabsContextProps } from "./Tabs.types";

export const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export const useTabs = () => {
  const context = useContext(TabsContext);

  if (context === undefined) {
    throw new Error("useTabs must be used within a Tabs");
  }

  return context;
};
