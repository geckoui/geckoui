import { describe, expect, it } from "vitest";

import { hasDisplayName } from "./index";

const Named = () => null;
Named.displayName = "Named";

const Other = () => null;
Other.displayName = "Other";

const Anonymous = () => null;

describe("hasDisplayName", () => {
  it("matches an element with the given displayName", () => {
    expect(hasDisplayName("Named")(<Named />)).toBe(true);
  });

  it("does not match a different displayName", () => {
    expect(hasDisplayName("Named")(<Other />)).toBe(false);
  });

  it("does not match a component without a displayName", () => {
    expect(hasDisplayName("Named")(<Anonymous />)).toBe(false);
  });

  it("does not match a host element", () => {
    expect(hasDisplayName("Named")(<div />)).toBe(false);
  });

  it("does not match plain nodes", () => {
    const isNamed = hasDisplayName("Named");
    expect(isNamed("Named")).toBe(false);
    expect(isNamed(null)).toBe(false);
    expect(isNamed(undefined)).toBe(false);
    expect(isNamed(42)).toBe(false);
  });
});
