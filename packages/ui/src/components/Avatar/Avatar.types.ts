import type { FC, HTMLAttributes, ReactNode } from "react";

/** Extensible size map - To allow module augmentation */
export interface AvatarSizeMap {
  xs: unknown;
  sm: unknown;
  md: unknown;
  lg: unknown;
  xl: unknown;
}

/** Extensible shape map - To allow module augmentation */
export interface AvatarShapeMap {
  circle: unknown;
  rounded: unknown;
  square: unknown;
}

/** Extensible color map - To allow module augmentation */
export interface AvatarColorMap {
  default: unknown;
  primary: unknown;
  success: unknown;
  error: unknown;
  warning: unknown;
  info: unknown;
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Image to show. When it is missing or fails to load, the fallback is shown instead.
   * */
  src?: string;

  /**
   * Alternative text for the image. Falls back to `name`.
   * */
  alt?: string;

  /**
   * Who this is. Its initials are drawn when there is no image, and it labels the avatar
   * for a screen reader.
   * */
  name?: string;

  /**
   * What to draw instead of the initials when there is no image.
   * */
  fallback?: ReactNode | FC;

  /**
   * Avatar size. Taken from the surrounding `AvatarGroup` when it is not set
   * here.(Default: 'md')
   * */
  size?: keyof AvatarSizeMap;

  /**
   * Corner treatment. Taken from the surrounding `AvatarGroup` when it is not set
   * here.(Default: 'circle')
   * */
  shape?: keyof AvatarShapeMap;

  /**
   * Accent behind the fallback.(Default: 'default')
   * */
  color?: keyof AvatarColorMap;
}

export interface AvatarGroupOverflow {
  /**
   * The avatars past `max`, as the props they were given, in the order they were given.
   * Read whatever you need off them — `name`, `src`, your own extras — and render it
   * however you like. `avatars.length` is the number behind the count.
   * */
  avatars: AvatarProps[];
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * How many avatars to show before the rest are counted. Leave it out to show them all.
   * */
  max?: number;

  /**
   * Size for every avatar in the group, and for the overflow count.(Default: 'md')
   * */
  size?: keyof AvatarSizeMap;

  /**
   * Corner treatment for every avatar in the group.(Default: 'circle')
   * */
  shape?: keyof AvatarShapeMap;

  /**
   * Lift each avatar on hover, naming it in an overlay, and open the overflow list from
   * the count. Only avatars with a `name` are named.(Default: true)
   * */
  interactive?: boolean;

  /**
   * What fills the overlay behind the `+2` count, which opens on hover. Leave it out for
   * the list of names. The overlay itself is not yours to place — only what is inside it.
   * */
  renderOverflow?: (overflow: AvatarGroupOverflow) => ReactNode;

  /**
   * The avatars.
   * */
  children?: ReactNode;
}
