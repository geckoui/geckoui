function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

const DAYS_IN_WEEK = 7;
const MAX_WEEKS_IN_MONTH = 6;

/**
 * Generate an array of objects representing the dates of a month
 * @param month - The month (0 = January, 1 = February, etc.)
 * @param year - The year
 * @param options.fixedWeeks - Always emit six weeks, so the grid keeps the same height
 * as you page between months. Off by default, which lets a month take the 4 to 6 weeks
 * it actually needs.
 * */
export function generateCalendarDates(
  month: number,
  year: number,
  { fixedWeeks = false }: { fixedWeeks?: boolean } = {}
): {
  day: number;
  month: number;
  year: number;
}[] {
  const dates = [];
  const currentMonthDays = daysInMonth(month, year);
  const prevMonthDays = month === 0 ? daysInMonth(11, year - 1) : daysInMonth(month - 1, year);

  // getDay() is already Sunday-first, matching the S M T W T F S header, so the 1st
  // lands in the right column with no remapping.
  const firstDay = firstDayOfMonth(month, year);

  // Add days from the previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({
      day: prevMonthDays - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year
    });
  }

  // Add days from the current month
  for (let i = 1; i <= currentMonthDays; i++) {
    dates.push({
      day: i,
      month,
      year
    });
  }

  // Add days from the next month until the last week is complete, or until the grid is
  // six weeks tall when the caller asked for a fixed height.
  const totalCells = fixedWeeks
    ? DAYS_IN_WEEK * MAX_WEEKS_IN_MONTH
    : DAYS_IN_WEEK * Math.ceil(dates.length / DAYS_IN_WEEK);

  let nextMonthDay = 1;
  while (dates.length < totalCells) {
    dates.push({
      day: nextMonthDay,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year
    });
    nextMonthDay++;
  }

  return dates;
}

/**
 * Generate an array of month names and short month names
 * */
export function generateMonthNames(locale = "en-US"): {
  months: string[];
  shortMonths: string[];
} {
  const months = [];
  const shortMonths = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    months.push(date.toLocaleString(locale, { month: "long" }));
    shortMonths.push(date.toLocaleString(locale, { month: "short" }));
  }

  return { months, shortMonths };
}

/**
 * Generate today's date in the format 'YYYY-MM-DD' in the user's local timezone
 * */
export function getTodayDate(): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isValidISOFormat(date: string | null | undefined = ""): boolean {
  if (!date) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * Check if a date is within a date range (inclusive)
 * @param date - Date string in YYYY-MM-DD format
 * @param range - Date range object with from and to dates
 * */
export function isDateInRange(
  date: string,
  range: { from: string | null; to?: string | null }
): boolean {
  if (!range.from || !range.to) return false;
  return date >= range.from && date <= range.to;
}

/**
 * Check if a date is between two dates (inclusive)
 * @param date - Date string in YYYY-MM-DD format
 * @param start - Start date string
 * @param end - End date string
 * */
export function isDateBetween(date: string, start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  return date >= start && date <= end;
}

/**
 * Format a date range as a string
 * @param range - Date range object with from and to dates
 * */
export function formatDateRange(range: { from: string | null; to?: string | null }): string {
  if (!range.from) return "";
  if (!range.to) return range.from;
  return `${range.from} → ${range.to}`;
}

/**
 * Check if dates should be swapped (end comes before start)
 * @param start - Start date string
 * @param end - End date string
 * @returns true if end comes before start
 * */
export function shouldSwapDates(start?: string | null, end?: string | null): boolean {
  if (!start || !end) return false;
  return end < start;
}
