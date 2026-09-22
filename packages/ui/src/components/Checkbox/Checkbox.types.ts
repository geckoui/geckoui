import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * If true, the checkbox shows the IndeterminateIcon instead of the check icon.
   * */
  indeterminate?: boolean;
}
