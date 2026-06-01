import type { TextareaProps } from "../../Textarea";
import type { RHFBaseProps } from "../RHF.types";

interface InputTransformer {
  input?: (value: string) => string;
  output?: (value: string) => string;
}

export interface RHFTextareaProps
  extends RHFBaseProps,
    Omit<TextareaProps, "name" | "onChange" | "onBlur"> {
  /**
   * This transform object allows you to transform the input value before it is passed to the form.
   * You can also transform the output value before it is passed to the input element.
   *
   * This is the recommended way of transforming in React Hook Form.
   * See the documentation for more information: https://react-hook-form.com/advanced-usage#TransformandParse
   * */
  transform?: InputTransformer;

  /**
   * Callback fired when the value changes
   * This is the actual value of the textarea not the event object
   * */
  onChange?: (value: string) => void;

  /**
   * Callback fired when the input is blurred
   * ```
   * */
  onBlur?: (value: string) => void;
}
