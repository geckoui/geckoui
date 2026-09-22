import type { FC, ReactElement } from "react";
import type { Control } from "react-hook-form";

import { classNames } from "../../../utils/classNames";
import { devWarn } from "../../../utils/devWarn";
import { Label } from "../../Label";
import { RHFError } from "../RHFError";
import type { RHFInputGroupProps } from "./RHFInputGroup.types";

/**
 * RHFInputGroup combines a form field label, input component, and error message into a cohesive unit.
 * Automatically detects RHF input components in children (even nested) and extracts their name and control
 * to display validation errors. Reduces boilerplate for standard form field layouts.
 *
 * **Note:** This is a layout convenience component. For custom layouts, use Label and RHFError separately.
 *
 * @example
 * Standard form field:
 *
 * ```tsx
 * <RHFInputGroup label="Email Address" required>
 *   <RHFInput
 *     name="email"
 *     type="email"
 *     placeholder="you@example.com"
 *   />
 * </RHFInputGroup>
 * ```
 *
 * @example
 * Field with helper text (nested structure):
 *
 * ```tsx
 * <RHFInputGroup
 *   label="Password"
 *   required
 *   tooltip="Must be at least 12 characters"
 * >
 *   <div className="space-y-2">
 *     <RHFInput name="password" type="password" />
 *     <ul className="text-sm text-gray-600">
 *       <li>✓ At least 8 characters</li>
 *       <li>✓ Include a number</li>
 *       <li>✓ Include a special character</li>
 *     </ul>
 *   </div>
 * </RHFInputGroup>
 * ```
 *
 * @example
 * Multiple inputs (only first input's errors shown):
 *
 * ```tsx
 * <RHFInputGroup label="Phone Number">
 *   <div className="flex gap-2">
 *     <RHFInput name="countryCode" placeholder="+1" className="w-20" />
 *     <RHFInput name="phoneNumber" placeholder="555-0100" />
 *   </div>
 * </RHFInputGroup>
 * ```
 */
const RHFInputGroup: FC<RHFInputGroupProps> = ({
  className,
  errorClassName,
  children,
  label,
  labelClassName,
  ...restLabelProps
}) => {
  if (!children) {
    devWarn("RHFInputGroup must have children");
    return null;
  }

  const input = findInput(children);

  if (!input) {
    devWarn("RHFInputGroup does not contain any RHF input component");
  }

  const { id, name, control } = (input?.props || {}) as {
    id?: string;
    name?: string;
    control?: Control;
  };

  return (
    <div className={classNames("GeckoUIRHFInputGroup", className)}>
      {label ? (
        <Label htmlFor={id} className={labelClassName} {...restLabelProps}>
          {label}
        </Label>
      ) : null}
      {children}
      {name ? <RHFError className={errorClassName} control={control} name={name} /> : null}
    </div>
  );
};

export default RHFInputGroup;

/**
 * Recursively find the first `RHF` input component in the children
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- to be able to call prototype methods
function findInput(el: any): ReactElement | null {
  if (typeof el === "string") {
    return null;
  }

  if (el.type?.displayName?.toString().toLowerCase().includes("rhf")) {
    return el as ReactElement;
  }

  if (el.props?.children) {
    return findInput(el.props.children);
  }

  if (Array.isArray(el)) {
    for (const child of el) {
      const input = findInput(child);

      if (input) {
        return input;
      }
    }
  }

  return null;
}
