import type { FC, ReactNode } from "react";

import type { RadioProps } from "../../Radio";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFRadioProps
  extends RHFBaseProps,
    Omit<RadioProps, "name" | "value" | "onChange" | "onBlur"> {
  /**
   * Label to display next to the radio button
   * */
  label?: string | ReactNode | FC;

  /**
   * Style for the label of the radio button.
   * */
  labelClassName?: string;

  /**
   * Value to set in the form data when the radio button is selected
   * Value can be any type and it will be set in the form data as it is without any transformation
   * eg. In native radio input, the value is always a string but in RHFRadio it can be any type
   * */
  value?: unknown;

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
