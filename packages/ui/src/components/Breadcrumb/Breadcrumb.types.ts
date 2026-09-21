import type { Placement } from "@floating-ui/react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

/** Extensible size map - To allow module augmentation */
export interface BreadcrumbSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The crumbs, in order. */
  children?: ReactNode;

  /**
   * What goes between the crumbs. A chevron when it is left out.
   * */
  separator?: ReactNode;

  /**
   * How many crumbs to show before the middle is folded away behind an ellipsis, which
   * opens them as a list. The first and the last are always kept. Leave it out to show
   * them all.
   * */
  maxItems?: number;

  /**
   * How many to keep at the end when the middle is folded away.(Default: 1)
   * */
  itemsAfterCollapse?: number;

  /**
   * How many to keep at the start when the middle is folded away.(Default: 1)
   * */
  itemsBeforeCollapse?: number;

  /** What the ellipsis is called, for a screen reader.(Default: 'Show the rest') */
  expandLabel?: string;

  /** Where the list of folded crumbs opens.(Default: 'bottom-start') */
  menuPlacement?: Placement;

  /** Extra class for that list. */
  menuClassName?: string;

  /** What the whole trail is called.(Default: 'Breadcrumb') */
  "aria-label"?: string;

  size?: keyof BreadcrumbSizeMap;
  className?: string;
}

export interface BreadcrumbItemProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  children?: ReactNode;

  /** Where it goes. Without one the crumb is text rather than a link. */
  href?: string;

  /**
   * Whether this is the page you are on. The last crumb takes this for itself, unless
   * another one claims it — so setting it here moves it rather than adding a second.
   * */
  current?: boolean;

  /**
   * Hand the crumb to your own element, a router link most often, rather than rendering an
   * anchor. It keeps its own class name, with the crumb's added.
   * */
  asChild?: boolean;
}
