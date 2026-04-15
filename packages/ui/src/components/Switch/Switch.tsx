import { Switch as HeadlessSwitch } from "@headlessui/react";
import { forwardRef } from "react";

import { classNames } from "../../utils/classNames";
import type { SwitchProps } from "./Switch.types";

/**
 * Switch is a toggle component built on HeadlessUI that provides an accessible
 * on/off control. It supports multiple sizes, controlled and uncontrolled modes,
 * and integrates seamlessly with forms.
 *
 * @example
 * Toggle feature in settings:
 *
 * ```tsx
 * const [notificationsEnabled, setNotificationsEnabled] = useState(true);
 *
 * <div className="flex items-center gap-3">
 *   <Switch
 *     checked={notificationsEnabled}
 *     onChange={setNotificationsEnabled}
 *     size="md"
 *   />
 *   <span>Enable email notifications</span>
 * </div>
 * ```
 *
 * @example
 * Uncontrolled with default value:
 *
 * ```tsx
 * <Switch defaultChecked={true} size="lg" />
 * ```
 *
 * @example
 * Custom styling and sizes:
 *
 * ```tsx
 * <Switch
 *   checked={darkMode}
 *   onChange={toggleDarkMode}
 *   size="sm"
 *   className="bg-blue-500 data-[checked]:bg-green-600"
 *   thumbClassName="shadow-lg"
 * />
 * ```
 *
 * @see https://headlessui.com/react/switch for advanced usage
 */
const Switch = forwardRef<null, SwitchProps>(
  ({ className, thumbClassName, size = "md", ...rest }, ref) => {
    return (
      <HeadlessSwitch
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            return true;
          }
        }}
        className={classNames("group GeckoUISwitch", className)}
        data-size={size}
        {...rest}
        ref={ref}>
        <span className={classNames("GeckoUISwitch__thumb", thumbClassName)} data-size={size} />
      </HeadlessSwitch>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
