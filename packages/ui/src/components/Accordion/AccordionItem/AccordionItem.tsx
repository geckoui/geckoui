import { classNames } from "../../../utils/classNames";
import type { AccordionItemProps } from "../Accordion.types";
import { AccordionItemContext, useAccordion } from "../useAccordion";

/**
 * One item: a header and the panel it opens.
 */
const AccordionItem = ({
  value,
  disabled = false,
  className,
  children,
  ...rest
}: AccordionItemProps) => {
  const { openValues } = useAccordion();

  const open = openValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, disabled, open }}>
      <div
        className={classNames("GeckoUIAccordion__item", className)}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled || undefined}
        {...rest}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

AccordionItem.displayName = "AccordionItem";

export default AccordionItem;
