import type { FC } from "react";

import { classNames } from "../../../utils/classNames";
import { CounterInput } from "../../CounterInput";
import { RHFController } from "../RHFController";
import type { RHFCounterInputProps } from "./RHFCounterInput.types";

/**
 * A numeric counter input component integrated with React Hook Form.
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <RHFCounterInput name="quantity" min={0} max={10} />
 * </FormProvider>
 * ```
 */
const RHFCounterInput: FC<RHFCounterInputProps> = ({
  control,
  name,
  rules,
  className,
  onChange,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error);

        return (
          <CounterInput
            className={classNames("GeckoUIRHFCounterInput", className)}
            data-error={hasError || undefined}
            {...rest}
            value={field.value ?? 0}
            onChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
          />
        );
      }}
    />
  );
};

RHFCounterInput.displayName = "RHFCounterInput";

export default RHFCounterInput;
