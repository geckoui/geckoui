import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactElement,
  cloneElement
} from "react";

import { asChildElement } from "../../../utils/asChildElement";
import { classNames } from "../../../utils/classNames";
import type { BreadcrumbItemProps } from "../Breadcrumb.types";
import { useBreadcrumb } from "../useBreadcrumb";

/**
 * One crumb.
 *
 * The last one is the page you are on, so it is drawn as text rather than a link and
 * carries `aria-current`. Set `current` when the last crumb is not where you are.
 *
 * `href` renders a plain anchor, which reloads the page. For client side routing hand the
 * crumb your own link with `asChild`, or give it an `onClick` and it becomes a button.
 *
 * @example
 * ```tsx
 * <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
 * <BreadcrumbItem>Profile</BreadcrumbItem>
 *
 * <BreadcrumbItem asChild>
 *   <Link href="/settings">Settings</Link>
 * </BreadcrumbItem>
 *
 * <BreadcrumbItem onClick={() => router.push("/settings")}>Settings</BreadcrumbItem>
 * ```
 */
const BreadcrumbItem = ({
  children,
  href,
  current,
  asChild,
  className,
  onClick,
  ...rest
}: BreadcrumbItemProps) => {
  const { isLast } = useBreadcrumb();

  const here = current ?? isLast;
  const classes = classNames("GeckoUIBreadcrumb__link", className);

  const shared = {
    className: classes,
    "aria-current": here ? ("page" as const) : undefined,
    "data-current": here || undefined
  };

  if (asChild) {
    const child = asChildElement(children);

    if (child) {
      return cloneElement(child, {
        ...shared,
        ...rest,
        // only when given, or an absent one would wipe the child's own handler
        ...(onClick ? { onClick } : {}),
        className: classNames(classes, (child.props as { className?: string }).className)
      } as AnchorHTMLAttributes<HTMLAnchorElement>) as ReactElement;
    }
  }

  // The page you are on is not somewhere to go, so it is text even when a href was given
  if (here) {
    return (
      <span {...shared} {...rest}>
        {children}
      </span>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} {...shared} {...rest}>
        {children}
      </a>
    );
  }

  /*
   * A crumb that only has something to do is a button, not a span with a handler on it.
   * A span takes no focus and answers no key, so a router crumb written that way would be
   * unreachable without a mouse.
   */
  if (onClick) {
    const asButton = {
      ...rest,
      ...shared,
      onClick
    } as unknown as ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button {...asButton} type="button">
        {children}
      </button>
    );
  }

  return (
    <span {...shared} {...rest}>
      {children}
    </span>
  );
};

BreadcrumbItem.displayName = "BreadcrumbItem";

export default BreadcrumbItem;
