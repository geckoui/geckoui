import { classNames } from "../../../utils/classNames";
import type { AccordionHeaderProps } from "../Accordion.types";
import { useAccordion, useAccordionItem } from "../useAccordion";

/**
 * The button that opens and closes its item. Whatever you put inside is what it shows.
 *
 * @example
 * ```tsx
 * <AccordionHeader>
 *   <TruckIcon /> Shipping <Badge color="info">free</Badge>
 * </AccordionHeader>
 * ```
 */
const AccordionHeader = ({
  hideIcon = false,
  icon,
  className,
  children,
  onClick,
  ...rest
}: AccordionHeaderProps) => {
  const { toggle } = useAccordion();
  const { value, disabled, open } = useAccordionItem();

  return (
    <button
      type="button"
      id={`GeckoUIAccordion-header-${value}`}
      className={classNames("GeckoUIAccordion__header", className)}
      disabled={disabled}
      aria-expanded={open}
      aria-controls={`GeckoUIAccordion-panel-${value}`}
      data-gecko-accordion-header=""
      data-state={open ? "open" : "closed"}
      data-disabled={disabled || undefined}
      onClick={(e) => {
        onClick?.(e);
        toggle(value);
      }}
      {...rest}>
      <span className="GeckoUIAccordion__header__content">{children}</span>

      {!hideIcon &&
        (icon ?? (
          <span className="GeckoUIAccordion__header__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        ))}
    </button>
  );
};

AccordionHeader.displayName = "AccordionHeader";

export default AccordionHeader;
