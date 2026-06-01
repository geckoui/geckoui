import type { FC, ReactNode } from "react";

import type { DateRange } from "../Calendar/Calendar/Calendar.types";

export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

export interface BaseDateRangeInputProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "onBlur" | "prefix" | "onSubmit"
  > {
  value?: DateRange;
  onChange?: (value: DateRange | null) => void;
  onSubmit?: () => void;
  onStateUpdate?: (state: {
    startDay: string;
    startMonth: string;
    startYear: string;
    endDay: string;
    endMonth: string;
    endYear: string;
  }) => void;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: FC | ReactNode;
  suffix?: FC | ReactNode;
  hasError?: boolean;
  className?: string;
  format?: DateFormat;
  separator?: string;
  rangeSeparator?: string;
  placeholder?: string;
  placeholderClassName?: string;
  hideClearIcon?: boolean;
  hideCalendarIcon?: boolean;
  renderCalendarIcon?: ReactNode;
  hasFocus?: boolean;
}

export { DateRange };
