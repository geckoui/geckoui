import { describe, expect, it } from "vitest";

import type { Hsva } from "./ColorPicker.types";
import { formatColor, hsvaToRgba, parseColor, rgbaToHsva } from "./ColorPicker.utils";

const RED: Hsva = { h: 0, s: 100, v: 100, a: 1 };
const BLUE: Hsva = { h: 217, s: 76, v: 96, a: 1 };

describe("hsvaToRgba", () => {
  it.each([
    [
      { h: 0, s: 100, v: 100, a: 1 },
      { r: 255, g: 0, b: 0 }
    ],
    [
      { h: 120, s: 100, v: 100, a: 1 },
      { r: 0, g: 255, b: 0 }
    ],
    [
      { h: 240, s: 100, v: 100, a: 1 },
      { r: 0, g: 0, b: 255 }
    ],
    [
      { h: 60, s: 100, v: 100, a: 1 },
      { r: 255, g: 255, b: 0 }
    ],
    [
      { h: 180, s: 100, v: 100, a: 1 },
      { r: 0, g: 255, b: 255 }
    ],
    [
      { h: 300, s: 100, v: 100, a: 1 },
      { r: 255, g: 0, b: 255 }
    ],
    [
      { h: 0, s: 0, v: 100, a: 1 },
      { r: 255, g: 255, b: 255 }
    ],
    [
      { h: 0, s: 0, v: 0, a: 1 },
      { r: 0, g: 0, b: 0 }
    ]
  ])("turns %o into the right channels", (hsva, expected) => {
    expect(hsvaToRgba(hsva)).toMatchObject(expected);
  });

  it("wraps a hue past 360 rather than falling off the end", () => {
    expect(hsvaToRgba({ h: 360, s: 100, v: 100, a: 1 })).toMatchObject({ r: 255, g: 0, b: 0 });
  });
});

describe("rgbaToHsva", () => {
  it("is the inverse of hsvaToRgba", () => {
    expect(rgbaToHsva(hsvaToRgba(RED))).toMatchObject(RED);
  });

  it("reports no hue and no saturation for a grey", () => {
    expect(rgbaToHsva({ r: 128, g: 128, b: 128, a: 1 })).toMatchObject({ h: 0, s: 0 });
  });
});

describe("parseColor", () => {
  it.each([
    ["#ff0000", { h: 0, s: 100, v: 100, a: 1 }],
    ["#f00", { h: 0, s: 100, v: 100, a: 1 }],
    ["ff0000", { h: 0, s: 100, v: 100, a: 1 }],
    ["#FF0000", { h: 0, s: 100, v: 100, a: 1 }],
    ["rgb(255, 0, 0)", { h: 0, s: 100, v: 100, a: 1 }],
    ["rgba(255, 0, 0, 0.5)", { h: 0, s: 100, v: 100, a: 0.5 }],
    ["hsl(0, 100%, 50%)", { h: 0, s: 100, v: 100, a: 1 }],
    ["hsla(0, 100%, 50%, 0.5)", { h: 0, s: 100, v: 100, a: 0.5 }]
  ])("reads %s", (input, expected) => {
    expect(parseColor(input)).toMatchObject(expected);
  });

  it("reads the alpha out of an eight digit hex", () => {
    expect(parseColor("#ff000080")?.a).toBe(0.5);
  });

  it("reads a four digit hex as three digits plus alpha", () => {
    expect(parseColor("#f00f")).toMatchObject({ h: 0, s: 100, v: 100, a: 1 });
  });

  it.each(["", "   ", "nonsense", "#12345", "#gggggg", "rgb(255)", undefined, null])(
    "returns null for %s rather than guessing",
    (input) => {
      expect(parseColor(input)).toBeNull();
    }
  );

  it("ignores the whitespace and case around a value", () => {
    expect(parseColor("  #FF0000  ")).toMatchObject({ h: 0, s: 100, v: 100 });
  });
});

describe("formatColor", () => {
  it("writes hex without alpha by default", () => {
    expect(formatColor(RED, "hex", false)).toBe("#ff0000");
  });

  it("writes eight digit hex when alpha is on", () => {
    expect(formatColor({ ...RED, a: 0.5 }, "hex", true)).toBe("#ff000080");
  });

  it("writes rgb and rgba", () => {
    expect(formatColor(RED, "rgb", false)).toBe("rgb(255, 0, 0)");
    expect(formatColor({ ...RED, a: 0.5 }, "rgb", true)).toBe("rgba(255, 0, 0, 0.5)");
  });

  it("writes hsl and hsla", () => {
    expect(formatColor(RED, "hsl", false)).toBe("hsl(0, 100%, 50%)");
    expect(formatColor({ ...RED, a: 0.5 }, "hsl", true)).toBe("hsla(0, 100%, 50%, 0.5)");
  });

  it.each([
    "#3b82f6",
    "#10b981",
    "#ef4444",
    "#64748b",
    "#0f172a",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#ffffff",
    "#000000"
  ])("gives %s back unchanged, to the exact channel", (hex) => {
    expect(formatColor(parseColor(hex)!, "hex", false)).toBe(hex);
  });

  it.each(["hex", "rgb", "hsl"] as const)("survives a round trip through %s", (format) => {
    const written = formatColor(BLUE, format, false);
    const read = parseColor(written);

    expect(read).not.toBeNull();
    expect(formatColor(read!, format, false)).toBe(written);
  });
});
