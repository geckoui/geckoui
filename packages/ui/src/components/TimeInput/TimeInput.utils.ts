import type { TimeFormat, TimeParts } from "./TimeInput.types";

export type TimeSegment = "hour" | "minute" | "second" | "meridiem";

export const hasSeconds = (format: TimeFormat): boolean => format.includes("ss");

export const isTwelveHour = (format: TimeFormat): boolean => format.includes("A");

export const segmentsFor = (format: TimeFormat): TimeSegment[] => [
  "hour",
  "minute",
  ...(hasSeconds(format) ? (["second"] as const) : []),
  ...(isTwelveHour(format) ? (["meridiem"] as const) : [])
];

export const pad = (value: number): string => value.toString().padStart(2, "0");

export const to24Hour = (hour12: number, meridiem: "AM" | "PM"): number => {
  if (meridiem === "AM") return hour12 === 12 ? 0 : hour12;

  return hour12 === 12 ? 12 : hour12 + 12;
};

export const from24Hour = (hour24: number): { hour12: number; meridiem: "AM" | "PM" } => ({
  hour12: hour24 % 12 === 0 ? 12 : hour24 % 12,
  meridiem: hour24 < 12 ? "AM" : "PM"
});

/**
 * A `HH:mm` or `HH:mm:ss` string split up, or `null` when it is not one.
 *
 * Strict on purpose: a half typed value reaching this is a bug rather than something to
 * guess at, and guessing would put a time on screen the caller never set.
 */
export const parseTime = (
  value: string | null | undefined
): { hour: number; minute: number; second: number } | null => {
  if (!value || !/^\d{2}:\d{2}(:\d{2})?$/.test(value)) return null;

  const [hour, minute, second = 0] = value.split(":").map(Number);

  if (hour > 23 || minute > 59 || second > 59) return null;

  return { hour, minute, second };
};

export const toValue = (
  hour: number,
  minute: number,
  second: number,
  withSeconds: boolean
): string => `${pad(hour)}:${pad(minute)}${withSeconds ? `:${pad(second)}` : ""}`;

/**
 * Minutes since midnight, for comparing against `min` and `max`.
 *
 * Zero padded `HH:mm` would sort correctly as text, but seconds make the two sides
 * different lengths, so the comparison is done in numbers instead.
 */
export const toMinutes = (value: string | null | undefined): number | null => {
  const parsed = parseTime(value);

  return parsed ? parsed.hour * 60 + parsed.minute : null;
};

/** What the predicate is asked about when a cell is being drawn or a time completed. */
export const partsToTime = (
  parts: { hour: string; minute: string; second: string; meridiem: "AM" | "PM" | "" },
  twelve: boolean
): TimeParts => {
  const raw = parseInt(parts.hour || "0", 10);

  return {
    hour: twelve ? to24Hour(raw || 12, parts.meridiem || "AM") : raw,
    minute: parseInt(parts.minute || "0", 10),
    second: parseInt(parts.second || "0", 10)
  };
};

export interface TimeOption {
  /** What goes into the segment, already padded. */
  value: string;

  /** What the column shows. */
  label: string;

  /** Out of bounds, so it is shown but cannot be picked. */
  disabled: boolean;
}

/*
 * 12 leads, the way a clock face does. It is also the earliest hour of each half, so the
 * column runs forwards in time: 12:30 PM comes half an hour before 1 PM, and an ascending
 * 1 to 12 would put the earliest hour last.
 */
const hourRange = (twelve: boolean): number[] =>
  twelve
    ? [12, ...Array.from({ length: 11 }, (_, index) => index + 1)]
    : Array.from({ length: 24 }, (_, index) => index);

const MINUTE_RANGE = Array.from({ length: 60 }, (_, index) => pad(index));

/** The options for one column, in the order they are shown. */
export const optionsFor = (
  segment: TimeSegment,
  parts: { hour: string; minute: string; second: string; meridiem: "AM" | "PM" | "" },
  options: {
    twelve: boolean;
    step: number;
    order: TimeSegment[];
    disabledTime?: (time: TimeParts) => boolean;
  }
): TimeOption[] => {
  const { twelve, step, order, disabledTime } = options;
  const position = order.indexOf(segment);
  const every = Math.max(1, Math.trunc(step));
  const minutes = Array.from({ length: Math.ceil(60 / every) }, (_, index) => pad(index * every));
  const hours = hourRange(twelve).map(pad);

  /*
   * A cell is greyed out only when nothing it could become is allowed, reading the columns
   * to its left as settled and leaving the ones to its right free.
   *
   * Only leftwards, or the columns trap each other. With 1 and 2 allowed in the morning and
   * 4 and 5 in the afternoon, picking PM would grey out 1 and 2, while the chosen hour of 4
   * would grey out AM, and neither could be changed without clearing the field. The first
   * column is never greyed on account of the others, so there is always a way back out.
   *
   * Seconds stand at zero while unknown. A rule that turns on the second alone would need
   * every second tried against every minute, which is a lot of work for a rule nobody
   * writes.
   */
  const isPossible = (value: string): boolean => {
    if (!disabledTime) return true;

    const fixed = { ...parts, [segment]: value };

    const forSegment = (key: TimeSegment, all: string[]): string[] => {
      if (key === segment) return [value];

      const settled = order.indexOf(key) < position && fixed[key];

      return settled ? [fixed[key]] : all;
    };

    for (const meridiem of forSegment("meridiem", twelve ? ["AM", "PM"] : [""])) {
      for (const hour of forSegment("hour", hours)) {
        for (const minute of forSegment("minute", segment === "minute" ? minutes : MINUTE_RANGE)) {
          const candidate = {
            hour,
            minute,
            second: fixed.second || "00",
            meridiem: meridiem as "AM" | "PM" | ""
          };

          if (!disabledTime(partsToTime(candidate, twelve))) return true;
        }
      }
    }

    return false;
  };

  const build = (values: string[]): TimeOption[] =>
    values.map((value) => ({ value, label: value, disabled: !isPossible(value) }));

  if (segment === "meridiem") return build(["AM", "PM"]);
  if (segment === "hour") return build(hours);
  if (segment === "minute") return build(minutes);

  return build(MINUTE_RANGE);
};

/** Wraps around, so stepping past the end of a segment lands at its start. */
export const stepSegment = (
  current: string,
  segment: Exclude<TimeSegment, "meridiem">,
  by: number,
  twelve: boolean
): string => {
  const floor = segment === "hour" && twelve ? 1 : 0;
  const ceiling = segment === "hour" ? (twelve ? 12 : 23) : 59;
  const span = ceiling - floor + 1;

  const from = current === "" ? floor : parseInt(current, 10);
  const next = ((((from - floor + by) % span) + span) % span) + floor;

  return pad(next);
};
