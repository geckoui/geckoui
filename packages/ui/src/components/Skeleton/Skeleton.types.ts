import type { HTMLAttributes, ReactNode } from "react";

/** Extensible shape map - To allow module augmentation */
export interface SkeletonShapeMap {
  text: unknown;
  rounded: unknown;
  circle: unknown;
}

/** Extensible animation map - To allow module augmentation */
export interface SkeletonAnimationMap {
  pulse: unknown;
  wave: unknown;
  none: unknown;
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The outline of the placeholder.(Default: 'text')
   * */
  shape?: keyof SkeletonShapeMap;

  /**
   * How it animates while it waits. Dropped under `prefers-reduced-motion`.(Default: 'pulse')
   * */
  animation?: keyof SkeletonAnimationMap;

  /**
   * How many stacked lines to draw, for a paragraph placeholder. The last line is drawn
   * short so the block reads as text. Only applies to the `text` shape.(Default: 1)
   * */
  lines?: number;

  /**
   * While true the placeholder is drawn. Turn it off and `children` render in its
   * place.(Default: true)
   * */
  loading?: boolean;

  /**
   * What replaces the placeholder once `loading` is false. Never rendered while loading,
   * so it is safe to read data that has not arrived yet.
   * */
  children?: ReactNode;
}
