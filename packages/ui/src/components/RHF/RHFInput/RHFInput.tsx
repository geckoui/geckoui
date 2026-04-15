import type { FC } from "react";

import { classNames } from "../../../utils/classNames";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import { Input } from "../../Input";
import { RHFController } from "../RHFController";
import type { RHFInputProps } from "./RHFInput.types";

/**
 * An input component integrated with React Hook Form.
 *
 * Automatically displays error states with a red border when validation fails.
 * Supports value transformation for input/output formatting.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RHFInput name="username" />
 *
 * // With prefix and suffix
 * <RHFInput
 *   name="amount"
 *   prefix="$"
 *   suffix="USD"
 * />
 *
 * // Value transformation (e.g., formatting phone numbers)
 * <RHFInput
 *   name="phone"
 *   transform={{
 *     input: (value) => formatPhoneNumber(value),
 *     output: (value) => sanitizePhoneNumber(value)
 *   }}
 * />
 *
 * // Custom error icon in suffix
 * <RHFInput
 *   name="email"
 *   suffix={({ fieldState }) =>
 *     fieldState.error ? <ErrorIcon /> : null
 *   }
 * />
 * ```
 */
const RHFInput: FC<RHFInputProps> = ({
  control,
  name,
  className,
  rules,
  disabled,
  prefix,
  suffix,
  transform,
  onBlur,
  onChange,
  onKeyDown,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={(renderProps) => {
        const { field, fieldState } = renderProps;
        const hasError = Boolean(fieldState.error);

        const value = transform?.input
          ? transform.input(field.value as string)
          : (field.value as string);

        return (
          <Input
            className={classNames("GeckoUIRHFInput", className)}
            data-error={hasError || undefined}
            prefix={
              prefix ? <DynamicComponentRenderer component={prefix} {...renderProps} /> : null
            }
            suffix={<DynamicComponentRenderer component={suffix} {...renderProps} />}
            {...field}
            {...rest}
            disabled={disabled}
            onBlur={() => {
              onBlur?.(value);
              field.onBlur();
            }}
            onChange={(e) => {
              const outputValue = transform?.output
                ? transform.output(e.target.value)
                : e.target.value;

              field.onChange(outputValue);
              onChange?.(outputValue);
            }}
            value={value ?? ""}
          />
        );
      }}
    />
  );
};

RHFInput.displayName = "RHFInput";

export default RHFInput;
