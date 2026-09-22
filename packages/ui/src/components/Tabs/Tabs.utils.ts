import type { ReactNode } from "react";

import { hasDisplayName } from "../../utils";

export const isTab = hasDisplayName("Tab");

/**
 * Every `Tab` under here, however deeply it is wrapped. `TabList` can sit inside a
 * header or any other layout, so the tabs are not always direct children.
 */
export function findTabs(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- walking arbitrary children
  el: any
): { value: string; disabled?: boolean }[] {
  if (el === null || el === undefined || typeof el !== "object") return [];

  if (Array.isArray(el)) {
    return el.flatMap((child) => findTabs(child));
  }

  if (isTab(el as ReactNode)) {
    return [{ value: el.props.value, disabled: el.props.disabled }];
  }

  return findTabs(el.props?.children);
}
