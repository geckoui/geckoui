import { describe, expect, it } from "vitest";

import createLabel from "./createLabel";

describe("createLabel", () => {
  it("stringifies primitives", () => {
    expect(createLabel("Apple")).toBe("Apple");
    expect(createLabel(42)).toBe("42");
    expect(createLabel(true)).toBe("true");
  });

  it("stringifies undefined", () => {
    expect(createLabel(undefined)).toBe("undefined");
  });

  // KNOWN BUG, left unfixed on purpose: `typeof null === "object"`, so null falls into
  // the object branch and `Object.values(null)` throws
  // "Cannot convert undefined or null to object". SelectButton calls createLabel(value)
  // whenever the value is not undefined and matches no option, so <Select value={null}>
  // with no matching option crashes. Delete this marker once fixed.
  it.fails("stringifies null", () => {
    expect(createLabel(null)).toBe("null");
  });

  it("uses the label key of an object", () => {
    expect(createLabel({ value: 1, label: "Apple" })).toBe("Apple");
  });

  it("falls back to the first value of an object without a label", () => {
    expect(createLabel({ name: "Apple", value: 1 })).toBe("Apple");
  });

  it("stringifies an empty object", () => {
    expect(createLabel({})).toBe("[object Object]");
  });

  it("walks into a nested object", () => {
    expect(createLabel({ user: { label: "Apple" } })).toBe("Apple");
  });

  it("uses the first item of an array", () => {
    expect(createLabel(["Apple", "Banana"])).toBe("Apple");
  });

  it("uses the label of the first object in an array", () => {
    expect(createLabel([{ label: "Apple" }])).toBe("Apple");
  });

  it("returns the nil first item of an array as is", () => {
    expect(createLabel([null])).toBeNull();
    expect(createLabel([undefined])).toBeUndefined();
  });

  it("throws for a function", () => {
    expect(() => createLabel(() => {})).toThrow("You cannot pass a function as an dropdown item");
  });
});
