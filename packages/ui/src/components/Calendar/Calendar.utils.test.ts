import { afterEach, describe, expect, it, vi } from "vitest";

import {
  formatDateRange,
  generateCalendarDates,
  generateMonthNames,
  getTodayDate,
  isDateBetween,
  isDateInRange,
  isValidISOFormat,
  shouldSwapDates
} from "./Calendar.utils";

afterEach(() => {
  vi.useRealTimers();
});

describe("generateCalendarDates", () => {
  const rows = (dates: unknown[]) => dates.length / 7;

  it("gives a month only the weeks it needs by default", () => {
    // 1 January 2024 was a Monday: 1 leading day + 31 = 32 cells, so five weeks
    expect(generateCalendarDates(0, 2024)).toHaveLength(35);
    expect(rows(generateCalendarDates(0, 2024))).toBe(5);
  });

  it("can need only four weeks", () => {
    // February 1998 started on a Sunday and had 28 days, so it fits exactly
    const dates = generateCalendarDates(1, 1998);

    expect(rows(dates)).toBe(4);
    expect(dates[0]).toEqual({ day: 1, month: 1, year: 1998 });
  });

  it("can need six weeks", () => {
    // 1 March 2024 was a Friday: 5 leading days + 31 = 36 cells, which spills into a sixth row
    expect(rows(generateCalendarDates(2, 2024))).toBe(6);
  });

  it("always ends on a complete week", () => {
    for (let month = 0; month < 12; month++) {
      expect(generateCalendarDates(month, 2024).length % 7).toBe(0);
    }
  });

  it("pads to six weeks with fixedWeeks", () => {
    expect(generateCalendarDates(0, 2024, { fixedWeeks: true })).toHaveLength(42);
    expect(generateCalendarDates(1, 1998, { fixedWeeks: true })).toHaveLength(42);
    expect(generateCalendarDates(2, 2024, { fixedWeeks: true })).toHaveLength(42);
  });

  it("pads at the end, not the start, with fixedWeeks", () => {
    const dates = generateCalendarDates(1, 1998, { fixedWeeks: true });

    expect(dates[0]).toEqual({ day: 1, month: 1, year: 1998 });
    expect(dates.at(-1)).toMatchObject({ month: 2, year: 1998 });
  });

  it("includes every day of the month", () => {
    const dates = generateCalendarDates(0, 2024).filter((d) => d.month === 0 && d.year === 2024);

    expect(dates.map((d) => d.day)).toEqual(Array.from({ length: 31 }, (_, i) => i + 1));
  });

  it("starts the grid on Sunday, matching the S M T W T F S header", () => {
    // 1 January 2024 was a Monday, so one leading day comes from December
    expect(generateCalendarDates(0, 2024)[0]).toEqual({ day: 31, month: 11, year: 2023 });
    expect(generateCalendarDates(0, 2024)[1]).toEqual({ day: 1, month: 0, year: 2024 });
  });

  it("starts a Sunday month on the 1st, with no leading week", () => {
    // 1 September 2024 was a Sunday, so it owns the first cell
    expect(generateCalendarDates(8, 2024)[0]).toEqual({ day: 1, month: 8, year: 2024 });
  });

  it("pads the start with the previous month", () => {
    // 1 February 2024 was a Thursday, so Sunday to Wednesday come from January
    expect(generateCalendarDates(1, 2024).slice(0, 4)).toEqual([
      { day: 28, month: 0, year: 2024 },
      { day: 29, month: 0, year: 2024 },
      { day: 30, month: 0, year: 2024 },
      { day: 31, month: 0, year: 2024 }
    ]);
  });

  it("rolls the padding back into the previous year in January", () => {
    // 1 January 2025 was a Wednesday, so Sunday to Tuesday come from December 2024
    expect(generateCalendarDates(0, 2025).slice(0, 3)).toEqual([
      { day: 29, month: 11, year: 2024 },
      { day: 30, month: 11, year: 2024 },
      { day: 31, month: 11, year: 2024 }
    ]);
  });

  it("keeps the first of the month in the right weekday column", () => {
    for (let month = 0; month < 12; month++) {
      const dates = generateCalendarDates(month, 2024);
      const index = dates.findIndex((d) => d.day === 1 && d.month === month);

      expect(index % 7).toBe(new Date(2024, month, 1).getDay());
    }
  });

  it("rolls the padding into the next year in December", () => {
    const dates = generateCalendarDates(11, 2024);

    expect(dates.at(-1)).toMatchObject({ month: 0, year: 2025 });
  });

  it("handles a leap February", () => {
    const feb = generateCalendarDates(1, 2024).filter((d) => d.month === 1);

    expect(feb).toHaveLength(29);
  });

  it("handles a non leap February", () => {
    const feb = generateCalendarDates(1, 2023).filter((d) => d.month === 1);

    expect(feb).toHaveLength(28);
  });

  it("pads the end with the next month", () => {
    const dates = generateCalendarDates(0, 2024);

    expect(dates.at(-1)).toMatchObject({ month: 1, year: 2024 });
  });
});

