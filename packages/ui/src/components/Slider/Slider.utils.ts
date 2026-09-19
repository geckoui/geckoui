export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * How many decimals a step carries, so a value snapped to it does not come back as
 * 0.30000000000000004.
 */
const decimalsOf = (step: number): number => {
  const [, fraction = ""] = String(step).split(".");

  return fraction.length;
};

/** The nearest value on the step grid, measured from `min` rather than from zero. */
export const snapToStep = (value: number, min: number, step: number): number => {
  if (!Number.isFinite(step) || step <= 0) return value;

  const snapped = min + Math.round((value - min) / step) * step;

  return Number(snapped.toFixed(decimalsOf(step)));
};

export const percentOf = (value: number, min: number, max: number): number =>
  max === min ? 0 : ((value - min) / (max - min)) * 100;

export const valueAtPercent = (percent: number, min: number, max: number): number =>
  min + (percent / 100) * (max - min);

/** Which thumb a click belongs to: the closest one, and the later one on a tie. */
export const nearestThumb = (values: number[], value: number): number => {
  let nearest = 0;

  values.forEach((current, index) => {
    if (Math.abs(current - value) <= Math.abs(values[nearest] - value)) nearest = index;
  });

  return nearest;
};
