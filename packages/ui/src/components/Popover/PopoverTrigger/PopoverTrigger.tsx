import type { HTMLAttributes, MouseEvent, Ref } from "react";
import { cloneElement } from "react";

import { asChildElement } from "../../../utils/asChildElement";
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

  const child = asChildElement(children);
  const childProps = (child?.props ?? {}) as HTMLAttributes<HTMLElement> & {
    ref?: Ref<HTMLElement>;
  };

  const triggerProps = {
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
  } as HTMLAttributes<HTMLElement>;

  if (child) return cloneElement(child, triggerProps);

  return <span {...triggerProps}>{children}</span>;
};

PopoverTrigger.displayName = "PopoverTrigger";

export default PopoverTrigger;
