import { classNames } from "../../../utils/classNames";
import type { TabProps } from "../Tabs.types";
import { useTabs } from "../useTabs";

/**
 * One tab and, optionally, its panel.
 *
 * `Tabs` reads `value`, `label` and `disabled` to build the strip, so this renders only
 * the panel. A tab with no children renders nothing here, which is what navigation tabs
 * want.
 *
 * @example
 * ```tsx
 * <Tab value="profile" label="Profile">
 *   <ProfileForm />
 * </Tab>
 * ```
 *
 * @example
 * Bring your own element, for navigation:
 *
 * ```tsx
 * <Tab
 *   value="/settings/profile"
 *   label={({ props }) => <Link href="/settings/profile" {...props}>Profile</Link>}
 * />
 * ```
 */
const Tab = ({ value, className, panelClassName, keepMounted, children }: TabProps) => {
  const { selectedValue, keepMounted: keepMountedOnTabs } = useTabs();

  void className;

  if (!children) return null;

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
      className={classNames("GeckoUITabs__panel", panelClassName)}>
      {children}
    </div>
  );
};

Tab.displayName = "Tab";

export default Tab;
