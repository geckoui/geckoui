import type { KeyboardEvent } from "react";
import { useRef, useState } from "react";

import { classNames } from "../../../utils/classNames";
import type { AccordionProps, AccordionValue } from "../Accordion.types";
import { AccordionContext } from "../useAccordion";

const toArray = (value: AccordionValue | undefined): string[] => {
  if (value === undefined || value === "") return [];

  return Array.isArray(value) ? value : [value];
};

/**
 * A stack of items that open one at a time, or several at once.
 *
 * @example
 * ```tsx
 * <Accordion defaultValue="shipping">
 *   <AccordionItem value="shipping">
 *     <AccordionHeader>Shipping</AccordionHeader>
 *     <AccordionPanel>Ships in 2 to 3 working days.</AccordionPanel>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
const Accordion = ({
  value,
  defaultValue,
  onChange,
  multiple = false,
  collapsible = true,
  variant = "separated",
  size = "md",
  keepMounted = true,
  className,
  children,
  ...rest
}: AccordionProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [internalValue, setInternalValue] = useState<AccordionValue | undefined>(defaultValue);

  const isControlled = value !== undefined;
  const openValues = toArray(isControlled ? value : internalValue);

  const toggle = (itemValue: string) => {
    const isOpen = openValues.includes(itemValue);

    let next: AccordionValue;

    if (multiple) {
      next = isOpen ? openValues.filter((v) => v !== itemValue) : [...openValues, itemValue];
    } else if (isOpen) {
      // Refusing to collapse keeps the item open rather than reporting a no-op
      if (!collapsible) return;

      next = "";
    } else {
      next = itemValue;
    }

    if (!isControlled) setInternalValue(next);

    onChange?.(next);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const headers = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(
        "[data-gecko-accordion-header]:not([data-disabled])"
      ) ?? []
    );

    if (!headers.length) return;

    const current = headers.indexOf(document.activeElement as HTMLElement);

    // Only steer the arrow keys while a header has focus. Inside a panel they belong to
    // whatever the caller put there.
    if (current === -1) return;

    let next = current;

    switch (e.key) {
      case "ArrowUp":
        next = (current - 1 + headers.length) % headers.length;
        break;
      case "ArrowDown":
        next = (current + 1) % headers.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = headers.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    headers[next].focus();
  };

  return (
    <AccordionContext.Provider value={{ openValues, toggle, keepMounted }}>
      <div
        ref={rootRef}
        className={classNames("GeckoUIAccordion", className)}
        data-variant={variant}
        data-size={size}
        onKeyDown={handleKeyDown}
        {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = "Accordion";

export default Accordion;
