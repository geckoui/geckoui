import { forwardRef } from "react";

import { classNames } from "../../utils/classNames";
import type { SkeletonProps } from "./Skeleton.types";

/**
 * A placeholder that holds the space content will take while it loads.
 *
 * Size it with `className` the way you would size the real thing, so the page does not
 * move when the content arrives.
 *
 * @example
 * ```tsx
 * <Skeleton />
 * <Skeleton lines={3} />
 * <Skeleton shape="circle" className="size-10" />
 * <Skeleton shape="rounded" className="h-32 w-full" />
 * ```
 *
 * @example
 * Wrapping the real thing, so there is no ternary at the call site:
 *
 * ```tsx
 * <Skeleton loading={isLoading} shape="circle" className="size-10">
 *   <Avatar src={user.image} />
 * </Skeleton>
 * ```
 */
const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      shape = "text",
      animation = "pulse",
      lines = 1,
      loading = true,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    if (!loading) return <>{children}</>;

    const count = shape === "text" ? Math.max(1, Math.trunc(lines)) : 1;

    return (
      <div
        ref={ref}
        className={classNames("GeckoUISkeleton", className)}
        data-shape={shape}
        data-animation={animation}
        // Silent rather than announced. There is no text to read, and a page of
        // placeholders would say "loading" once per placeholder. `aria-busy` marks the
        // region as pending without adding anything to read.
        aria-busy="true"
        {...rest}>
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="GeckoUISkeleton__bar" />
        ))}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

export default Skeleton;
