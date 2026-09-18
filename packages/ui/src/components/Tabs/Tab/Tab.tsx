import type { HTMLAttributes, ReactElement } from "react";
import { Children, cloneElement, isValidElement } from "react";

import { classNames } from "../../../utils/classNames";
import type { TabProps } from "../Tabs.types";
import { useTabs } from "../useTabs";

/**
 * One tab. Whatever you put inside is what the tab shows.
 *
 * @example
 * ```tsx
 * <Tab value="profile">Profile</Tab>
 * <Tab value="alerts"><BellIcon /> Alerts <Badge color="error">7</Badge></Tab>
 * ```
 *
 * @example
 * A real link, for navigation tabs:
 *
 * ```tsx
 * <Tab value="/settings/profile" asChild>
 *   <Link href="/settings/profile">Profile</Link>
 * </Tab>
 * ```
 */
const Tab = ({ value, disabled, asChild, className, children, ...rest }: TabProps) => {
  const { selectedValue, select, isNav } = useTabs();

  const selected = selectedValue === value;

  const tabProps = {
    id: `GeckoUITabs-tab-${value}`,
    // Only the selected tab is in the tab order, so Tab leaves the strip rather than
    // walking through every tab. Navigation keeps them all reachable, because there is
    // no arrow key navigation to replace it.
    tabIndex: isNav || selected ? 0 : -1,
    "data-gecko-tab": "",
    "data-state": selected ? "selected" : "unselected",
    "data-disabled": disabled || undefined,
    ...(isNav
      ? { "aria-current": selected ? ("page" as const) : undefined }
      : {
          role: "tab",
          "aria-selected": selected,
          "aria-controls": `GeckoUITabs-panel-${value}`
        })
  };

  if (asChild) {
    const child = Children.only(children);

    if (isValidElement(child)) {
      return cloneElement(child, {
        ...tabProps,
        ...rest,
        className: classNames(
          "GeckoUITabs__tab",
          (child.props as { className?: string }).className,
          className
        )
      } as HTMLAttributes<HTMLElement>) as ReactElement;
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={classNames("GeckoUITabs__tab", className)}
      onClick={() => select(value)}
      {...tabProps}
      {...rest}>
      {children}
    </button>
  );
};

Tab.displayName = "Tab";

export default Tab;
