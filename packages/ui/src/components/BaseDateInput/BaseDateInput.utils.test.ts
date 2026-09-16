import { describe, expect, it } from "vitest";

import {
  formatToISO,
  generatePlaceholder,
  getDaysInMonth,
  getSegmentOrder,
  isValidDate,
  parseISOToDisplay,
  sanitizeNumericInput
} from "./BaseDateInput.utils";

describe("getDaysInMonth", () => {
  it("counts the days of a 31 day month", () => {
    expect(getDaysInMonth(1, 2024)).toBe(31);
    expect(getDaysInMonth(12, 2024)).toBe(31);
  });

  it("counts the days of a 30 day month", () => {
    expect(getDaysInMonth(4, 2024)).toBe(30);
  });

  it("counts February in a leap year", () => {
    expect(getDaysInMonth(2, 2024)).toBe(29);
  });

  it("counts February in a normal year", () => {
    expect(getDaysInMonth(2, 2023)).toBe(28);
  });

  it("treats a century year divisible by 400 as a leap year", () => {
    expect(getDaysInMonth(2, 2000)).toBe(29);
    expect(getDaysInMonth(2, 1900)).toBe(28);
  });
});

describe("sanitizeNumericInput", () => {
  it("drops non digits", () => {
    expect(sanitizeNumericInput("1a2b", 4)).toBe("12");
  });

  it("drops leading zeros", () => {
    expect(sanitizeNumericInput("007", 4)).toBe("7");
  });

  it("truncates to the max length", () => {
    expect(sanitizeNumericInput("123456", 4)).toBe("1234");
    expect(sanitizeNumericInput("123", 2)).toBe("12");
  });

  it("returns an empty string for only zeros", () => {
    expect(sanitizeNumericInput("000", 4)).toBe("");
  });

  it("returns an empty string for no digits", () => {
    expect(sanitizeNumericInput("abc", 4)).toBe("");
    expect(sanitizeNumericInput("", 4)).toBe("");
  });

  it("drops the leading zeros before truncating", () => {
    expect(sanitizeNumericInput("02024", 4)).toBe("2024");
  });
});

describe("isValidDate", () => {
  it("accepts a real date", () => {
    expect(isValidDate(2024, 1, 31)).toBe(true);
    expect(isValidDate("2024", "02", "29")).toBe(true);
  });

  it("rejects a day the month does not have", () => {
    expect(isValidDate(2023, 2, 29)).toBe(false);
    expect(isValidDate(2024, 4, 31)).toBe(false);
  });

  it("rejects an out of range month", () => {
    expect(isValidDate(2024, 0, 10)).toBe(false);
    expect(isValidDate(2024, 13, 10)).toBe(false);
  });

  it("rejects an out of range day", () => {
    expect(isValidDate(2024, 1, 0)).toBe(false);
    expect(isValidDate(2024, 1, 32)).toBe(false);
  });

  it("rejects a year outside four digits", () => {
    expect(isValidDate(999, 1, 1)).toBe(false);
    expect(isValidDate(10000, 1, 1)).toBe(false);
  });

  it("rejects missing or non numeric parts", () => {
    expect(isValidDate("", 1, 1)).toBe(false);
    expect(isValidDate(2024, "", 1)).toBe(false);
    expect(isValidDate(2024, 1, "")).toBe(false);
    expect(isValidDate("abc", "def", "ghi")).toBe(false);
  });
});

describe("formatToISO", () => {
  it("pads the month and day", () => {
    expect(formatToISO(2024, 1, 5)).toBe("2024-01-05");
  });

  it("keeps two digit parts as they are", () => {
    expect(formatToISO("2024", "12", "31")).toBe("2024-12-31");
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatToISO(2023, 2, 29)).toBe("");
    expect(formatToISO("", "", "")).toBe("");
  });
});

describe("parseISOToDisplay", () => {
  it("splits an ISO date and drops leading zeros", () => {
    expect(parseISOToDisplay("2024-01-05")).toEqual({ month: "1", day: "5", year: "2024" });
  });

  it("keeps two digit parts", () => {
    expect(parseISOToDisplay("2024-12-31")).toEqual({ month: "12", day: "31", year: "2024" });
  });

  it("returns empty parts for anything that is not an ISO date", () => {
    const empty = { month: "", day: "", year: "" };
    expect(parseISOToDisplay("05/01/2024")).toEqual(empty);
    expect(parseISOToDisplay("2024-1-5")).toEqual(empty);
    expect(parseISOToDisplay("")).toEqual(empty);
    expect(parseISOToDisplay(null)).toEqual(empty);
    expect(parseISOToDisplay(undefined)).toEqual(empty);
  });
});

describe("getSegmentOrder", () => {
  it("orders the segments by format", () => {
    expect(getSegmentOrder("DD/MM/YYYY")).toEqual(["day", "month", "year"]);
    expect(getSegmentOrder("MM/DD/YYYY")).toEqual(["month", "day", "year"]);
    expect(getSegmentOrder("YYYY-MM-DD")).toEqual(["year", "month", "day"]);
  });

  it("falls back to day month year", () => {
    expect(getSegmentOrder("nonsense" as never)).toEqual(["day", "month", "year"]);
  });
});

describe("generatePlaceholder", () => {
  it("swaps the slashes for the separator", () => {
    expect(generatePlaceholder("DD/MM/YYYY", "-")).toBe("DD-MM-YYYY");
    expect(generatePlaceholder("MM/DD/YYYY", ".")).toBe("MM.DD.YYYY");
  });

  it("leaves a format without slashes alone", () => {
    expect(generatePlaceholder("YYYY-MM-DD", "/")).toBe("YYYY-MM-DD");
  });
});
