import type { FC } from "react";

import { TimeInput } from "../../TimeInput";
import { RHFController } from "../RHFController";
import type { RHFTimeInputProps } from "./RHFTimeInput.types";

/**
 * React Hook Form wrapper for the TimeInput component.
 *
 * The field holds the 24 hour value, whatever the display format is, so a resolver can
 * compare two times without parsing them.
 *
 * @example
 * ```tsx
 * <RHFTimeInput name="startsAt" />
 * <RHFTimeInput name="startsAt" format="hh:mm A" step={15} min="09:00" max="17:00" />
 * ```
 */
const RHFTimeInput: FC<RHFTimeInputProps> = ({ name, control, rules, onChange, ...rest }) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={(renderProps) => {
        const { field, fieldState } = renderProps;
        const hasError = Boolean(fieldState.error);

        return (
          <TimeInput
            value={field.value || ""}
            onChange={(time) => {
              field.onChange(time);
              onChange?.(time);
            }}
            {...rest}
            hasError={hasError}
          />
        );
      }}
    />
  );
};

RHFTimeInput.displayName = "RHFTimeInput";

export default RHFTimeInput;
