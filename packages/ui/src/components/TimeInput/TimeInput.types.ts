import type { Placement, Strategy } from "@floating-ui/react";
import type { FC, ReactNode } from "react";

export interface TimeParts {
  /** 0 to 23, whatever the format shows. */
  hour: number;
  minute: number;
  second: number;
}

export type TimeFormat = "HH:mm" | "hh:mm A" | "HH:mm:ss" | "hh:mm:ss A";

export interface TimeInputProps {
  /**
   * The time, always as 24 hour `HH:mm`, or `HH:mm:ss` when the format asks for seconds.
   * What is on screen follows `format`; this does not.
   * */
  value?: string | null;

  /**
   * Called with the new time, or `null` while it is incomplete or out of bounds.
   * */
  onChange?: (value: string | null) => void;

  /**
   * Called once the last segment is filled, for moving focus on.
   * */
  onSubmit?: () => void;

  /**
   * How the time is shown. 24 or 12 hour, with or without seconds.(Default: 'HH:mm')
   * */
  format?: TimeFormat;

  /**
   * Which times cannot be chosen. Called with 24 hour numbers, whatever the format shows,
   * and with the segments that are not filled in yet standing at zero.
   *
   * @example
   * ```tsx
   * disabledTime={({ hour }) => hour < 9 || hour >= 17}
   * disabledTime={({ hour, minute }) => hour === 12 && minute < 30}
   * ```
   * */
  disabledTime?: (time: TimeParts) => boolean;

  /**
   * Minutes between the entries in the minute column. Every minute by default, the way the
   * platform's own picker lists them. Raise it for booking slots.(Default: 1)
   * */
  step?: number;

  disabled?: boolean;
  readOnly?: boolean;
  /**
   * Marks the field invalid, to a screen reader and in its colours.
   *
   * The standard attribute rather than a prop of the library's own, so it works the same
   * here as on a native input.
   * */
  "aria-invalid"?: boolean | "true" | "false";
  prefix?: FC | ReactNode;
  suffix?: FC | ReactNode;
  placeholder?: string;
  placeholderClassName?: string;
  hideClearIcon?: boolean;
  hideClockIcon?: boolean;
  className?: string;
  wrapperClassName?: string;
  listClassName?: string;

  /**
   * Where the list opens, relative to the field.(Default: 'bottom-start')
   * */
  listPlacement?: Placement;

  floatingStrategy?: Strategy;
}
