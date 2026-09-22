import { type CSSProperties, forwardRef, useEffect } from "react";

import { classNames } from "../../utils/classNames";
import { devWarn } from "../../utils/devWarn";
import type { ProgressProps } from "./Progress.types";

/**
 * How far along something is.
 *
 * @example
 * ```tsx
 * <Progress value={40} />
 * <Progress value={3} max={7} />
 * <Progress />
 * <Progress value={100} color="success" size="lg" />
 * <Progress value={40} label={({ percent }) => `${percent}%`} />
 * ```
 */
const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, color = "primary", size = "md", label, className, ...rest }, ref) => {
    const indeterminate = value === undefined;

    useEffect(() => {
      if (max <= 0) devWarn(`Progress needs a max above 0, but got ${max}.`);
    }, [max]);

    const clamped = indeterminate || max <= 0 ? 0 : Math.min(Math.max(value, 0), max);
    const percent = max <= 0 ? 0 : Math.round((clamped / max) * 100);

    const content =
      typeof label === "function"
        ? indeterminate
          ? null
          : label({ percent, value: clamped, max })
        : label;

    return (
      <div
        ref={ref}
        className={classNames("GeckoUIProgress", className)}
        data-size={size}
        data-color={color}
        data-indeterminate={indeterminate || undefined}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        // Left off while indeterminate, which is what tells a screen reader the value is
        // unknown rather than zero.
        aria-valuenow={indeterminate ? undefined : clamped}
        {...rest}>
        {content != null && content !== false && (
          <div className="GeckoUIProgress__label">{content}</div>
        )}

        <div className="GeckoUIProgress__track">
          <div
            className="GeckoUIProgress__bar"
            style={{ "--gecko-progress-percent": `${percent}%` } as CSSProperties}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;
