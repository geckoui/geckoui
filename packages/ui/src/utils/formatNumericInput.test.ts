import { describe, expect, it } from "vitest";

import { formatNumericInput } from "./formatNumericInput";

describe("formatNumericInput", () => {
  describe("keeps a half-typed number intact", () => {
    it("preserves a trailing decimal point", () => {
      // the whole reason the value is a string: deleting the 8 from 2.8 must leave "2."
      // so the user can carry on typing 2.5
      expect(formatNumericInput("2.")).toBe("2.");
    });

    it("preserves a trailing zero after the point", () => {
      expect(formatNumericInput("2.0")).toBe("2.0");
    });

    it("preserves a lone minus sign", () => {
      expect(formatNumericInput("-")).toBe("-");
    });

    it("preserves an empty string", () => {
      expect(formatNumericInput("")).toBe("");
    });
  });

  describe("sanitising", () => {
    it("strips letters and symbols", () => {
      expect(formatNumericInput("12a3")).toBe("123");
      expect(formatNumericInput("1,234")).toBe("1234");
    });

    it("keeps only the first decimal point", () => {
      expect(formatNumericInput("1.2.3")).toBe("1.2");
    });

    it("keeps a leading minus sign", () => {
      expect(formatNumericInput("-4.5")).toBe("-4.5");
    });
  });

  describe("strict", () => {
    it("drops leading zeros by default", () => {
      expect(formatNumericInput("007")).toBe("7");
    });

    it("keeps a single zero", () => {
      expect(formatNumericInput("0")).toBe("0");
    });

    it("keeps leading zeros when off", () => {
      expect(formatNumericInput("007", { strict: false })).toBe("007");
    });

    it("does not disturb the fraction", () => {
      expect(formatNumericInput("0.45")).toBe("0.45");
    });
  });

  describe("positiveOnly", () => {
    it("removes a leading minus sign", () => {
      expect(formatNumericInput("-4", { positiveOnly: true })).toBe("4");
    });
  });

  describe("digit limits", () => {
    it("maxFractionDigits truncates the fraction", () => {
      expect(formatNumericInput("1.239", { maxFractionDigits: 2 })).toBe("1.23");
    });

    it("maxFractionDigits of 0 removes the decimal point entirely", () => {
      expect(formatNumericInput("2.8", { maxFractionDigits: 0 })).toBe("2");
    });

    it("maxWholeDigitPlaces truncates the whole part", () => {
      expect(formatNumericInput("123456", { maxWholeDigitPlaces: 3 })).toBe("123");
    });
  });

  describe("input that is not a string", () => {
    it("coerces a number rather than throwing", () => {
      // an unmigrated form default can still arrive here
      expect(formatNumericInput(12.5 as unknown as string)).toBe("12.5");
    });

    it("treats null and undefined as empty", () => {
      expect(formatNumericInput(null as unknown as string)).toBe("");
      expect(formatNumericInput(undefined as unknown as string)).toBe("");
    });
  });
});
