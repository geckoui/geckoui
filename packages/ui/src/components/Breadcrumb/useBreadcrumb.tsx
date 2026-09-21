import { createContext, useContext } from "react";

export interface BreadcrumbContextValue {
  /** Whether this crumb is the last one, and so the page you are on unless told otherwise. */
  isLast: boolean;
}

export const BreadcrumbContext = createContext<BreadcrumbContextValue>({ isLast: false });

export const useBreadcrumb = (): BreadcrumbContextValue => useContext(BreadcrumbContext);
