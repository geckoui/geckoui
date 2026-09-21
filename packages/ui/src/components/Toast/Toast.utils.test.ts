import { describe, expect, it } from "vitest";

import { AXIS_LOCK, axisOf, shouldDismiss, swipeDirectionsFor } from "./Toast.utils";

describe("swipeDirectionsFor", () => {
  it.each([
    ["bottom-right", { x: 1, y: 1 }],
    ["top-right", { x: 1, y: -1 }],
    ["bottom-left", { x: -1, y: 1 }],
    ["top-left", { x: -1, y: -1 }],
    ["bottom-center", { x: 0, y: 1 }],
    ["top-center", { x: 0, y: -1 }]
  ] as const)("sends a %s toast out by the nearest edges", (position, expected) => {
    expect(swipeDirectionsFor(position)).toEqual(expected);
  });

  it("gives a centred toast only the one way out", () => {
    // either side would be across the screen rather than off it
    expect(swipeDirectionsFor("bottom-center").x).toBe(0);
    expect(swipeDirectionsFor("top-center").x).toBe(0);
  });
});

describe("axisOf", () => {
  const bottomRight = swipeDirectionsFor("bottom-right");
  const topLeft = swipeDirectionsFor("top-left");
  const bottomCenter = swipeDirectionsFor("bottom-center");

  it("waits until the drag has gone far enough to tell", () => {
    expect(axisOf(AXIS_LOCK - 1, 0, bottomRight)).toBeNull();
    expect(axisOf(AXIS_LOCK, 0, bottomRight)).toBe("x");
  });

  it("takes whichever way the drag is going", () => {
    expect(axisOf(50, 10, bottomRight)).toBe("x");
    expect(axisOf(10, 50, bottomRight)).toBe("y");
  });

  it("reads each position's own outward way", () => {
    // up and left are outwards for a top-left toast
    expect(axisOf(0, -50, topLeft)).toBe("y");
    expect(axisOf(-50, 0, topLeft)).toBe("x");
  });

  it("ignores a drag back into the screen", () => {
    expect(axisOf(-50, 0, bottomRight)).toBeNull();
    expect(axisOf(0, -50, bottomRight)).toBeNull();
    expect(axisOf(50, 0, topLeft)).toBeNull();
  });

  it("ignores the axis a position does not leave by", () => {
    expect(axisOf(80, 0, bottomCenter)).toBeNull();
    expect(axisOf(0, 80, bottomCenter)).toBe("y");
  });
});

describe("shouldDismiss", () => {
  it("lets go of a long drag, however slow", () => {
    expect(shouldDismiss(80, 5000)).toBe(true);
  });

  it("lets go of a quick flick", () => {
    expect(shouldDismiss(30, 50)).toBe(true);
  });

  it("holds on to a short, slow drag", () => {
    expect(shouldDismiss(20, 2000)).toBe(false);
  });

  it("holds on to a twitch, however fast it arrived", () => {
    // a small move in a couple of milliseconds is arithmetically a very quick one, so
    // speed alone would throw the toast away on a stray flinch
    expect(shouldDismiss(2, 1)).toBe(false);
    expect(shouldDismiss(20, 1)).toBe(false);
  });

  it("does not divide by an instant", () => {
    expect(shouldDismiss(30, 0)).toBe(false);
  });
});
