import { createContext, useContext } from "react";

import type { AccordionContextProps, AccordionItemContextProps } from "./Accordion.types";

export const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

export const AccordionItemContext = createContext<AccordionItemContextProps | undefined>(undefined);

export const useAccordion = () => {
  const context = useContext(AccordionContext);

  if (context === undefined) {
    throw new Error("useAccordion must be used within an Accordion");
  }

  return context;
};

export const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);

  if (context === undefined) {
    throw new Error("useAccordionItem must be used within an AccordionItem");
  }

  return context;
};
