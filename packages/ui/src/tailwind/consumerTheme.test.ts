import { describe, expect, it } from "vitest";

import { createConsumerTheme, getThemeColorTokens } from "./consumerTheme";

describe("getThemeColorTokens", () => {
  it("reads every colour token from the first @theme block", () => {
    const tokens = getThemeColorTokens(`
      @theme {
        --color-primary-500: oklch(0.6 0.1 250);
        /* a comment */
        --color-surface-primary: oklch(1 0 none);
      }
      :root { --color-ignored: red; }
    `);

    expect(tokens).toEqual(["--color-primary-500", "--color-surface-primary"]);
  });

  it("reads a @theme block that has options", () => {
    expect(getThemeColorTokens("@theme static { --color-error: red; }")).toEqual(["--color-error"]);
  });

  it("lists a token once when it repeats", () => {
    expect(
      getThemeColorTokens("@theme { --color-error: red; --color-error: blue; }")
    ).toEqual(["--color-error"]);
  });

  it("returns nothing without a @theme block", () => {
    expect(getThemeColorTokens(":root { --color-x: red; }")).toEqual([]);
  });
});

describe("createConsumerTheme", () => {
  it("points each token at its own variable without redeclaring it", () => {
    expect(createConsumerTheme(["--color-surface-primary", "--color-error"])).toBe(
      "@theme inline reference {\n" +
        "  --color-surface-primary: var(--color-surface-primary);\n" +
        "  --color-error: var(--color-error);\n" +
        "}\n"
    );
  });

  it("adds nothing when there are no tokens", () => {
    expect(createConsumerTheme([])).toBe("");
  });
});
