import { DateInputProps } from "../../DateInput";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFDateInputProps extends RHFBaseProps, DateInputProps {
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Callback function when date changes (in addition to form field update)
   */
  onChange?: (date: string | null) => void;
}
