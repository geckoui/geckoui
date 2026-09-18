import type { HTMLAttributes, MouseEvent, Ref } from "react";
import { Children, cloneElement, isValidElement } from "react";

import type { PopoverTriggerProps } from "../Popover.types";
import { usePopover } from "../usePopover";

/**
 * Whatever opens the popover. The child is used as the trigger itself rather than
 * wrapped, so it keeps its own tag, styling and handlers.
 *
 * @example
 * ```tsx
 * <PopoverTrigger>
 *   <Button>Filters</Button>
 * </PopoverTrigger>
 * ```
 */
const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  const { open, toggle, disabled, floating, setTriggerNode } = usePopover();

  const child = Children.only(children);

  if (!isValidElement(child)) return null;

  const childProps = child.props as HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };

  return cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      floating.refs.setReference(node);
      setTriggerNode(node);

      const forwardedRef = childProps.ref;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as { current: HTMLElement | null }).current = node;
      }
    },
    "aria-expanded": open,
    "aria-haspopup": "dialog",
    "data-state": open ? "open" : "closed",
    onClick: (e: MouseEvent<HTMLElement>) => {
      childProps.onClick?.(e);

      if (disabled) return;

      toggle();
    }
  } as HTMLAttributes<HTMLElement>);
};

PopoverTrigger.displayName = "PopoverTrigger";

export default PopoverTrigger;
