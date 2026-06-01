import type { FC } from "react";
import { useId } from "react";

import { classNames } from "../../../utils/classNames";
import isEqual from "../../../utils/isEqual";
import { Checkbox } from "../../Checkbox";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import { RHFController } from "../RHFController";
import type { RHFCheckboxProps } from "./RHFCheckbox.types";

/**
 * A controlled checkbox component for React Hook Form that preserves value types.
 *
 * Unlike native checkboxes that convert values to strings, this component maintains
 * the original data type. Supports both single-select (like a radio) and multi-select
 * modes with optional indeterminate state.
 *
 * - **Single mode**: Acts like a radio button, stores one value or uncheckedValue
 * - **Multi mode** (default): Stores an array of selected values
 *
 * @example
 * ```tsx
 * // Single checkbox - stores "single" or undefined
 * <RHFCheckbox
 *   name="agreement"
 *   value="agreed"
 *   label="I agree to terms"
 *   single
 * />
 *
 * // Single with custom unchecked value
 * <RHFCheckbox
 *   name="enabled"
 *   value="yes"
 *   uncheckedValue="no"
 *   label="Enable feature"
 *   single
 * />
 *
 * // Multi-select checkboxes - stores array like ["multi1", "multi2"]
 * <div>
 *   <RHFCheckbox name="options" value="multi1" label="Option 1" />
 *   <RHFCheckbox name="options" value="multi2" label="Option 2" />
 *   <RHFCheckbox name="options" value="multi3" label="Option 3" />
 * </div>
 *
 * // With indeterminate state
 * <RHFCheckbox
 *   name="languages"
 *   value="js"
 *   partial={({ field }) => field.value.length !== 2}
 *   label="JavaScript"
 * />
 *
 * // With objects or complex types
 * <RHFCheckbox
 *   name="settings"
 *   value={{ feature: "advanced", enabled: true }}
 *   label="Advanced Features"
 *   single
 * />
 * ```
 */
const RHFCheckbox: FC<RHFCheckboxProps> = ({
  name,
  id,
  control,
  rules,
  label,
  labelClassName,
  disabled,
  value,
  uncheckedValue,
  single,
  onChange,
  partial,
  onBlur,
  ...rest
}) => {
  const _id = useId();

  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={(renderProps) => {
        const { field } = renderProps;
        const isChecked = () => {
          if (value === undefined) return field.value === true;

          if (single) return isEqual(field.value, value);

          if (!Array.isArray(field.value)) return false;

          return field.value.map((e) => JSON.stringify(e)).includes(JSON.stringify(value));
        };

        return (
          <label className="GeckoUIRHFCheckbox group" htmlFor={id || _id}>
            <Checkbox
              {...field}
              {...rest}
              disabled={disabled}
              checked={isChecked()}
              id={id || _id}
              onBlur={(e) => {
                field.onBlur();
                onBlur?.(e);
              }}
              onChange={() => {
                let v: unknown;

                if (value === undefined) {
                  v = !field.value;
                } else if (single) {
                  v = isEqual(field.value, value) ? (uncheckedValue ?? null) : value;
                } else {
                  v = field.value ?? [];
                  if (!Array.isArray(v)) v = [];

                  if (isChecked()) {
                    v = (v as []).filter((e: unknown) => !isEqual(e, value));
                  } else {
                    (v as unknown[]).push(value);
                  }
                }

                field.onChange(v);
                onChange?.(v);
              }}
              partial={typeof partial === "function" ? partial(renderProps) : partial}
              value={undefined}
            />
            <span className={classNames("GeckoUIRHFCheckbox__label", labelClassName)}>
              <DynamicComponentRenderer component={label} />
            </span>
          </label>
        );
      }}
    />
  );
};

RHFCheckbox.displayName = "RHFCheckbox";

export default RHFCheckbox;
