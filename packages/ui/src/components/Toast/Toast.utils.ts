import type { ToastPosition } from "./Toast.types";

export interface SwipeDirections {
  /** Which way is outwards on each axis, or 0 when that axis does not dismiss. */
  x: 1 | -1 | 0;
  y: 1 | -1 | 0;
}

/**
 * The ways a toast can be swiped away, taken from where it sits.
 *
 * Always outwards, and usually two ways: a toast in the bottom right leaves to the right or
 * downwards, whichever the hand happens to go. A centred one has only the one way out,
 * since either side would be across the screen rather than off it.
 */
export const swipeDirectionsFor = (position: ToastPosition): SwipeDirections => ({
  x: position.endsWith("-left") ? -1 : position.endsWith("-right") ? 1 : 0,
  y: position.startsWith("top") ? -1 : 1
});

/** How far a drag has to go before letting go throws the toast away, however slowly. */
export const SWIPE_THRESHOLD = 60;

/** How fast a shorter drag has to be instead, in pixels per millisecond. */
export const SWIPE_VELOCITY = 0.35;

/** How far even a fast one has to go, so a twitch is not read as a flick. */
export const SWIPE_MIN_FLICK = 24;

/** How far one way beats the other before the drag settles on an axis. */
export const AXIS_LOCK = 8;

/**
 * Which way a drag is going, once it has gone far enough to tell.
 *
 * Settled on early and held for the rest of the drag: read afresh each move, a toast
 * dragged diagonally would jitter between the two as the hand wavered.
 */
export const axisOf = (dx: number, dy: number, allowed: SwipeDirections): "x" | "y" | null => {
  const alongX = allowed.x ? dx * allowed.x : 0;
  const alongY = allowed.y ? dy * allowed.y : 0;

  if (Math.max(alongX, alongY) < AXIS_LOCK) return null;

  return alongX >= alongY ? "x" : "y";
};

/**
 * Whether letting go here should be rid of the toast.
 *
 * A long drag counts however slow it was, and a shorter one counts if it was quick, so
 * neither has to be done carefully. The quick one still has a distance to clear: speed on
 * its own would let a two pixel twitch through, since a small move in a few milliseconds
 * is arithmetically a very fast one.
 */
export const shouldDismiss = (offset: number, elapsed: number): boolean => {
  if (offset >= SWIPE_THRESHOLD) return true;
  if (offset < SWIPE_MIN_FLICK || elapsed <= 0) return false;

  return offset / elapsed >= SWIPE_VELOCITY;
};
