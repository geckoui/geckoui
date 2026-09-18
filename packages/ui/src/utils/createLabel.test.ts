import { describe, expect, it } from "vitest";

import createLabel from "./createLabel";

describe("createLabel", () => {
  it("stringifies primitives", () => {
    expect(createLabel("Apple")).toBe("Apple");
    expect(createLabel(42)).toBe("42");
    expect(createLabel(true)).toBe("true");
  });

  it("returns nil values as they are, so nothing is rendered", () => {
    expect(createLabel(null)).toBeNull();
    expect(createLabel(undefined)).toBeUndefined();
  });

  it("skips a nil property and uses the first one with a value", () => {
    expect(createLabel({ id: null, name: "Ann" })).toBe("Ann");
    expect(createLabel({ id: undefined, ref: null, name: "Ann" })).toBe("Ann");
  });

  it("renders nothing when every property is nil", () => {
    expect(createLabel({ id: null, name: null })).toBeNull();
  });

  it("skips nil properties when walking into a nested object", () => {
    expect(createLabel({ user: { id: null, name: "Ann" } })).toBe("Ann");
  });

  it("skips nil items in an array", () => {
    expect(createLabel([null, "Ann"])).toBe("Ann");
    expect(createLabel([{ id: null, name: "Ann" }])).toBe("Ann");
  });

  it("still prefers an explicit label key over a nil property", () => {
    expect(createLabel({ id: null, label: "Ann" })).toBe("Ann");
  });

  it("leaves a non nil first property alone", () => {
    expect(createLabel({ name: "Ann", id: null })).toBe("Ann");
  });

  it("still uses the first property even when a later one reads better", () => {
    expect(createLabel({ id: 7, name: "Ann" })).toBe("7");
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
