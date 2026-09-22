import type { FC } from "react";
import { useId } from "react";

import { classNames } from "../../../utils/classNames";
import isEqual from "../../../utils/isEqual";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import { Radio } from "../../Radio";
import { RHFController } from "../RHFController";
import type { RHFRadioProps } from "./RHFRadio.types";

/**
 * A controlled radio input component for React Hook Form.
 *
 * Unlike native radio inputs that convert values to strings, this component preserves
 * the original data type of the value. You can use objects, arrays, booleans, strings,
 * or any other value type (except undefined).
 *
 * @example
 * ```tsx
 * // With object value
 * <RHFRadio name="radio" value={{ key: "value" }} label="Object" />
 *
 * // With array value
 * <RHFRadio name="radio" value={[1, 2, 3, 4, 5]} label="Array" />
 *
 * // With boolean value
 * <RHFRadio name="radio" value={true} label="Boolean" />
 *
 * // With string value
 * <RHFRadio name="radio" value="string" label="String" />
 *
 * // Radio group example
 * <div>
 *   <RHFRadio name="plan" value="free" label="Free Plan" />
 *   <RHFRadio name="plan" value="pro" label="Pro Plan" />
 *   <RHFRadio name="plan" value="enterprise" label="Enterprise Plan" />
 * </div>
 *
 * // With onChange callback
 * <RHFRadio
 *   name="radio"
 *   value="option1"
 *   label="Option 1"
 *   onChange={(value) => console.log('Selected:', value)}
 * />
 * ```
 */
const RHFRadio: FC<RHFRadioProps> = ({
  name,
  control,
  rules,
  disabled,
  id,
  label,
  labelClassName,
  value,
  onChange,
  onBlur,
  ...rest
}) => {
  const _id = useId();
  const uniqueId = id || _id;

  if (value === undefined || value === null) {
    throw new Error("RHFRadio: value cannot be undefined or null");
  }

  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <label className="GeckoUIRHFRadio group" htmlFor={uniqueId}>
            <Radio
              aria-invalid={Boolean(fieldState.error) || undefined}
              {...field}
              {...rest}
              checked={isEqual(field.value, value)}
              disabled={disabled}
              id={uniqueId}
              onBlur={() => {
                field.onBlur();
                onBlur?.();
              }}
              onChange={() => {
                field.onChange(value);
                onChange?.(value);
              }}
              value={undefined}
            />

            <span className={classNames("GeckoUIRHFRadio__label", labelClassName)}>
              <DynamicComponentRenderer component={label} />
            </span>
          </label>
        );
      }}
    />
  );
};

RHFRadio.displayName = "RHFRadio";

export default RHFRadio;
