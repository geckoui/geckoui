import type { KeyboardEvent } from "react";
import { useEffect, useRef } from "react";

import { classNames } from "../../../utils/classNames";
import type { TabListProps } from "../Tabs.types";
import { useTabs } from "../useTabs";

/**
 * The strip the tabs sit in. Owns the keyboard navigation and keeps the selected tab in
 * view when there are more tabs than room.
 *
 * Put it wherever the layout wants it — a sticky header, say — and the panels can live
 * somewhere else entirely.
 */
const TabList = ({ className, children, ...rest }: TabListProps) => {
  const { selectedValue, isNav, orientation } = useTabs();
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the selected tab in view when the strip is scrollable, centring it where there
  // is room. Only the strip scrolls; scrollIntoView would take the page with it.
  //
  // Measured from the rectangles rather than offsetLeft, which is relative to the
  // nearest positioned ancestor and would fold in whatever wraps the strip.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const tab = list.querySelector<HTMLElement>('[data-gecko-tab][data-state="selected"]');
    if (!tab) return;

    const listBox = list.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();

    if (orientation === "vertical") {
      if (list.scrollHeight <= list.clientHeight) return;

      list.scrollTo({
        top: list.scrollTop + (tabBox.top - listBox.top) - (list.clientHeight - tabBox.height) / 2,
        behavior: "smooth"
      });

      return;
    }

    if (list.scrollWidth <= list.clientWidth) return;

    list.scrollTo({
      left: list.scrollLeft + (tabBox.left - listBox.left) - (list.clientWidth - tabBox.width) / 2,
      behavior: "smooth"
    });
  }, [selectedValue, orientation]);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Navigation is a list of links, so the arrow keys are left to the browser and Tab
    // walks through them as it would anywhere else.
    if (isNav) return;

    // Read the tabs from the DOM rather than from props, so a tab rendered by the
    // caller through `asChild` is navigated the same as one we rendered.
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-gecko-tab]:not([data-disabled])") ?? []
    );

    if (!items.length) return;

    const [previousKey, nextKey] =
      orientation === "vertical" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];

    // Where focus is now, falling back to the selected tab when focus sits elsewhere
    const focusedIndex = items.indexOf(document.activeElement as HTMLElement);
    const current =
      focusedIndex === -1
        ? Math.max(
            items.findIndex((item) => item.dataset.state === "selected"),
            0
          )
        : focusedIndex;

    let next = current;

    switch (e.key) {
      case previousKey:
        next = (current - 1 + items.length) % items.length;
        break;
      case nextKey:
        next = (current + 1) % items.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = items.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();

    // Arrow keys move focus only. Selecting as focus travels mounts every panel on the
    // way past, and it surprises people who expect arrows to browse rather than choose.
    // Enter or Space on the focused tab selects it, which a button does for free.
    items[next].focus();
  };

  const Element = isNav ? "nav" : "div";

  return (
    <Element
      ref={listRef}
      className={classNames("GeckoUITabs__list", className)}
      role={isNav ? undefined : "tablist"}
      aria-orientation={isNav ? undefined : orientation}
      onKeyDown={handleKeyDown}
      {...rest}>
      {children}
    </Element>
  );
};

TabList.displayName = "TabList";

export default TabList;
