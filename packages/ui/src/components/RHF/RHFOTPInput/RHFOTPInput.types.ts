import type { OTPInputProps } from "../../OTPInput";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFOTPInputProps
  extends RHFBaseProps,
    Omit<OTPInputProps, "value" | "onChange" | "onBlur"> {
  /**
   * Callback fired when the value changes
   * Called alongside React Hook Form's onChange with the new code
   * */
  onChange?: (value: string) => void;

  /**
   * Callback fired when the input is blurred
   * Called alongside React Hook Form's onBlur
   * */
  onBlur?: () => void;
}
