import type { SwitchProps } from "../../Switch";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFSwitchProps
  extends RHFBaseProps,
    Omit<SwitchProps, "name" | "value" | "onBlur"> {
  /**
   * Value to set in the form data when the switch is toggled
   * If value is not provided, value will be toggled between true and false
   * */
  value?: unknown;

  /**
   * Value to set in the form data when the switch is toggled off
   * **Works only when `value` is provided**
   * */
  uncheckedValue?: unknown;

  /**
   * Callback fired when the value changes
   * */
  onChange?: (value: unknown) => void;

  /**
   * Callback fired when the field is blurred
   * Called alongside React Hook Form's onBlur
   * */
  onBlur?: () => void;
}
