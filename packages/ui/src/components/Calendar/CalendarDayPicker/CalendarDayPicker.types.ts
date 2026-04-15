import type { CalendarActiveProps, CalendarProps, DateRange } from "../Calendar";
import type { CalendarHeaderProps } from "../CalendarHeader";

interface CalendarDayPickerBaseProps
  extends CalendarHeaderProps,
    CalendarActiveProps,
    Pick<CalendarProps, "disableDate" | "renderDayCell"> {}

export interface CalendarDayPickerSingleProps extends CalendarDayPickerBaseProps {
  /**
   * Selection mode: 'single' for single date selection
   * */
  mode?: "single";

  /**
   * Date string in the format 'YYYY-MM-DD'
   * */
  selectedDate?: string | null;

  /**
   * Callback function that is called when a date is clicked
   * */
  onSelectDate?: (date: string) => void;
}

export interface CalendarDayPickerRangeProps extends CalendarDayPickerBaseProps {
  /**
   * Selection mode: 'range' for date range selection
   * */
  mode: "range";

  /**
   * Selected date range with from and to dates
   * */
  selectedRange?: DateRange;

  /**
   * Currently hovered date for range preview
   * */
  hoveredDate?: string | null;

  /**
   * Callback function that is called when a date is clicked in range mode
   * */
  onSelectRange?: (date: string) => void;

  /**
   * Callback function that is called when a date is hovered
   * */
  onHoverDate?: (date: string | null) => void;
}

export type CalendarDayPickerProps = CalendarDayPickerSingleProps | CalendarDayPickerRangeProps;
