import { type AnchorHTMLAttributes, type ReactElement, cloneElement } from "react";

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
 * @example
 * ```tsx
 * <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
 * <BreadcrumbItem>Profile</BreadcrumbItem>
 *
 * <BreadcrumbItem asChild>
 *   <Link href="/settings">Settings</Link>
 * </BreadcrumbItem>
 * ```
 */
const BreadcrumbItem = ({
  children,
  href,
  current,
  asChild,
  className,
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
        className: classNames(classes, (child.props as { className?: string }).className)
      } as AnchorHTMLAttributes<HTMLAnchorElement>) as ReactElement;
    }
  }

  // The page you are on is not somewhere to go, so it is text even when a href was given
  if (here || !href) {
    return (
      <span {...shared} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <a href={href} {...shared} {...rest}>
      {children}
    </a>
  );
};

BreadcrumbItem.displayName = "BreadcrumbItem";

export default BreadcrumbItem;
