import type { Placement, Strategy } from "@floating-ui/react";
import type { HTMLAttributes, ReactNode } from "react";

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Whether the popover is showing. Leave it out to let the component hold the state.
   * */
  open?: boolean;

  /**
   * Whether it starts open when the component holds the state.(Default: false)
   * */
  defaultOpen?: boolean;

  /**
   * Called whenever the popover opens or closes.
   * */
  onOpenChange?: (open: boolean) => void;

  /**
   * Where the content sits against the trigger. It flips when there is no
   * room.(Default: 'bottom-start')
   * */
  placement?: Placement;

  /**
   * How far the content sits from the trigger, in pixels.(Default: 6)
   * */
  offset?: number;

  /**
   * Positioning strategy, for the rare case where absolute does not work.
   * */
  floatingStrategy?: Strategy;

  /**
   * Close on Escape.(Default: true)
   * */
  dismissOnEscape?: boolean;

  /**
   * Close when something outside is clicked.(Default: true)
   * */
  dismissOnOutsideClick?: boolean;

  /**
   * Show a small arrow pointing at the trigger.(Default: false)
   * */
  arrow?: boolean;

  /**
   * Stop the popover opening at all.
   * */
  disabled?: boolean;

  /**
   * A `PopoverTrigger` and a `PopoverContent`.
   * */
  children?: ReactNode;
}

export interface PopoverTriggerProps {
  /**
   * The element that opens the popover. It is used as the trigger itself rather than
   * wrapped, so it keeps its own tag, styles and handlers.
   * */
  children: ReactNode;
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * What the popover shows.
   * */
  children?: ReactNode;
}

export interface PopoverContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  toggle: () => void;
  disabled: boolean;
  arrow: boolean;
  dismissOnEscape: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- floating-ui's own shape
  floating: any;
  arrowRef: React.RefObject<SVGSVGElement | null>;

  /** Set by `PopoverTrigger`, so focus can be handed back when the popover closes. */
  setTriggerNode: (node: HTMLElement | null) => void;
}
