import { type ReactElement, type ReactNode, isValidElement } from "react";

/**
 * The single element to merge `asChild`-style props into, or `null` when there isn't one.
 *
 * `Children.only` would be the obvious choice, but it throws, and a library component
 * cannot take the whole page down over its children. Under RSC a child can also reach a
 * client component as an unresolved lazy chunk rather than an element, so callers need a
 * path that falls back to their own wrapper instead of crashing.
 */
export const asChildElement = (children: ReactNode): ReactElement | null =>
  isValidElement(children) ? children : null;
