import { Placement } from "@floating-ui/react";
import type { FC, PropsWithChildren, ReactNode } from "react";

export interface TooltipProps extends PropsWithChildren {
  /**
   * The content of the tooltip
   * */
  content?: string | ReactNode | FC;

  /**
   * The duration of the delay before the tooltip appears
   * */
  delayDuration?: number;

  /**
   * Classname to apply to the tooltip
   * */
  className?: string;

  /**
   * Classname to apply to the tooltip trigger
   * ie. the element that triggers the tooltip to appear
   * @example
   *
   * ```js
   * <Tooltip content="hello world">
   *  <Button>Hover me</Button> // <-- This is the tooltip trigger
   * </Tooltip>
   * ```
   * */
  triggerClassName?: string;

  /**
   * Classname to apply to the tooltip arrow
   * */
  arrowClassName?: string;

  /**
   * Whether to use the child element directly as the trigger.
   * Use this to avoid invalid button nesting errors when using a button as the trigger.
   * */
  triggerAsChild?: boolean;

  /**
   * The background color of the tooltip and the arrow pointing to the target
   * */
  backgroundColor?: string;

  /**
   * The side of the tooltip to display
   * */
  placement?: Placement;

  /**
   * The offset of the tooltip from the trigger
   * */
  sideOffset?: number;
}
