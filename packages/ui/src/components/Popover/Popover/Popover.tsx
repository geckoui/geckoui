import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  useFloating
} from "@floating-ui/react";
import { useEffect, useRef, useState } from "react";

import { classNames } from "../../../utils/classNames";
import type { PopoverProps } from "../Popover.types";
import { PopoverContext } from "../usePopover";

/**
 * A panel anchored to whatever opens it, holding anything you like.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger>
 *     <Button>Filters</Button>
 *   </PopoverTrigger>
 *
 *   <PopoverContent>
 *     <FilterForm />
 *   </PopoverContent>
 * </Popover>
 * ```
 */
const Popover = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  offset = 6,
  floatingStrategy,
  dismissOnEscape = true,
  dismissOnOutsideClick = true,
  arrow = false,
  disabled = false,
  className,
  children,
  ...rest
}: PopoverProps) => {
  const arrowRef = useRef<SVGSVGElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = disabled ? false : isControlled ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (disabled) return;
    if (!isControlled) setInternalOpen(next);

    onOpenChange?.(next);
  };

  const close = () => {
    if (!open) return;

    setOpen(false);
    // Send focus back where it came from, or a keyboard user is left stranded at the
    // top of the document.
    triggerRef.current?.focus();
  };

  const floating = useFloating({
    placement,
    strategy: floatingStrategy,
    middleware: [
      offsetMiddleware(offset),
      flip({ padding: 6 }),
      shift({ padding: 6 }),
      ...(arrow ? [arrowMiddleware({ element: arrowRef })] : [])
    ],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen
  });

  useEffect(() => {
    if (!dismissOnOutsideClick || !open) return;

    // Listening for `click` rather than `mousedown` on purpose. On mousedown this would
    // close before the clicked element's own handler ran, so an outside button wired to
    // `setOpen(o => !o)` would read the closed state and open it straight back up.
    const dismiss = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;

      setOpen(false);
    };

    document.addEventListener("click", dismiss);

    return () => document.removeEventListener("click", dismiss);
  });

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        close,
        toggle: () => setOpen(!open),
        disabled,
        arrow,
        dismissOnEscape,
        floating,
        arrowRef,
        setTriggerNode: (node) => {
          triggerRef.current = node;
        }
      }}>
      <div
        ref={rootRef}
        className={classNames("GeckoUIPopover", className)}
        onKeyDown={(e) => {
          // Handled here rather than through useEscListener, which ignores Escape from a
          // text field on purpose. A popover often holds a form, and Escape should shut
          // it from inside one.
          if (!dismissOnEscape || !open || e.key !== "Escape") return;

          e.stopPropagation();
          close();
        }}
        {...rest}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

Popover.displayName = "Popover";

export default Popover;
