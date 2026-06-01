import type { Placement, Strategy } from "@floating-ui/react";

import type { BaseDateRangeInputProps, DateRange } from "../BaseDateRangeInput";

export type { DateRange };

export interface DateRangeInputProps
  extends Omit<BaseDateRangeInputProps, "hasFocus" | "renderCalendarIcon"> {
  hideCalendar?: boolean;
  wrapperClassName?: string;
  calendarClassName?: string;
  calendarPlacement?: Placement;
  floatingStrategy?: Strategy;
}
