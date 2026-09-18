import type { FC, HTMLAttributes, ReactNode } from "react";

/** Extensible variant map - To allow module augmentation */
export interface TabsVariantMap {
  underline: unknown;
  segmented: unknown;
  soft: unknown;
}

/** Extensible size map - To allow module augmentation */
export interface TabsSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

export type TabsOrientation = "horizontal" | "vertical";

/**
 * The attributes a tab element needs to behave like one.
 *
 * Deliberately exact rather than `HTMLAttributes`, which carries the legacy `color`
 * attribute and so collides with any component of ours that has its own `color` prop.
 */
export interface TabElementProps {
  id: string;
  tabIndex: number;
  role?: "tab";
  "aria-selected"?: boolean;
  "aria-controls"?: string;
  "aria-current"?: "page";
  "data-gecko-tab": string;
  "data-state": "selected" | "unselected";
  "data-disabled"?: true;
}

/**
 * What a `label` render function receives.
 *
 * Spread `props` onto whatever you render, or the keyboard navigation and the
 * screen reader wiring stop working.
 */
export interface TabLabelRenderProps {
  /** This tab's value */
  value: string;

  /** Whether this tab is the selected one */
  selected: boolean;

  /** Whether this tab is disabled */
  disabled: boolean;

  /** Select this tab */
  select: () => void;

  /** id, tabIndex and the aria wiring. Spread these. */
  props: TabElementProps;
}

export interface TabProps {
  /**
   * Identifies the tab. Matched against the `value` on `Tabs`.
   * */
  value: string;

  /**
   * What the tab itself shows. A string, a node, or a function when you want to
   * render the element yourself — a router link, say.
   * */
  label: ReactNode | FC<TabLabelRenderProps>;

  /**
   * Take the tab out of the keyboard order and stop it being selected.
   * */
  disabled?: boolean;

  /**
   * Class name for the tab itself. Ignored when `label` is a function, since you
   * render the element in that case.
   * */
  className?: string;

  /**
   * Class name for this tab's panel.
   * */
  panelClassName?: string;

  /**
   * Keep this panel mounted while another tab is selected, overriding `keepMounted`
   * on `Tabs`. Worth it for a panel holding a half filled form.
   * */
  keepMounted?: boolean;

  /**
   * The panel. Leave it out for navigation tabs, where the page below is the content.
   * */
  children?: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Selected tab. Leave it out to let the component hold the state.
   * */
  value?: string;

  /**
   * Which tab starts selected when the component holds the state.(Default: the first
   * tab that is not disabled)
   * */
  defaultValue?: string;

  /**
   * Called with the value of the tab that was picked.
   * */
  onChange?: (value: string) => void;

  /**
   * How the selected tab is marked.(Default: 'underline')
   * */
  variant?: keyof TabsVariantMap;

  /**
   * Tab padding and text size.(Default: 'md')
   * */
  size?: keyof TabsSizeMap;

  /**
   * Lay the tabs out in a row or a column. A column swaps the arrow keys to up and
   * down.(Default: 'horizontal')
   * */
  orientation?: TabsOrientation;

  /**
   * Share the available width between the tabs instead of letting them hug their
   * labels.(Default: false)
   * */
  fullWidth?: boolean;

  /**
   * Render as navigation rather than as tabs.
   *
   * Tabs swap content on the same page; navigation goes somewhere else. They look the
   * same but are not the same thing to a screen reader, so this switches the markup:
   * a `nav` landmark instead of a tablist, `aria-current` instead of `aria-selected`,
   * and the arrow keys left alone so Tab moves through the links.(Default: 'div')
   * */
  as?: "div" | "nav";

  /**
   * Keep every panel mounted, so a panel holding form state survives being hidden.
   * Off by default, which keeps the DOM small.(Default: false)
   * */
  keepMounted?: boolean;

  /**
   * Class name for the strip of tabs.
   * */
  listClassName?: string;

  /**
   * `Tab` elements.
   * */
  children?: ReactNode;
}

export interface TabsContextProps {
  selectedValue: string | undefined;
  select: (value: string) => void;
  keepMounted: boolean;
  isNav: boolean;
}
