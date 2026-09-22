/** Snaps to the grid and trims the float drift that dividing by a precision leaves. */
const snap = (value: number, precision: number): number =>
  Number((Math.round(value / precision) * precision).toFixed(4));

/** Where a pointer falls on one icon, as the rating it would set. */
export const ratingAt = (
  clientX: number,
  icon: { left: number; width: number },
  index: number,
  precision: number
): number => {
  const whole = index + 1;

  if (!icon.width || precision >= 1) return whole;

  const across = (clientX - icon.left) / icon.width;
  // Rounded up, so the first sliver of an icon already earns the smallest step of it
  const earned = Math.ceil(across / precision) * precision;

  return snap(index + Math.min(Math.max(earned, precision), 1), precision);
};

/**
 * How much of one icon is filled, 0 to 1.
 *
 * Kept as a fraction rather than a yes or no, so a 4.3 average reads as 4.3 rather than
 * being rounded to something the reader was never told. This is what is drawn whether the
 * rating can be picked or not; `precision` only decides what a click lands on.
 */
export const fillOf = (value: number, index: number): number => {
  const filled = value - index;

  return Math.min(Math.max(filled, 0), 1);
};

/** The values the arrow keys step through. */
export const stepsFor = (max: number, precision: number): number[] => {
  const step = precision > 0 && precision <= 1 ? precision : 1;
  const count = Math.round(max / step);

  return Array.from({ length: count }, (_, index) => snap((index + 1) * step, step));
};
