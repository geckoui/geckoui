import type { ReactNode } from "react";

/** Extensible size map - To allow module augmentation */
export interface SliderSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

/** Extensible color map - To allow module augmentation */
export interface SliderColorMap {
  default: unknown;
  primary: unknown;
  success: unknown;
  error: unknown;
  warning: unknown;
  info: unknown;
}

export interface SliderMark {
  /** Where on the track it sits. Outside `min` and `max` it is dropped. */
  value: number;

  /** What it says. Leave it out for a tick with no text. */
  label?: ReactNode;
}

/** What the bubble is told about the thumb it belongs to. */
export interface SliderLabel {
  value: number;

  /** 0 for the only thumb, and for the lower of a range. */
  index: number;
}

/** Everything a thumb knows about itself, for drawing one yourself. */
export interface SliderThumb extends SliderLabel {
  /** How far along the track it sits, 0 to 100. */
  percent: number;

  /** Whether it is being dragged right now. */
  dragging: boolean;

  /** Whether the keyboard is on it. */
  focused: boolean;
}

interface SliderSharedProps {
  /** Bottom of the range.(Default: 0) */
  min?: number;

  /** Top of the range.(Default: 100) */
  max?: number;

  /** How far one move goes.(Default: 1) */
  step?: number;

  /** Ticks along the track, with a label each if you want one. */
  marks?: SliderMark[];

  /**
   * A bubble above the thumb while it is being dragged or has the focus. A function is
   * given the value it belongs to.
   * */
  label?: ReactNode | ((thumb: SliderLabel) => ReactNode);

  /** What the filled part means. Drives the accent colour.(Default: 'primary') */
  color?: keyof SliderColorMap;

  /** Track and thumb size.(Default: 'md') */
  size?: keyof SliderSizeMap;

  /**
   * Draw the thumb yourself. Everything it knows is handed over and nothing of its own is
   * rendered, so a labelled handle or a grip needs no working around the component.
   *
   * It is still placed on the track, still takes the drag and the keyboard, and still
   * carries its own `role` and `aria` — only what it looks like is yours.
   *
   * @example
   * ```tsx
   * renderThumb={({ value, dragging }) => (
   *   <span className={dragging ? "handle handle--held" : "handle"}>{value}</span>
   * )}
   * ```
   * */
  renderThumb?: (thumb: SliderThumb) => ReactNode;

  disabled?: boolean;
  className?: string;
}

export interface SliderProps extends SliderSharedProps {
  /** Where the thumb sits. */
  value: number;

  /** Called on every move, so the slider stays controlled as it is dragged. */
  onChange: (value: number) => void;

  /**
   * Called once, when the drag or key press finishes. Put the expensive work here rather
   * than in `onChange`, which fires all the way through a drag.
   * */
  onChangeEnd?: (value: number) => void;

  /** Names the thumb for a screen reader. */
  "aria-label"?: string;
}

export interface RangeSliderProps extends SliderSharedProps {
  /** Where the two thumbs sit, lower first. */
  value: [number, number];

  /** Called on every move, so the slider stays controlled as it is dragged. */
  onChange: (value: [number, number]) => void;

  /** Called once, when the drag or key press finishes. */
  onChangeEnd?: (value: [number, number]) => void;

  /**
   * How close the two thumbs may get. They stop rather than swap, so the lower one stays
   * the lower one.(Default: 0)
   * */
  minGap?: number;

  /** Names each thumb for a screen reader.(Default: ['Minimum', 'Maximum']) */
  thumbLabels?: [string, string];
}
