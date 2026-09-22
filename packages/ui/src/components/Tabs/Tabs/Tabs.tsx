import { useMemo, useState } from "react";

import { classNames } from "../../../utils/classNames";
import type { TabsProps } from "../Tabs.types";
import { findTabs } from "../Tabs.utils";
import { TabsContext } from "../useTabs";

/**
 * Holds which tab is selected, and the look shared by the tabs and their panels.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="profile">
 *   <TabList>
 *     <Tab value="profile">Profile</Tab>
 *     <Tab value="billing">Billing</Tab>
 *   </TabList>
 *
 *   <TabPanel value="profile"><ProfileForm /></TabPanel>
 *   <TabPanel value="billing"><BillingForm /></TabPanel>
 * </Tabs>
 * ```
 *
 * @example
 * As navigation, with the router holding the state and no panels:
 *
 * ```tsx
 * <Tabs as="nav" value={pathname}>
 *   <TabList>
 *     <Tab value="/settings/profile" asChild>
 *       <Link href="/settings/profile">Profile</Link>
 *     </Tab>
 *   </TabList>
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
  children,
  ...rest
}: TabsProps) => {
  // Tabs can be nested in any layout, so they are found by walking the tree rather
  // than by reading direct children.
  const firstEnabled = useMemo(
    () => findTabs(children).find((tab) => !tab.disabled)?.value,
    [children]
  );

  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : (internalValue ?? firstEnabled);

  const select = (next: string) => {
    if (!isControlled) setInternalValue(next);

    onChange?.(next);
  };

  return (
    <TabsContext.Provider
      value={{ selectedValue, select, keepMounted, isNav: as === "nav", orientation }}>
      <div
        className={classNames("GeckoUITabs", className)}
        data-variant={variant}
        data-size={size}
        data-orientation={orientation}
        data-full-width={fullWidth || undefined}
        {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = "Tabs";

export default Tabs;
