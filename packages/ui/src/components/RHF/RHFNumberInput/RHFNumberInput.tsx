import type { FC } from "react";

import { classNames } from "../../../utils/classNames";
import { formatNumericInput } from "../../../utils/formatNumericInput";
import { RHFInput } from "../RHFInput";
import type { RHFNumberInputProps } from "./RHFNumberInput.types";

/**
 * React hook form controlled number input.
 * This input only allows numbers and a single decimal point.
 * You can specify the maximum number of decimal places and whole digit places.
 * By default the input is strict, meaning it will remove leading zeros and convert into valid numbers.
 * You can disable this behavior by setting the `strict` prop to `false`.
 *
 * @example
 * ```tsx
 * // Basic number input
 * <RHFNumberInput name="balance" />
 *
 * // Integer only (no decimals)
 * <RHFNumberInput
 *   name="quantity"
 *   maxFractionDigits={0}
 * />
 *
 * // Room numbers with leading zeros allowed
 * <RHFNumberInput
 *   name="roomNumber"
 *   strict={false}
 *   maxWholeDigitPlaces={5}
 *   maxFractionDigits={0}
 * />
 *
 * // Precise decimal values
 * <RHFNumberInput
 *   name="price"
 *   maxFractionDigits={2}
 *   maxWholeDigitPlaces={10}
 * />
 *
 * // Positive numbers only
 * <RHFNumberInput
 *   name="age"
 *   positiveOnly
 *   maxFractionDigits={0}
 * />
 * ```
 */
const RHFNumberInput: FC<RHFNumberInputProps> = ({
  strict = true,
  maxFractionDigits,
  maxWholeDigitPlaces,
  transform,
  className,
  positiveOnly = false,
  ...rest
}) => {
  function transformOutput(value: string) {
    if (typeof transform?.output === "function") return transform.output(value);

    return formatNumericInput(value, {
      strict,
      positiveOnly,
      maxFractionDigits,
      maxWholeDigitPlaces
    });
  }

  return (
    <RHFInput
      inputMode="decimal"
      type="text"
      {...rest}
      className={classNames("GeckoUIRHFNumberInput", className)}
      transform={{
        input: transform?.input,
        output: transform?.output ?? transformOutput
      }}
    />
  );
};

RHFNumberInput.displayName = "RHFNumberInput";

export default RHFNumberInput;
