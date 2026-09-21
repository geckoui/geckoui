import { describe, expect, it } from "vitest";

import { fillOf, ratingAt, stepsFor } from "./Rating.utils";

const icon = { left: 100, width: 20 };

describe("ratingAt", () => {
  it("is the whole icon when there is nothing finer to land on", () => {
    expect(ratingAt(101, icon, 0, 1)).toBe(1);
    expect(ratingAt(119, icon, 0, 1)).toBe(1);
    expect(ratingAt(105, icon, 3, 1)).toBe(4);
  });

  it.each([
    [101, 0.5],
    [109, 0.5],
    [111, 1],
    [119, 1]
  ])("splits an icon in two at %s", (clientX, expected) => {
    expect(ratingAt(clientX, icon, 0, 0.5)).toBe(expected);
  });

  it.each([
    [101, 0.25],
    [106, 0.5],
    [111, 0.75],
    [119, 1]
  ])("splits it in four at %s", (clientX, expected) => {
    expect(ratingAt(clientX, icon, 0, 0.25)).toBe(expected);
  });

  it("earns the smallest step from the first sliver, never nothing", () => {
    // landing on an icon at all is worth something; zero is what the clear is for
    expect(ratingAt(100, icon, 0, 0.5)).toBe(0.5);
    expect(ratingAt(100, icon, 0, 0.1)).toBe(0.1);
  });

  it("never runs past the icon it is on", () => {
    expect(ratingAt(500, icon, 0, 0.5)).toBe(1);
    expect(ratingAt(500, icon, 2, 0.25)).toBe(3);
  });

  it("counts from the icon it is on", () => {
    expect(ratingAt(101, icon, 2, 0.5)).toBe(2.5);
    expect(ratingAt(119, icon, 4, 0.5)).toBe(5);
  });

  it("gives the whole icon when there is nothing to measure against", () => {
    expect(ratingAt(101, { left: 100, width: 0 }, 2, 0.5)).toBe(3);
  });

  it("keeps a tenth a tenth, rather than 0.30000000000000004", () => {
    expect(ratingAt(105, icon, 0, 0.1)).toBe(0.3);
    expect(ratingAt(114, icon, 1, 0.1)).toBe(1.7);
  });
});

describe("fillOf", () => {
  it.each([
    [3, 0, 1],
    [3, 2, 1],
    [3, 3, 0],
    [3, 4, 0],
    [4.3, 4, 0.3],
    [2.7, 2, 0.7]
  ])("fills icon %s of a %s rating by %s", (value, index, expected) => {
    expect(fillOf(value, index)).toBeCloseTo(expected, 5);
  });

  it("holds between empty and full, whatever it is given", () => {
    expect(fillOf(99, 0)).toBe(1);
    expect(fillOf(-4, 0)).toBe(0);
  });
});

describe("stepsFor", () => {
  it("walks the whole icons by default", () => {
    expect(stepsFor(5, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it("walks the halves", () => {
    expect(stepsFor(3, 0.5)).toEqual([0.5, 1, 1.5, 2, 2.5, 3]);
  });

  it("keeps a tenth a tenth", () => {
    expect(stepsFor(1, 0.1)).toEqual([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
  });

  it("falls back to whole icons when the precision cannot divide one", () => {
    expect(stepsFor(3, 0)).toEqual([1, 2, 3]);
    expect(stepsFor(3, 2)).toEqual([1, 2, 3]);
  });
});
