import { forwardRef, useId } from "react";

import { classNames } from "../../utils/classNames";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { InputProps } from "./Input.types";

/**
 * A flexible input component with support for prefix and suffix elements.
 *
 * The prefix, suffix, and input elements automatically adjust their width based on content.
 * Use `inputClassName` to style the input element itself (e.g., placeholder styles).
 * Use `className` to style the container that wraps the prefix, input, and suffix.
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input placeholder="Enter your name" />
 *
 * // With prefix (icon or text)
 * <Input
 *   prefix={<SearchIcon />}
 *   placeholder="Search..."
 * />
 *
 * // With suffix
 * <Input
 *   type="email"
 *   suffix="@example.com"
 *   placeholder="username"
 * />
 *
 * // With both prefix and suffix
 * <Input
 *   prefix="$"
 *   suffix=".00"
 *   type="number"
 *   placeholder="0"
 * />
 *
 * // Custom styling
 * <Input
 *   className="border-blue-500"
 *   inputClassName="placeholder:text-gray-400"
 *   placeholder="Custom styled input"
 * />
 *
 * // Disabled state
 * <Input disabled placeholder="Disabled input" />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, prefix, id, suffix, inputClassName, className, disabled, readOnly, ...rest }, ref) => {
    const _id = useId();

    return (
      <label
        aria-disabled={disabled}
        data-state={disabled ? "disabled" : "enabled"}
        data-readonly={readOnly || undefined}
        className={classNames("GeckoUIInput group", className)}
        htmlFor={id ?? _id}>
        <DynamicComponentRenderer component={prefix} inputRef={ref} />

        <input
          className={classNames("GeckoUIInput__input", inputClassName)}
          disabled={disabled}
          id={id ?? _id}
          name={name}
          ref={ref}
          readOnly={readOnly}
          {...rest}
        />

        <DynamicComponentRenderer component={suffix} inputRef={ref} />
      </label>
    );
  }
);

Input.displayName = "Input";

export default Input;
