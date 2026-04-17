import { type ReactNode, isValidElement } from "react";

import MenuTrigger from "./MenuTrigger/MenuTrigger";

export function isMenuTrigger(child: ReactNode): boolean {
  return isValidElement(child) && child.type === MenuTrigger;
}
