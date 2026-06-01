import type { Placement, Strategy } from "@floating-ui/react";

import { BaseDateInputProps } from "../BaseDateInput";

export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

export interface DateInputProps
  extends Omit<BaseDateInputProps, "hasFocus" | "renderCalendarIcon"> {
  /**
   * Whether to hide the calendar popup. When false (default), calendar will be shown.
   * @default false
   */
  hideCalendar?: boolean;

  /**
   * Additional CSS class name for the wrapper div that contains input field and calendar
   */
  wrapperClassName?: string;

  /**
   * Additional CSS class name for the calendar component
   */
  calendarClassName?: string;

  /**
   * Placement of the calendar popup relative to the input
   * @default "bottom-start"
   */
  calendarPlacement?: Placement;

  /**
   * Floating strategy for the calendar positioning
   * @default "absolute"
   */
  floatingStrategy?: Strategy;
}
