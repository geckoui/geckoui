import { classNames } from "../../../utils/classNames";
import type { TabPanelProps } from "../Tabs.types";
import { useTabs } from "../useTabs";

/**
 * The panel a tab reveals, matched to it by `value`.
 *
 * Hidden panels unmount by default, so a form inside one loses its state. Pass
 * `keepMounted` here, or on `Tabs` for all of them, to hide rather than unmount.
 *
 * @example
 * ```tsx
 * <TabPanel value="profile">
 *   <ProfileForm />
 * </TabPanel>
 * ```
 */
const TabPanel = ({ value, keepMounted, className, children, ...rest }: TabPanelProps) => {
  const { selectedValue, keepMounted: keepMountedOnTabs } = useTabs();

  const selected = selectedValue === value;
  const stayMounted = keepMounted ?? keepMountedOnTabs;

  if (!selected && !stayMounted) return null;

  return (
    <div
      role="tabpanel"
      id={`GeckoUITabs-panel-${value}`}
      aria-labelledby={`GeckoUITabs-tab-${value}`}
      tabIndex={0}
      hidden={!selected}
      className={classNames("GeckoUITabs__panel", className)}
      {...rest}>
      {children}
    </div>
  );
};

TabPanel.displayName = "TabPanel";

export default TabPanel;
