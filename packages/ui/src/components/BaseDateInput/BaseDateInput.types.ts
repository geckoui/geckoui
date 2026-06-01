import type { FC, ReactNode } from "react";

export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

export interface BaseDateInputProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  onSubmit?: () => void;
  onStateUpdate?: (state: { day: string; month: string; year: string }) => void;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: FC | ReactNode;
  suffix?: FC | ReactNode;
  hasError?: boolean;
  className?: string;
  format?: DateFormat;
  separator?: string;
  placeholder?: string;
  placeholderClassName?: string;
  hideClearIcon?: boolean;
  hideCalendarIcon?: boolean;
  renderCalendarIcon?: ReactNode;
  hasFocus?: boolean;
}
