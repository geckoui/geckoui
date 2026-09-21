import type { ColorFormat, Hsva, Rgba } from "./ColorPicker.types";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const round = (value: number, places = 0) => {
  const factor = 10 ** places;

  return Math.round(value * factor) / factor;
};

/**
 * HSV rather than HSL, because the saturation square is an S by V plane. Going through
 * HSL would mean converting on every pointer move and drifting as it rounded.
 */
export const hsvaToRgba = ({ h, s, v, a }: Hsva): Rgba => {
  const saturation = s / 100;
  const value = v / 100;
  const chroma = value * saturation;
  const sector = ((h % 360) + 360) / 60;
  const second = chroma * (1 - Math.abs((sector % 2) - 1));
  const base = value - chroma;

  const [r, g, b] = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second]
  ][Math.floor(sector) % 6];

  return {
    r: Math.round((r + base) * 255),
    g: Math.round((g + base) * 255),
    b: Math.round((b + base) * 255),
    a
  };
};

export const rgbaToHsva = ({ r, g, b, a }: Rgba): Hsva => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const chroma = max - Math.min(red, green, blue);

  const hue = chroma
    ? max === red
      ? ((green - blue) / chroma) % 6
      : max === green
        ? (blue - red) / chroma + 2
        : (red - green) / chroma + 4
    : 0;

  /*
   * Two places, not whole numbers. A whole-number v of 96 is 244.8 coming back, so
   * #3b82f6 would return as #3b82f5 and every value in the field would drift by one.
   */
  return {
    h: round(((hue * 60) % 360) + (hue < 0 ? 360 : 0), 2),
    s: round(max ? (chroma / max) * 100 : 0, 2),
    v: round(max * 100, 2),
    a
  };
};

const hexPair = (value: number) => value.toString(16).padStart(2, "0");

export const rgbaToHex = ({ r, g, b, a }: Rgba, withAlpha: boolean) =>
  `#${hexPair(r)}${hexPair(g)}${hexPair(b)}${
    withAlpha ? hexPair(Math.round(clamp(a, 0, 1) * 255)) : ""
  }`;

/**
 * HSL is what CSS authors write, so it is offered as an output even though the picker
 * works in HSV. The hue is shared; only saturation and lightness are recomputed.
 */
const hsvaToHsl = ({ h, s, v }: Hsva) => {
  const value = v / 100;
  const saturation = s / 100;
  const lightness = value * (1 - saturation / 2);
  const divisor = Math.min(lightness, 1 - lightness);

  return {
    h: Math.round(h),
    s: Math.round((divisor ? (value - lightness) / divisor : 0) * 100),
    l: Math.round(lightness * 100)
  };
};

export const formatColor = (hsva: Hsva, format: ColorFormat, withAlpha: boolean): string => {
  const alpha = round(clamp(hsva.a, 0, 1), 2);

  if (format === "hsl") {
    const { h, s, l } = hsvaToHsl(hsva);

    return withAlpha ? `hsla(${h}, ${s}%, ${l}%, ${alpha})` : `hsl(${h}, ${s}%, ${l}%)`;
  }

  const { r, g, b } = hsvaToRgba(hsva);

  if (format === "rgb") {
    return withAlpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
  }

  return rgbaToHex({ r, g, b, a: alpha }, withAlpha);
};

const expand = (hex: string) =>
  hex.length <= 4
    ? hex
        .split("")
        .map((character) => character + character)
        .join("")
    : hex;

const parseHex = (input: string): Rgba | null => {
  const body = expand(input.replace("#", ""));

  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(body)) return null;

  return {
    r: parseInt(body.slice(0, 2), 16),
    g: parseInt(body.slice(2, 4), 16),
    b: parseInt(body.slice(4, 6), 16),
    a: body.length === 8 ? round(parseInt(body.slice(6, 8), 16) / 255, 2) : 1
  };
};

const numbersIn = (input: string) =>
  (input.match(/-?[\d.]+/g) ?? []).map((part) => Number.parseFloat(part));

const parseFunctional = (input: string): Hsva | null => {
  const parts = numbersIn(input);

  if (parts.length < 3) return null;

  const a = parts.length > 3 ? clamp(parts[3], 0, 1) : 1;

  if (input.startsWith("hsl")) {
    const [h, s, l] = parts;
    const lightness = clamp(l, 0, 100) / 100;
    const saturation = clamp(s, 0, 100) / 100;
    const value = lightness + saturation * Math.min(lightness, 1 - lightness);

    return {
      h: ((h % 360) + 360) % 360,
      s: round(value ? 2 * (1 - lightness / value) * 100 : 0, 2),
      v: round(value * 100, 2),
      a
    };
  }

  const [r, g, b] = parts;

  return rgbaToHsva({ r: clamp(r, 0, 255), g: clamp(g, 0, 255), b: clamp(b, 0, 255), a });
};

/**
 * What a caller's string means, or `null` when it means nothing.
 *
 * Returning null rather than guessing at black lets the text field reject what was typed
 * and put back what was there, instead of silently swallowing a typo.
 */
export const parseColor = (input: string | undefined | null): Hsva | null => {
  const text = input?.trim().toLowerCase();

  if (!text) return null;

  if (text.startsWith("rgb") || text.startsWith("hsl")) return parseFunctional(text);

  const rgba = parseHex(text);

  return rgba && rgbaToHsva(rgba);
};

/** The CSS for the hue this picker is on, with no saturation or value applied. */
export const pureHue = (h: number) => `hsl(${Math.round(h)}, 100%, 50%)`;

export const cssColor = (hsva: Hsva) => formatColor(hsva, "rgb", true);

export const sameColor = (a: Hsva, b: Hsva) =>
  a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
