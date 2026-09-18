import type { HTMLAttributes, ReactNode } from "react";

/** Extensible size map - To allow module augmentation */
export interface ProgressSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

/** Extensible color map - To allow module augmentation */
export interface ProgressColorMap {
  default: unknown;
  primary: unknown;
  success: unknown;
  error: unknown;
  warning: unknown;
  info: unknown;
}

export interface ProgressLabel {
  /** How far along, 0 to 100, rounded to whole numbers. */
  percent: number;

  /** The value as given, clamped into range. */
  value: number;

  /** What `value` is measured against. */
  max: number;
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * How far along. Leave it out when you do not know, and the bar runs on its own until
   * you do.
   * */
  value?: number;

  /**
   * What `value` is measured against, so `value` reads as a percentage unless you say
   * otherwise.(Default: 100)
   * */
  max?: number;

  /**
   * What the bar means. Drives the accent colour.(Default: 'primary')
   * */
  color?: keyof ProgressColorMap;

  /**
   * Bar thickness.(Default: 'md')
   * */
  size?: keyof ProgressSizeMap;

  /**
   * Text above the bar. A function is called with how far along it is, and only when there
   * is a value to report; a plain node shows either way.
   * */
  label?: ReactNode | ((progress: ProgressLabel) => ReactNode);
}
