import { describe, expect, it } from "vitest";

import { classNames } from "./classNames";

describe("classNames", () => {
  it("joins class names", () => {
    expect(classNames("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(classNames("a", undefined, false, "b")).toBe("a b");
  });

  it("returns an empty string when given nothing", () => {
    expect(classNames()).toBe("");
    expect(classNames(undefined, false)).toBe("");
  });

  it("lets a later tailwind class win over an earlier conflicting one", () => {
    // this is what makes the className prop able to override component defaults
    expect(classNames("p-2", "p-4")).toBe("p-4");
    expect(classNames("text-sm", "text-lg")).toBe("text-lg");
  });

  it("keeps non-conflicting tailwind classes", () => {
    expect(classNames("p-2", "text-sm")).toBe("p-2 text-sm");
  });
});
