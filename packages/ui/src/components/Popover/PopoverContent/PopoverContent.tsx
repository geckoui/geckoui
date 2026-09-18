import { FloatingArrow } from "@floating-ui/react";
import { useEffect, useRef } from "react";

import { classNames } from "../../../utils/classNames";
import type { PopoverContentProps } from "../Popover.types";
import { usePopover } from "../usePopover";

/**
 * The panel itself. Anything can live in here — a form, a list, a chart.
 *
 * Focus moves in when it opens and returns to the trigger when it closes, so it can be
 * driven from the keyboard.
 */
const PopoverContent = ({ className, children, ...rest }: PopoverContentProps) => {
  const { open, arrow, arrowRef, floating } = usePopover();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Focus what the caller put first, falling back to the panel itself so focus is
    // inside rather than left behind on the page.
    const focusable = contentRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    (focusable ?? contentRef.current)?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={(node) => {
        floating.refs.setFloating(node);
        (contentRef as { current: HTMLDivElement | null }).current = node;
      }}
      style={floating.floatingStyles}
      role="dialog"
      tabIndex={-1}
      data-state={open ? "open" : "closed"}
      className={classNames("GeckoUIPopover__content", className)}
      {...rest}>
      {children}

      {arrow && (
        <FloatingArrow
          ref={arrowRef}
          context={floating.context}
          className="GeckoUIPopover__arrow"
        />
      )}
    </div>
  );
};

PopoverContent.displayName = "PopoverContent";

export default PopoverContent;
