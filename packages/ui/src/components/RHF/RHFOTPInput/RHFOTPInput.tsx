import type { FC } from "react";

import { classNames } from "../../../utils/classNames";
import { OTPInput } from "../../OTPInput";
import { RHFController } from "../RHFController";
import type { RHFOTPInputProps } from "./RHFOTPInput.types";

/**
 * An OTP (One-Time Password) input component integrated with React Hook Form.
 *
 * By default, only numeric input is allowed. You can change this behavior
 * by setting the `numberOnly` prop to false to allow alphanumeric input.
 *
 * @example
 * ```tsx
 * // Basic usage - numbers only, default 6 digits
 * <RHFOTPInput name="otp" />
 *
 * // Custom length
 * <RHFOTPInput name="code" length={4} />
 *
 * // Allow alphanumeric input
 * <RHFOTPInput
 *   name="verificationCode"
 *   numberOnly={false}
 *   length={8}
 * />
 *
 * // With completion callback
 * <RHFOTPInput
 *   name="otp"
 *   onOTPComplete={(value) => {
 *     console.log('OTP entered:', value);
 *     // Auto-submit or verify OTP
 *   }}
 * />
 * ```
 */
const RHFOTPInput: FC<RHFOTPInputProps> = ({
  control,
  name,
  rules,
  disabled,
  className,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      disabled={disabled}
      render={({ field, fieldState }) => {
        return (
          <OTPInput
            className={classNames("GeckoUIRHFOTPInput", className)}
            data-error={!disabled && fieldState.error ? "" : undefined}
            disabled={disabled}
            {...rest}
            {...field}
          />
        );
      }}
    />
  );
};

RHFOTPInput.displayName = "RHFOTPInput";

export default RHFOTPInput;
