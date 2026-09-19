import { describe, expect, it } from "vitest";

import { clamp, nearestThumb, percentOf, snapToStep, valueAtPercent } from "./Slider.utils";

describe("clamp", () => {
  it.each([
    [5, 0, 10, 5],
    [-5, 0, 10, 0],
    [15, 0, 10, 10]
  ])("holds %s between %s and %s", (value, min, max, expected) => {
    expect(clamp(value, min, max)).toBe(expected);
  });
});

describe("snapToStep", () => {
  it("takes the nearest point on the grid", () => {
    expect(snapToStep(42, 0, 5)).toBe(40);
    expect(snapToStep(43, 0, 5)).toBe(45);
  });

  it("measures the grid from min, not from zero", () => {
    // with min 1 and step 5 the grid is 1, 6, 11, so 7 belongs to 6
    expect(snapToStep(7, 1, 5)).toBe(6);
    expect(snapToStep(9, 1, 5)).toBe(11);
  });

  it("keeps a fractional step's own precision", () => {
    // 0.1 + 0.2 arithmetic would otherwise surface as 0.30000000000000004
    expect(snapToStep(0.3, 0, 0.1)).toBe(0.3);
    expect(snapToStep(0.27, 0, 0.1)).toBe(0.3);
    expect(snapToStep(2.35, 0, 0.05)).toBe(2.35);
  });

  it("leaves the value alone when the step cannot divide anything", () => {
    expect(snapToStep(42.7, 0, 0)).toBe(42.7);
    expect(snapToStep(42.7, 0, -1)).toBe(42.7);
  });
});

describe("percentOf and valueAtPercent", () => {
  it.each([
    [0, 0, 100, 0],
    [50, 0, 100, 50],
    [100, 0, 100, 100],
    [5, 0, 10, 50],
    [150, 100, 200, 50]
  ])("puts %s of %s..%s at %s per cent", (value, min, max, expected) => {
    expect(percentOf(value, min, max)).toBe(expected);
    expect(valueAtPercent(expected, min, max)).toBe(value);
  });

  it("stays at zero rather than dividing by an empty range", () => {
    expect(percentOf(5, 5, 5)).toBe(0);
  });
});

describe("nearestThumb", () => {
  it("picks the closer one", () => {
    expect(nearestThumb([20, 80], 30)).toBe(0);
    expect(nearestThumb([20, 80], 70)).toBe(1);
  });

  it("takes the later one on a tie, so a click between two stacked thumbs can still move", () => {
    expect(nearestThumb([50, 50], 50)).toBe(1);
    expect(nearestThumb([20, 80], 50)).toBe(1);
  });

  it("is always the only thumb when there is one", () => {
    expect(nearestThumb([40], 90)).toBe(0);
  });
});
