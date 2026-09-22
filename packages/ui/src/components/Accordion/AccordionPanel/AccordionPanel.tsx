import { classNames } from "../../../utils/classNames";
import type { AccordionPanelProps } from "../Accordion.types";
import { useAccordion, useAccordionItem } from "../useAccordion";

/**
 * What an item reveals.
 *
 * The open and close is animated with a CSS grid row rather than a height, so it runs to
 * the content's real height without measuring anything. That needs the panel to stay in
 * the DOM, which is why `keepMounted` is on by default.
 */
const AccordionPanel = ({ keepMounted, className, children, ...rest }: AccordionPanelProps) => {
  const { keepMounted: keepMountedOnRoot } = useAccordion();
  const { value, open } = useAccordionItem();

  const stayMounted = keepMounted ?? keepMountedOnRoot;

  if (!open && !stayMounted) return null;

  return (
    <div
      role="region"
      id={`GeckoUIAccordion-panel-${value}`}
      aria-labelledby={`GeckoUIAccordion-header-${value}`}
      className="GeckoUIAccordion__panel"
      data-state={open ? "open" : "closed"}
      {...rest}>
      <div className="GeckoUIAccordion__panel__inner">
        <div className={classNames("GeckoUIAccordion__panel__content", className)}>{children}</div>
      </div>
    </div>
  );
};

AccordionPanel.displayName = "AccordionPanel";

export default AccordionPanel;
