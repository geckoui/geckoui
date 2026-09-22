import type { FC, ReactNode } from "react";

import type { CheckboxProps } from "../../Checkbox";
import type { RHFBaseProps, RHFRenderArgs } from "../RHF.types";

export interface RHFCheckboxProps
  extends RHFBaseProps,
    Omit<CheckboxProps, "name" | "value" | "onChange" | "onBlur" | "indeterminate"> {
  /**
   * Label that will be displayed next to the checkbox
   * */
  label?: string | FC | ReactNode;

  /**
   * Additional class name to be added to the label
   * */
  labelClassName?: string;

  /**
   * Value to set in the form data when the switch is toggled
   * If value is not provided, value will be toggled between true and false
   * */
  value?: unknown;

  /**
   * Make the checkbox as single selection
   * If single is true, form data will be set with the value provided
   *
   * Eg. If value is 'a', form data will be set with 'a' when checkbox is checked
   *
   * By default, form data will be set with an array of values
   * */
  single?: boolean;

  /**
   * Value to set in the form data when the checkbox is unchecked
   * **Works only when `single` is true**
   * */
  uncheckedValue?: unknown;

  /**
   * Callback fired when the value changes
   * */
  onChange?: (value: unknown) => void;

  /**
   * Prop to check if the checkbox is partially checked
   * You can pass boolean or a function that returns a boolean
   * You can access the renderProps object from RHF to get the field, fieldState, and formState objects
   *
   * ---
   * @example
   * ```js
   *  <>
   *    <RHFCheckbox
   *      name="checkbox"
   *      value="js"
   *      indeterminate={({ field }) => field.value.length !== 2}
   *      label="JavaScript"
   *    />
   *    <RHFCheckbox
   *      name="checkbox"
   *      value="ts"
   *      indeterminate={({ field }) => field.value.length !== 2}
   *      label="TypeScript"
   *    />
   *  </>
   * ```
   * */
  indeterminate?: boolean | ((args: RHFRenderArgs<Record<string, unknown>>) => boolean);

  /**
   * Callback fired when the field is blurred
   * Called alongside React Hook Form's onBlur
   * */
  onBlur?: () => void;
}
