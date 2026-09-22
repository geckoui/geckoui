import type { TimeInputProps } from "../../TimeInput";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFTimeInputProps extends RHFBaseProps, TimeInputProps {
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Callback function when the time changes (in addition to the form field update)
   */
  onChange?: (time: string | null) => void;
}
