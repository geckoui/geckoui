import type { FC } from "react";

import { DateInput } from "../../DateInput";
import { RHFController } from "../RHFController";
import type { RHFDateInputProps } from "./RHFDateInput.types";

/**
 * React Hook Form wrapper for the DateInput component.
 *
 * Integrates DateInput with React Hook Form for seamless form management with
 * automatic validation and error handling.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RHFDateInput name="birthDate" />
 *
 * // With callbacks
 * <RHFDateInput
 *   name="appointmentDate"
 *   onBlur={(value) => console.log('Date changed:', value)}
 * />
 *
 * // Disabled state
 * <RHFDateInput
 *   name="startDate"
 *   disabled
 * />
 *
 * // With custom styling
 * <RHFDateInput
 *   name="endDate"
 *   className="custom-date-input"
 * />
 * ```
 */
const RHFDateInput: FC<RHFDateInputProps> = ({ name, control, rules, onChange, ...rest }) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={(renderProps) => {
        const { field, fieldState } = renderProps;
        const hasError = Boolean(fieldState.error);

        return (
          <DateInput
            value={field.value || ""}
            onChange={(date) => {
              field.onChange(date);
              onChange?.(date);
            }}
            {...rest}
            aria-invalid={hasError || undefined}
          />
        );
      }}
    />
  );
};

RHFDateInput.displayName = "RHFDateInput";

export default RHFDateInput;
