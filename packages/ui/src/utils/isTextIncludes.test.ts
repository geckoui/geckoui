import { describe, expect, it } from "vitest";

import isTextIncludes from "./isTextIncludes";

describe("isTextIncludes", () => {
  it("matches a plain substring", () => {
    expect(isTextIncludes("Banana", "nan")).toBe(true);
  });

  it("ignores case", () => {
    expect(isTextIncludes("Banana", "BAN")).toBe(true);
    expect(isTextIncludes("banana", "Ban")).toBe(true);
  });

  it("ignores whitespace on both sides", () => {
    expect(isTextIncludes("United Kingdom", "unitedking")).toBe(true);
    expect(isTextIncludes("UnitedKingdom", "united king")).toBe(true);
  });

  it("ignores tabs and newlines too", () => {
    expect(isTextIncludes("New\tYork\nCity", "newyork")).toBe(true);
  });

  it("is false when the text does not match", () => {
    expect(isTextIncludes("Banana", "cherry")).toBe(false);
  });

  it("treats an empty search as a match", () => {
    expect(isTextIncludes("Banana", "")).toBe(true);
  });

  it("defaults a missing base string to empty", () => {
    expect(isTextIncludes(undefined, "a")).toBe(false);
    expect(isTextIncludes(undefined, "")).toBe(true);
  });

  it("coerces non string inputs", () => {
    expect(isTextIncludes(12345 as unknown as string, 234 as unknown as string)).toBe(true);
  });
});
