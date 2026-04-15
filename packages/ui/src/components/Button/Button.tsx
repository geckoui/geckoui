import { forwardRef } from "react";

import { classNames } from "../../utils/classNames";
import type { ButtonProps } from "./Button.types";

/**
 * A flexible button component that extends the native HTML button with customizable styles.
 *
 * Supports different variants (filled, outlined, ghost, icon), sizes (sm, md, lg), and colors.
 * All styling is applied via TailwindCSS classes, which can be overridden using the `className` prop.
 *
 * By default, the button adds spacing between child elements. You can override this by
 * passing custom gap classes.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="outlined" size="md">
 *   Add
 * </Button>
 *
 * // With different variants
 * <Button variant="filled">Save</Button>
 * <Button variant="outlined">Cancel</Button>
 * <Button variant="ghost">Learn More</Button>
 *
 * // Custom styling
 * <Button
 *   variant="filled"
 *   size="sm"
 *   className="bg-cyan-500 gap-4 px-4 py-2 disabled:text-red-500"
 * >
 *   <span>+</span>
 *   <span>Add</span>
 * </Button>
 *
 * // Disabled state
 * <Button disabled>Disabled Button</Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "filled", size = "md", color = "primary", ...rest }, ref) => {
    return (
      <button
        data-variant={variant}
        data-color={color}
        data-size={size}
        className={classNames("GeckoUIButton", className)}
        ref={ref}
        type="button"
        {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
