import { describe, expect, it } from "vitest";

import Step from "./Step/Step";
import { isReachableAt, statusAt, stepValuesFrom } from "./Stepper.utils";

describe("stepValuesFrom", () => {
  it("reads the steps in the order they were written", () => {
    expect(
      stepValuesFrom([
        <Step key="a" value="a" />,
        <Step key="b" value="b" />,
        <Step key="c" value="c" />
      ])
    ).toEqual(["a", "b", "c"]);
  });

  it("walks past anything that is not a step", () => {
    expect(stepValuesFrom([<Step key="a" value="a" />, <div key="x" />, "text", null])).toEqual([
      "a"
    ]);
  });
});

describe("statusAt", () => {
  it.each([
    [0, 2, "complete"],
    [1, 2, "complete"],
    [2, 2, "current"],
    [3, 2, "upcoming"]
  ] as const)("step %s of a stepper on %s is %s", (index, current, expected) => {
    expect(statusAt(index, current)).toBe(expected);
  });

  it("leaves everything ahead when the value matches no step", () => {
    // a value nobody answers to should not make the first step look current
    expect(statusAt(0, -1)).toBe("upcoming");
    expect(statusAt(3, -1)).toBe("upcoming");
  });
});

describe("isReachableAt", () => {
  it("lets you back, but not ahead", () => {
    expect(isReachableAt(0, 2, true)).toBe(true);
    expect(isReachableAt(2, 2, true)).toBe(true);
    expect(isReachableAt(3, 2, true)).toBe(false);
  });

  it("opens everything up when the steps need no order", () => {
    expect(isReachableAt(3, 0, false)).toBe(true);
  });
});
