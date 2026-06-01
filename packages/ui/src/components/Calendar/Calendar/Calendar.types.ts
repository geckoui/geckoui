import type { JSX, ReactNode } from "react";

export type SelectionMode = "single" | "range";

export interface DateRange {
  from: string | null;
  to?: string | null;
}

export interface DayCellRenderProps {
  day: number;
  month: number;
  year: number;

  /** Date string in the format 'YYYY-MM-DD' */
  date: string;

  isDisabled: boolean;

  isSelected: boolean;

  /** Indicates if the date belongs to the currently focused month */
  isFocusedMonth: boolean;
}

export interface CalendarActiveProps {
  /**
   * Year value that is selected in the date picker
   * */
  activeYear: number;

  /**
   * Month value index that is selected in the date picker
   * */
  activeMonth: number;
}

interface BaseCalendarProps {
  /**
   * Ref object that is used to call the `moveTo` function
   * */
  calendarRef?: React.Ref<CalendarRef>;
  /**
   * Style object for the calendar container
   * */
  style?: React.CSSProperties;

  /**
   * Style class name for the date picker container
   * */
  className?: string;

  /**
   * Callback function that determines whether a date is disabled or not
   * */
  disableDate?: (date: string) => boolean;

  /**
   * Custom day cell renderer function
   * Use this to customize the appearance of individual day cells
   * */
  renderDayCell?: (props: DayCellRenderProps) => ReactNode;
}

export interface CalendarSingleModeProps extends BaseCalendarProps {
  /**
   * Selection mode: 'single' for single date selection
   * @default 'single'
   * */
  mode?: "single";

  /**
   * Selected date in the format YYYY-MM-DD
   * */
  selectedDate?: string | null;

  /**
   * Callback function that is called when a date is clicked
   * */
  onSelectDate?: (date: string) => void;
}

export interface CalendarRangeModeProps extends BaseCalendarProps {
  /**
   * Selection mode: 'range' for date range selection
   * */
  mode: "range";

  /**
   * Selected date range with from and to dates
   * */
  selectedRange?: DateRange;

  /**
   * Callback function that is called when a date range is selected
   * */
  onSelectRange?: (range: DateRange | null) => void;
}

export type CalendarProps = CalendarSingleModeProps | CalendarRangeModeProps;

export interface CalendarOverload {
  (props: CalendarSingleModeProps): JSX.Element;
  (props: CalendarRangeModeProps): JSX.Element;
  (props: CalendarProps): JSX.Element;
  displayName: string;
}

export interface CalendarRef {
  /**
   * Moves the date picker to the specified month and year
   * */
  moveTo: (month: number, year: number) => void;

  /**
   * Clears the current selection
   * */
  clearSelection: () => void;
}

export enum CalendarType {
  Day = "day",
  Month = "month",
  Year = "year"
}
