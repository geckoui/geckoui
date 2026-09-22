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

  it("renders nothing for an object with no printable text", () => {
    expect(createLabel({})).toBeNull();
  });

  it("uses an object's own text when it has one", () => {
    expect(createLabel(new Date(2024, 0, 15))).toContain("Jan 15 2024");
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

  it("renders nothing for an array of only nil items", () => {
    expect(createLabel([null])).toBeNull();
    expect(createLabel([undefined])).toBeNull();
    expect(createLabel([null, undefined])).toBeNull();
  });

  it("keeps an empty string, which is a stored value rather than a missing one", () => {
    expect(createLabel({ id: null, name: "" })).toBe("");
    expect(createLabel({ name: "", id: 7 })).toBe("");
    expect(createLabel([null, "", "Ann"])).toBe("");
  });

  it("keeps a whitespace only string", () => {
    expect(createLabel({ id: null, name: "   " })).toBe("   ");
  });

  it("renders nothing for an empty array", () => {
    expect(createLabel([])).toBeNull();
  });

  it("moves on when a nested object has nothing to print", () => {
    expect(createLabel({ a: { id: null }, b: "Ann" })).toBe("Ann");
  });

  it("renders nothing when a nested object is the only candidate and is empty", () => {
    expect(createLabel({ a: {} })).toBeNull();
  });

  it("walks into a nested object and skips its nil properties", () => {
    expect(createLabel({ a: { id: null, name: "Ann" } })).toBe("Ann");
  });

  it("keeps an empty label key but not a nil one", () => {
    expect(createLabel({ label: "" })).toBe("");
    expect(createLabel({ label: null })).toBeNull();
  });

  it("keeps a whitespace only top level string", () => {
    expect(createLabel("   ")).toBe("   ");
  });

  it("keeps a falsy value", () => {
    expect(createLabel({ count: 0, name: "Ann" })).toBe("0");
    expect(createLabel({ active: false, name: "Ann" })).toBe("false");
  });

  it("throws for a function", () => {
    expect(() => createLabel(() => {})).toThrow("You cannot pass a function as an dropdown item");
  });
});
