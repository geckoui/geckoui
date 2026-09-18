import type { KeyboardEvent, ReactElement } from "react";
import { Children, useMemo, useRef, useState } from "react";

import { classNames } from "../../../utils/classNames";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import type {
  TabElementProps,
  TabLabelRenderProps,
  TabProps,
  TabsProps
} from "../Tabs.types";
import { isTab } from "../Tabs.utils";
import { TabsContext } from "../useTabs";

/**
 * A strip of tabs over the panel each one shows.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="profile">
 *   <Tab value="profile" label="Profile"><ProfileForm /></Tab>
 *   <Tab value="billing" label="Billing"><BillingForm /></Tab>
 * </Tabs>
 * ```
 *
 * Arrow keys and Home/End move focus along the strip; Enter or Space selects.
 *
 * @example
 * As navigation, with the router holding the state:
 *
 * ```tsx
 * <Tabs as="nav" value={pathname}>
 *   <Tab
 *     value="/settings/profile"
 *     label={({ props }) => <Link href="/settings/profile" {...props}>Profile</Link>}
 *   />
 * </Tabs>
 * ```
 */
const Tabs = ({
  value,
  defaultValue,
  onChange,
  variant = "underline",
  size = "md",
  orientation = "horizontal",
  fullWidth = false,
  as = "div",
  keepMounted = false,
  className,
  listClassName,
  children,
  ...rest
}: TabsProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  const tabs = useMemo(
    () =>
      (Children.toArray(children).filter(isTab) as ReactElement<TabProps>[]).map((e) => e.props),
    [children]
  );

  const firstEnabled = tabs.find((tab) => !tab.disabled)?.value;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;
  const isNav = as === "nav";

  const select = (next: string) => {
    if (!isControlled) setInternalValue(next);

    onChange?.(next);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Navigation is a list of links, so the arrow keys are left to the browser and Tab
    // walks through them as it would anywhere else.
    if (isNav) return;

    // Read the tabs from the DOM rather than from props, so a label rendered by the
    // caller is navigated the same as one we rendered.
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-gecko-tab]:not([data-disabled])") ?? []
    );

    if (!items.length) return;

    const [previousKey, nextKey] =
      orientation === "vertical" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];

    // Where focus is now, falling back to the selected tab when focus sits elsewhere
    const focusedIndex = items.indexOf(document.activeElement as HTMLElement);
    const current =
      focusedIndex === -1
        ? Math.max(
            items.findIndex((item) => item.dataset.state === "selected"),
            0
          )
        : focusedIndex;

    let next = current;

    switch (e.key) {
      case previousKey:
        next = (current - 1 + items.length) % items.length;
        break;
      case nextKey:
        next = (current + 1) % items.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = items.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();

    // Arrow keys move focus only. Selecting as focus travels mounts every panel on the
    // way past, and it surprises people who expect arrows to browse rather than choose.
    // Enter or Space on the focused tab selects it, which a button does for free.
    items[next].focus();
  };

  const ListElement = isNav ? "nav" : "div";

  return (
    <TabsContext.Provider value={{ selectedValue, select, keepMounted, isNav }}>
      <div
        className={classNames("GeckoUITabs", className)}
        data-variant={variant}
        data-size={size}
        data-orientation={orientation}
        data-full-width={fullWidth || undefined}
        {...rest}>
        <ListElement
          ref={listRef}
          className={classNames("GeckoUITabs__list", listClassName)}
          role={isNav ? undefined : "tablist"}
          aria-orientation={isNav ? undefined : orientation}
          onKeyDown={handleKeyDown}>
          {tabs.map((tab) => {
            const selected = tab.value === selectedValue;

            const tabProps: TabElementProps = {
              id: `GeckoUITabs-tab-${tab.value}`,
              // Only the selected tab is in the tab order, so Tab leaves the strip
              // rather than walking through every tab. Navigation keeps them all
              // reachable, because there is no arrow key navigation to replace it.
              tabIndex: isNav || selected ? 0 : -1,
              "data-gecko-tab": "",
              "data-state": selected ? "selected" : "unselected",
              "data-disabled": tab.disabled || undefined,
              ...(isNav
                ? { "aria-current": selected ? ("page" as const) : undefined }
                : {
                    role: "tab",
                    "aria-selected": selected,
                    "aria-controls": tab.children ? `GeckoUITabs-panel-${tab.value}` : undefined
                  })
            };

            if (typeof tab.label === "function") {
              const renderProps: TabLabelRenderProps = {
                value: tab.value,
                selected,
                disabled: !!tab.disabled,
                select: () => select(tab.value),
                props: tabProps
              };

              return (
                <DynamicComponentRenderer key={tab.value} component={tab.label} {...renderProps} />
              );
            }

            return (
              <button
                key={tab.value}
                type="button"
                disabled={tab.disabled}
                className={classNames("GeckoUITabs__tab", tab.className)}
                onClick={() => select(tab.value)}
                {...tabProps}>
                {tab.label}
              </button>
            );
          })}
        </ListElement>

        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = "Tabs";

export default Tabs;
