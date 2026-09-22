import { describe, expect, it } from "vitest";

import isNil from "./isNil";

describe("isNil", () => {
  it("is true for null", () => {
    expect(isNil(null)).toBe(true);
  });

  it("is true for undefined", () => {
    expect(isNil(undefined)).toBe(true);
  });

  it("is false for falsy values that are not nil", () => {
    expect(isNil(0)).toBe(false);
    expect(isNil("")).toBe(false);
    expect(isNil(false)).toBe(false);
    expect(isNil(NaN)).toBe(false);
  });

  it("is false for objects and arrays", () => {
    expect(isNil({})).toBe(false);
    expect(isNil([])).toBe(false);
  });
});
