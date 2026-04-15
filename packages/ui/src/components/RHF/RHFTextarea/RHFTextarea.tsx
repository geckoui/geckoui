import type { FC } from "react";

import { classNames } from "../../../utils/classNames";
import { Textarea } from "../../Textarea";
import { RHFController } from "../RHFController";
import type { RHFTextareaProps } from "./RHFTextarea.types";

/**
 * A textarea component integrated with React Hook Form.
 *
 * Supports auto-resizing functionality and automatic error state display.
 * Built on the Textarea component with full React Hook Form integration.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RHFTextarea name="description" />
 *
 * // Auto-resizing textarea
 * <RHFTextarea
 *   name="comments"
 *   autoResize
 * />
 *
 * // With row constraints
 * <RHFTextarea
 *   name="bio"
 *   autoResize
 *   rows={3}
 *   maxRows={10}
 *   placeholder="Tell us about yourself"
 * />
 *
 * // With callbacks
 * <RHFTextarea
 *   name="notes"
 *   onChange={(value) => console.log('Text changed:', value)}
 *   onBlur={(value) => console.log('Final value:', value)}
 * />
 *
 * // Disabled state
 * <RHFTextarea
 *   name="readonly"
 *   disabled
 * />
 * ```
 */
const RHFTextarea: FC<RHFTextareaProps> = ({
  name,
  control,
  rules,
  disabled,
  className,
  onChange,
  onBlur,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={(renderProps) => {
        const { field, fieldState } = renderProps;

        return (
          <Textarea
            className={classNames("GeckoUIRHFTextarea", className)}
            data-error={!disabled && fieldState.error ? "" : undefined}
            {...field}
            {...rest}
            disabled={disabled}
            onBlur={(e) => {
              field.onBlur();
              onBlur?.(e.target.value);
            }}
            onChange={(e) => {
              field.onChange(e.target.value);
              onChange?.(e.target.value);
            }}
          />
        );
      }}
    />
  );
};

RHFTextarea.displayName = "RHFTextarea";

export default RHFTextarea;
