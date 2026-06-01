import type { DateFormat } from "./BaseDateInput.types";

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

export const sanitizeNumericInput = (value: string, maxLength: number): string => {
  let sanitized = value.replace(/\D/g, "").replace(/^0+/, "");
  if (sanitized.length > maxLength) sanitized = sanitized.slice(0, maxLength);
  return sanitized;
};

export const isValidDate = (
  year: string | number,
  month: string | number,
  day: string | number
): boolean => {
  const y = parseInt(String(year), 10);
  const m = parseInt(String(month), 10);
  const d = parseInt(String(day), 10);

  if (!y || !m || !d) return false;
  if (y < 1000 || y > 9999) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;

  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

export const formatToISO = (
  year: string | number,
  month: string | number,
  day: string | number
): string => {
  if (!isValidDate(year, month, day)) return "";

  const y = parseInt(String(year), 10);
  const m = parseInt(String(month), 10);
  const d = parseInt(String(day), 10);

  return `${y}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
};

// Utility function to parse ISO date to display parts
export const parseISOToDisplay = (
  isoDate: string | null | undefined
): { month: string; day: string; year: string } => {
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDate || !isoPattern.test(isoDate)) {
    return { month: "", day: "", year: "" };
  }

  const [year, month, day] = isoDate.split("-");
  return {
    month: month.replace(/^0/, ""), // Remove leading zero for display
    day: day.replace(/^0/, ""), // Remove leading zero for display
    year
  };
};

// Utility function to get segment order based on format
export const getSegmentOrder = (format: DateFormat): Array<"day" | "month" | "year"> => {
  switch (format) {
    case "DD/MM/YYYY":
      return ["day", "month", "year"];
    case "MM/DD/YYYY":
      return ["month", "day", "year"];
    case "YYYY-MM-DD":
      return ["year", "month", "day"];
    default:
      return ["day", "month", "year"];
  }
};

// Utility function to generate placeholder text from format and separator
export const generatePlaceholder = (format: DateFormat, separator: string): string => {
  return format.replace(/\//g, separator);
};
