import type { HTMLAttributes, ReactNode } from "react";

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
   * A `TabList`, the `TabPanel`s, and whatever layout you want around them.
   * */
  children?: ReactNode;
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `Tab` elements.
   * */
  children?: ReactNode;
}

export interface TabProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Identifies the tab. Matched against the `value` on `Tabs`, and against the
   * `TabPanel` it reveals.
   * */
  value: string;

  /**
   * Take the tab out of the keyboard order and stop it being selected.
   * */
  disabled?: boolean;

  /**
   * Use the child element as the tab instead of rendering a button, so navigation tabs
   * can be real links. The child receives the id, tab index and aria wiring.
   *
   * @example
   * ```tsx
   * <Tab value="/settings/profile" asChild>
   *   <Link href="/settings/profile">Profile</Link>
   * </Tab>
   * ```
   * */
  asChild?: boolean;

  /**
   * What the tab shows. Anything: text, an icon beside text, a badge.
   * */
  children?: ReactNode;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Matched against the `Tab` that reveals this panel.
   * */
  value: string;

  /**
   * Keep this panel mounted while another tab is selected, overriding `keepMounted`
   * on `Tabs`. Worth it for a panel holding a half filled form.
   * */
  keepMounted?: boolean;

  /**
   * The panel contents.
   * */
  children?: ReactNode;
}

export interface TabsContextProps {
  selectedValue: string | undefined;
  select: (value: string) => void;
  keepMounted: boolean;
  isNav: boolean;
  orientation: TabsOrientation;
}