describe("generateMonthNames", () => {
  it("returns twelve long and twelve short names", () => {
    const { months, shortMonths } = generateMonthNames();

    expect(months).toHaveLength(12);
    expect(shortMonths).toHaveLength(12);
  });

  it("defaults to English names", () => {
    const { months, shortMonths } = generateMonthNames();

    expect(months[0]).toBe("January");
    expect(months[11]).toBe("December");
    expect(shortMonths[0]).toBe("Jan");
  });

  it("honours a locale", () => {
    const { months } = generateMonthNames("de-DE");

    expect(months[0]).toBe("Januar");
  });
});

describe("getTodayDate", () => {
  it("returns today in YYYY-MM-DD", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 5, 12));

    expect(getTodayDate()).toBe("2024-01-05");
  });

  it("pads the month and day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 8, 9, 12));

    expect(getTodayDate()).toBe("2024-09-09");
  });

  it("uses the local date, not UTC", () => {
    vi.useFakeTimers();
    // Late local evening, which is already the next day in UTC for positive offsets
    vi.setSystemTime(new Date(2024, 5, 30, 23, 30));

    expect(getTodayDate()).toBe("2024-06-30");
  });
});

describe("isValidISOFormat", () => {
  it("accepts a YYYY-MM-DD string", () => {
    expect(isValidISOFormat("2024-01-05")).toBe(true);
  });

  it("rejects other shapes", () => {
    expect(isValidISOFormat("2024-1-5")).toBe(false);
    expect(isValidISOFormat("05-01-2024")).toBe(false);
    expect(isValidISOFormat("2024-01-05T00:00:00Z")).toBe(false);
  });

  it("rejects empty and nil values", () => {
    expect(isValidISOFormat("")).toBe(false);
    expect(isValidISOFormat(null)).toBe(false);
    expect(isValidISOFormat(undefined)).toBe(false);
    expect(isValidISOFormat()).toBe(false);
  });
});

describe("isDateInRange", () => {
  const range = { from: "2024-01-10", to: "2024-01-20" };

  it("includes both ends", () => {
    expect(isDateInRange("2024-01-10", range)).toBe(true);
    expect(isDateInRange("2024-01-20", range)).toBe(true);
  });

  it("includes a date in the middle", () => {
    expect(isDateInRange("2024-01-15", range)).toBe(true);
  });

  it("excludes dates outside", () => {
    expect(isDateInRange("2024-01-09", range)).toBe(false);
    expect(isDateInRange("2024-01-21", range)).toBe(false);
  });

  it("is false for an incomplete range", () => {
    expect(isDateInRange("2024-01-15", { from: null, to: "2024-01-20" })).toBe(false);
    expect(isDateInRange("2024-01-15", { from: "2024-01-10", to: null })).toBe(false);
    expect(isDateInRange("2024-01-15", { from: "2024-01-10" })).toBe(false);
  });
});

describe("isDateBetween", () => {
  it("includes both ends", () => {
    expect(isDateBetween("2024-01-10", "2024-01-10", "2024-01-20")).toBe(true);
    expect(isDateBetween("2024-01-20", "2024-01-10", "2024-01-20")).toBe(true);
  });

  it("excludes dates outside", () => {
    expect(isDateBetween("2024-01-21", "2024-01-10", "2024-01-20")).toBe(false);
  });

  it("is false when either end is missing", () => {
    expect(isDateBetween("2024-01-15", null, "2024-01-20")).toBe(false);
    expect(isDateBetween("2024-01-15", "2024-01-10", null)).toBe(false);
  });
});

describe("formatDateRange", () => {
  it("joins both ends with an arrow", () => {
    expect(formatDateRange({ from: "2024-01-10", to: "2024-01-20" })).toBe(
      "2024-01-10 → 2024-01-20"
    );
  });

  it("returns just the start when there is no end", () => {
    expect(formatDateRange({ from: "2024-01-10" })).toBe("2024-01-10");
    expect(formatDateRange({ from: "2024-01-10", to: null })).toBe("2024-01-10");
  });

  it("returns an empty string without a start", () => {
    expect(formatDateRange({ from: null, to: "2024-01-20" })).toBe("");
  });
});

describe("shouldSwapDates", () => {
  it("is true when the end comes first", () => {
    expect(shouldSwapDates("2024-01-20", "2024-01-10")).toBe(true);
  });

  it("is false when the dates are in order", () => {
    expect(shouldSwapDates("2024-01-10", "2024-01-20")).toBe(false);
  });

  it("is false for the same date", () => {
    expect(shouldSwapDates("2024-01-10", "2024-01-10")).toBe(false);
  });

  it("is false when either date is missing", () => {
    expect(shouldSwapDates(null, "2024-01-10")).toBe(false);
    expect(shouldSwapDates("2024-01-10", null)).toBe(false);
    expect(shouldSwapDates()).toBe(false);
  });
});
