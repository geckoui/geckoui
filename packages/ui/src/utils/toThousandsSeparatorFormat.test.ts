import { describe, expect, it } from "vitest";

import { toThousandsSeparatorFormat } from "./toThousandsSeparatorFormat";

describe("toThousandsSeparatorFormat", () => {
  it("groups thousands", () => {
    expect(toThousandsSeparatorFormat("1234567")).toBe("1,234,567");
  });

  it("keeps the fraction as typed", () => {
    expect(toThousandsSeparatorFormat("1234567.89")).toBe("1,234,567.89");
  });

  it("leaves a short number alone", () => {
    expect(toThousandsSeparatorFormat("123")).toBe("123");
  });

  it("handles zero", () => {
    expect(toThousandsSeparatorFormat("0")).toBe("0");
  });

  it("returns an empty string for empty input", () => {
    expect(toThousandsSeparatorFormat("")).toBe("");
  });

  it("passes a lone minus sign through, so it can be typed", () => {
    expect(toThousandsSeparatorFormat("-")).toBe("-");
  });

  it("keeps a trailing decimal point, so a fraction can still be typed", () => {
    expect(toThousandsSeparatorFormat("1234.")).toBe("1,234.");
  });

  it("formats a negative number", () => {
    expect(toThousandsSeparatorFormat("-1234")).toBe("-1,234");
  });
});
