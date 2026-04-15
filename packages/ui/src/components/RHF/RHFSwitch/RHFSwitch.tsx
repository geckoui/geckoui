import type { FC } from "react";

import { classNames } from "../../../utils/classNames";
import isEqual from "../../../utils/isEqual";
import { Switch } from "../../Switch";
import { RHFController } from "../RHFController";
import type { RHFSwitchProps } from "./RHFSwitch.types";

/**
 * A controlled switch component for React Hook Form.
 *
 * By default, the switch stores boolean values (true/false) in the form state.
 * You can customize the checked and unchecked values using the `value` and `uncheckedValue` props.
 * Unlike native radio inputs, values maintain their original data types and are not converted to strings.
 *
 * @example
 * ```tsx
 * // Basic usage - stores boolean (true or false)
 * <RHFSwitch name="switch" />
 *
 * // Custom value when checked, undefined when unchecked
 * <RHFSwitch name="switch" value="custom-value" />
 *
 * // Custom value with object
 * <RHFSwitch name="switch2" value={{ key: 'value' }} />
 *
 * // Custom values for both checked and unchecked states
 * <RHFSwitch name="switch" value={1} uncheckedValue={0} />
 * <RHFSwitch name="enabled" value="yes" uncheckedValue="no" />
 * ```
 */
const RHFSwitch: FC<RHFSwitchProps> = ({
  name,
  control,
  rules,
  disabled,
  value,
  uncheckedValue,
  size,
  onChange,
  className,
  thumbClassName,
  onBlur,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => {
        const isChecked =
          value === undefined ? (field.value as boolean) : isEqual(field.value, value);

        const handleUpdate = () => {
          let newValue;

          if (value === undefined) {
            newValue = !isChecked;
          } else {
            newValue = !isChecked ? value : uncheckedValue;
          }

          field.onChange(newValue);
          onChange?.(newValue);
        };

        return (
          <Switch
            {...field}
            {...rest}
            disabled={disabled}
            checked={isChecked}
            className={classNames("GeckoUIRHFSwitch", className)}
            onBlur={(e) => {
              field.onBlur();
              onBlur?.(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUpdate();
              }
            }}
            onChange={handleUpdate}
            size={size}
            thumbClassName={classNames("GeckoUIRHFSwitch__thumb", thumbClassName)}
            value={undefined}
          />
        );
      }}
    />
  );
};

RHFSwitch.displayName = "RHFSwitch";

export default RHFSwitch;
