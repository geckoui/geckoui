import type { HTMLAttributes, ReactNode } from "react";

/** Extensible size map - To allow module augmentation */
export interface RatingSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

/** Extensible color map - To allow module augmentation */
export interface RatingColorMap {
  gold: unknown;
  default: unknown;
  primary: unknown;
  success: unknown;
  error: unknown;
  warning: unknown;
  info: unknown;
}

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * How many are filled. Any fraction is drawn exactly, whether it can be picked or not, so
   * an average of 4.3 reads as 4.3.
   * */
  value: number;

  /** Called with the new rating, or `0` when the current one is picked again. */
  onChange?: (value: number) => void;

  /** How many icons there are.(Default: 5) */
  max?: number;

  /**
   * What a click lands on, as a fraction of one icon: `1` for whole ones, `0.5` for halves.
   * Only what can be picked, never what is drawn.(Default: 1)
   * */
  precision?: number;

  /**
   * Whether picking the current rating again sets it back to zero. Without it there is no
   * way to undo a mis-click with a mouse.(Default: true)
   * */
  clearable?: boolean;

  /** Shown rather than picked. Any fraction is drawn exactly. */
  readOnly?: boolean;

  disabled?: boolean;

  /** The icon. A star when it is left out. */
  icon?: ReactNode;

  /** A different icon for the empty part. Falls back to `icon`. */
  emptyIcon?: ReactNode;

  /**
   * What each one is called, for a screen reader.(Default: '1 of 5' and so on)
   * */
  getLabel?: (value: number) => string;

  /** What the whole thing is called. */
  "aria-label"?: string;

  /** Ties the radios together. One is made from `name` or generated when left out. */
  name?: string;

  /** What colour the filled part is.(Default: 'gold') */
  color?: keyof RatingColorMap;
  size?: keyof RatingSizeMap;
  className?: string;
}
