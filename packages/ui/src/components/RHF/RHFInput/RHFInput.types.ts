import type { ReactNode } from "react";
import type { ControllerProps } from "react-hook-form";

import type { InputProps } from "../../Input/Input.types";
import type { RHFBaseProps } from "../RHF.types";

interface InputTransformer {
  input?: (value: string) => string;
  output?: (value: string) => string;
}

export interface RHFInputProps
  extends RHFBaseProps,
    Omit<InputProps, "name" | "prefix" | "suffix" | "onChange" | "onBlur"> {
  /**
   * This transform object allows you to transform the input value before it is passed to the form.
   * You can also transform the output value before it is passed to the input element.
   *
   * This is the recommended way of transforming in React Hook Form.
   * See the documentation for more information: https://react-hook-form.com/advanced-usage#TransformandParse
   * */
  transform?: InputTransformer;
  /**
   * Component to render before the input element.
   *
   * You can pass a function that returns a ReactNode or a ReactNode.
   * If you pass a Function, it will have access to the renderProps object.
   * So that you can access the field, fieldState, and formState objects.
   * You can build your prefix component based on these objects.
   *
   * @example
   * ```js
   * <RHFInput
   *  name="name"
   *  prefix={({ field }) => <span>{field.value}</span>}
   * />
   * ```
   * */
  prefix?: ControllerProps["render"] | ReactNode | string;

  /**
   * Component to render after the input element.
   * You can pass a function that returns a ReactNode or a ReactNode.
   * If you pass a Function, it will have access to the renderProps object.
   * So that you can access the field, fieldState, and formState objects.
   * You can build your suffix component based on these objects.
   *
   * @example
   * ```js
   * <RHFInput
   *  name="name"
   *  suffix={({ fieldState }) =>
   *    fieldState.error ? <ErrorIcon /> : null
   *  }
   * />
   * ```
   * */
  suffix?: ControllerProps["render"] | ReactNode | string;

  /**
   * Callback fired when the value changes
   * This is the actual value of the input not the event object
   * */
  onChange?: (value: string) => void;

  /**
   * Callback fired when the input is blurred
   * */
  onBlur?: (value: string) => void;
}
