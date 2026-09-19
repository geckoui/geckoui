import { describe, expect, it } from "vitest";

import { looseKey, splitOnSeparators } from "./TagInput.utils";

describe("looseKey", () => {
  it.each([
    ["Vue", "vue"],
    ["VUE", "vue"],
    ["  Vue  ", "vue"],
    ["United  State", "united state"],
    ["united\tstate", "united state"],
    ["United State", "united state"]
  ])("reads %s as %s", (text, expected) => {
    expect(looseKey(text)).toBe(expected);
  });

  it("folds case and spacing, and nothing else", () => {
    // a different word is a different tag, however close it looks
    expect(looseKey("United States")).not.toBe(looseKey("United State"));
    expect(looseKey("re-act")).not.toBe(looseKey("react"));
  });
});

describe("splitOnSeparators", () => {
  it("breaks a paste on every separator", () => {
    expect(splitOnSeparators("ada, grace, alan", ["Enter", ","])).toEqual(["ada", "grace", "alan"]);
  });

  it("breaks on new lines whatever the separators are", () => {
    expect(splitOnSeparators("ada\ngrace\r\nalan", ["Enter"])).toEqual(["ada", "grace", "alan"]);
  });

  it("trims each part and drops the empty ones", () => {
    expect(splitOnSeparators(" ada ,, grace ,", ["Enter", ","])).toEqual(["ada", "grace"]);
  });

  it("gives back the one thing when there is nothing to break on", () => {
    expect(splitOnSeparators("ada", ["Enter", ","])).toEqual(["ada"]);
  });
});
