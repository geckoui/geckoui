import { forwardRef } from "react";

import { classNames } from "../../utils/classNames";
import type { SwitchProps } from "./Switch.types";

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ size = "md", className, thumbClassName, onChange, onKeyDown, ...rest }, ref) => {
    return (
      <label className={classNames("GeckoUISwitch", className)} data-size={size}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="GeckoUISwitch__input"
          onChange={(e) => onChange?.(e.target.checked)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.click();
            }
            onKeyDown?.(e);
          }}
          {...rest}
        />
        <span className={classNames("GeckoUISwitch__thumb", thumbClassName)} data-size={size} />
      </label>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
