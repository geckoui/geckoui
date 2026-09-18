import type { HTMLAttributes, ReactNode } from "react";

/** Extensible variant map - To allow module augmentation */
export interface AccordionVariantMap {
  separated: unknown;
  contained: unknown;
  plain: unknown;
}

/** Extensible size map - To allow module augmentation */
export interface AccordionSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

export type AccordionValue = string | string[];

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Which items are open. A string on its own, or an array when `multiple` is set.
   * Leave it out to let the component hold the state.
   * */
  value?: AccordionValue;

  /**
   * Which items start open when the component holds the state.
   * */
  defaultValue?: AccordionValue;

  /**
   * Called with what is open now: a string, or an array when `multiple` is set. The
   * string is empty when the last open item closes.
   * */
  onChange?: (value: AccordionValue) => void;

  /**
   * Let several items be open at once. One at a time by default, which is what a FAQ
   * usually wants.(Default: false)
   * */
  multiple?: boolean;

  /**
   * Whether the open item can be closed, leaving nothing open. Turn it off to keep one
   * item open at all times.(Default: true)
   * */
  collapsible?: boolean;

  /**
   * How the items are framed.(Default: 'separated')
   * */
  variant?: keyof AccordionVariantMap;

  /**
   * Header padding and text size.(Default: 'md')
   * */
  size?: keyof AccordionSizeMap;

  /**
   * Keep closed panels in the DOM, hidden rather than unmounted.
   *
   * On by default, because it is what makes the open and close animate, and it keeps a
   * half filled form alive while its panel is shut. Turn it off when the panels are
   * expensive to render, and accept that closing then happens without the
   * animation.(Default: true)
   * */
  keepMounted?: boolean;

  /**
   * `AccordionItem` elements.
   * */
  children?: ReactNode;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Identifies the item. This is what `value` and `onChange` report.
   * */
  value: string;

  /**
   * Stop the item being opened or closed, and take its header out of the keyboard
   * order.
   * */
  disabled?: boolean;

  /**
   * An `AccordionHeader` and an `AccordionPanel`.
   * */
  children?: ReactNode;
}

export interface AccordionHeaderProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * Hide the chevron that turns as the item opens.(Default: false)
   * */
  hideIcon?: boolean;

  /**
   * Replace the chevron with something of your own.
   * */
  icon?: ReactNode;

  /**
   * What the header shows.
   * */
  children?: ReactNode;
}

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Keep this panel in the DOM while it is closed, overriding `keepMounted` on
   * `Accordion`.
   * */
  keepMounted?: boolean;

  /**
   * The panel contents.
   * */
  children?: ReactNode;
}

export interface AccordionContextProps {
  openValues: string[];
  toggle: (value: string) => void;
  keepMounted: boolean;
}

export interface AccordionItemContextProps {
  value: string;
  disabled: boolean;
  open: boolean;
}
