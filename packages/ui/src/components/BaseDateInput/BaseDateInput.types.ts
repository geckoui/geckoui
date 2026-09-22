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
  /**
   * Marks the field invalid, to a screen reader and in its colours. The field also marks
   * itself when the date typed cannot exist, such as the 31st of February.
   * */
  "aria-invalid"?: boolean | "true" | "false";
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
