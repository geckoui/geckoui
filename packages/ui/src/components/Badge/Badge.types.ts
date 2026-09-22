import type { FC, HTMLAttributes, ReactNode } from "react";

/** Extensible variant map - To allow module augmentation */
export interface BadgeVariantMap {
  filled: unknown;
  soft: unknown;
  outlined: unknown;
}

/** Extensible color map - To allow module augmentation */
export interface BadgeColorMap {
  default: unknown;
  primary: unknown;
  success: unknown;
  error: unknown;
  warning: unknown;
  info: unknown;
}

/** Extensible size map - To allow module augmentation */
export interface BadgeSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

/** Extensible shape map - To allow module augmentation */
export interface BadgeShapeMap {
  rounded: unknown;
  pill: unknown;
  square: unknown;
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * How the badge is filled.(Default: 'soft')
   * */
  variant?: keyof BadgeVariantMap;

  /**
   * What the badge means. Drives the accent colour.(Default: 'default')
   * */
  color?: keyof BadgeColorMap;

  /**
   * Badge size.(Default: 'md')
   * */
  size?: keyof BadgeSizeMap;

  /**
   * Corner treatment.(Default: 'rounded')
   * */
  shape?: keyof BadgeShapeMap;

  /**
   * Show a leading status dot. It inherits the badge colour and scales with `size`.
   * Ignored when `icon` is set.(Default: false)
   * */
  dot?: boolean;

  /**
   * Custom leading visual, rendered as given. Style it where you define it.
   * Takes precedence over `dot`.
   * */
  icon?: ReactNode | FC;
}
