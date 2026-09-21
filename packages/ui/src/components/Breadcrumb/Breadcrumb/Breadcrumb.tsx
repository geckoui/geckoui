import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { Children, Fragment, type ReactNode, isValidElement, useRef, useState } from "react";

import { useClickOutside } from "../../../hooks";
import { classNames } from "../../../utils/classNames";
import type { BreadcrumbProps } from "../Breadcrumb.types";
import { BreadcrumbContext } from "../useBreadcrumb";

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="m9 18 6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * The trail of pages above the one you are on.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
 *   <BreadcrumbItem>Profile</BreadcrumbItem>
 * </Breadcrumb>
 * ```
 *
 * @example
 * A deep trail, with the middle folded away until it is asked for:
 *
 * ```tsx
 * <Breadcrumb maxItems={3}>…</Breadcrumb>
 * ```
 */
const Breadcrumb = ({
  children,
  separator,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  expandLabel = "Show the rest",
  menuPlacement = "bottom-start",
  size = "md",
  className,
  menuClassName,
  "aria-label": ariaLabel = "Breadcrumb",
  ...rest
}: BreadcrumbProps) => {
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  const floating = useFloating({
    placement: menuPlacement,
    middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen
  });

  useClickOutside(() => setOpen(false), [menuRef, triggerRef]);

  const crumbs = Children.toArray(children);

  /*
   * A crumb that says it is the current page takes it from the last one. There is only ever
   * one page you are on, and two `aria-current="page"` in a trail is worse than none.
   */
  const claimed = crumbs.some(
    (crumb) => isValidElement(crumb) && (crumb.props as { current?: boolean }).current
  );
  const collapsed = maxItems !== undefined && maxItems > 0 && crumbs.length > maxItems;

  /*
   * The ellipsis stands in for the middle. The ends are what tell you where you are and
   * where you started, so they are what is kept when there is no room for everything.
   */
  const hidden = collapsed
    ? crumbs.slice(itemsBeforeCollapse, crumbs.length - itemsAfterCollapse)
    : [];

  const shown: ReactNode[] = collapsed
    ? [
        ...crumbs.slice(0, itemsBeforeCollapse),
        "ellipsis",
        ...crumbs.slice(crumbs.length - itemsAfterCollapse)
      ]
    : crumbs;

  return (
    <nav
      aria-label={ariaLabel}
      className={classNames("GeckoUIBreadcrumb", className)}
      data-size={size}
      {...rest}>
      <ol className="GeckoUIBreadcrumb__list">
        {shown.map((crumb, index) => {
          const last = index === shown.length - 1;

          return (
            <Fragment key={index}>
              <li className="GeckoUIBreadcrumb__crumb">
                {crumb === "ellipsis" ? (
                  /*
                   * A list rather than opening out in place. On a narrow screen unfolding a
                   * deep trail only wraps it over three lines, which is no easier to read
                   * than the ellipsis was.
                   */
                  <button
                    ref={(node) => {
                      triggerRef.current = node;
                      floating.refs.setReference(node);
                    }}
                    type="button"
                    aria-label={expandLabel}
                    aria-expanded={open}
                    aria-haspopup="menu"
                    className="GeckoUIBreadcrumb__expand"
                    onClick={() => setOpen((was) => !was)}>
                    &hellip;
                  </button>
                ) : (
                  // With the middle folded away the ends are still the ends, so the last
                  // one shown is the last one there is.
                  <BreadcrumbContext.Provider value={{ isLast: last && !claimed }}>
                    {crumb}
                  </BreadcrumbContext.Provider>
                )}
              </li>

              {!last && (
                <li className="GeckoUIBreadcrumb__separator" aria-hidden="true">
                  {separator ?? <ChevronIcon />}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>

      {open && !!hidden.length && (
        <ul
          ref={(node) => {
            menuRef.current = node;
            floating.refs.setFloating(node);
          }}
          style={floating.floatingStyles}
          className={classNames("GeckoUIBreadcrumb__menu", menuClassName)}>
          {hidden.map((crumb, index) => (
            <li
              key={index}
              className="GeckoUIBreadcrumb__menu__item"
              onClick={() => setOpen(false)}>
              {crumb}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
