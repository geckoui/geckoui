import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  flip,
  offset,
  shift,
  useFloating
} from "@floating-ui/react";
import { Children, type FC, cloneElement, isValidElement, useRef, useState } from "react";

import { classNames } from "../../utils/classNames";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { TooltipProps } from "./Tooltip.types";

const Tooltip: FC<TooltipProps> = ({
  children,
  delayDuration = 700,
  content,
  className,
  triggerClassName,
  triggerAsChild = false,
  arrowClassName,
  backgroundColor,
  placement = "top",
  sideOffset = 12
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [offset(sideOffset), flip(), shift({ padding: 5 }), arrow({ element: arrowRef })]
  });

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };

  if (!content) return children;

  const triggerProps = {
    ref: refs.setReference,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave
  };

  const renderTrigger = () => {
    if (triggerAsChild) {
      const child = Children.only(children);
      if (isValidElement(child)) {
        return cloneElement(child, {
          ...triggerProps,
          className: classNames((child.props as { className?: string }).className, triggerClassName)
        } as React.HTMLAttributes<HTMLElement>);
      }
    }

    return (
      <span {...triggerProps} className={classNames("GeckoUITooltip__trigger", triggerClassName)}>
        {children}
      </span>
    );
  };

  return (
    <>
      {renderTrigger()}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, backgroundColor }}
            className={classNames("GeckoUITooltip", className)}
            role="tooltip">
            <DynamicComponentRenderer component={content} />
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className={classNames("GeckoUITooltip__arrow", arrowClassName)}
              style={{ fill: backgroundColor }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
