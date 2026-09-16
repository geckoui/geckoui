import { forwardRef } from "react";

import { classNames } from "../../utils/classNames";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { BadgeProps } from "./Badge.types";

/**
 * A small inline label for status, counts and categories.
 *
 * Two independent axes: `variant` is how it is filled, `color` is what it means. So a
 * success badge can be solid, tinted or outlined without changing what it says.
 *
 * @example
 * ```tsx
 * <Badge>Draft</Badge>
 * <Badge color="success">Active</Badge>
 * <Badge variant="filled" color="error">Failed</Badge>
 * <Badge variant="outlined" color="info" size="sm">Beta</Badge>
 *
 * // Status dot, custom icon, shapes
 * <Badge color="success" dot>Live</Badge>
 * <Badge color="primary" icon={<StarIcon />}>Featured</Badge>
 * <Badge><Avatar size="xs" />Alice</Badge>
 * <Badge shape="pill" color="primary">New</Badge>
 * <Badge shape="square">v2.0</Badge>
 * ```
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      icon,
      variant = "soft",
      color = "default",
      size = "md",
      shape = "rounded",
      dot = false,
      ...rest
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={classNames("GeckoUIBadge", className)}
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-shape={shape}
        {...rest}>
        {icon ? (
          <DynamicComponentRenderer component={icon} />
        ) : dot ? (
          <span className="GeckoUIBadge__dot" aria-hidden="true" />
        ) : null}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
