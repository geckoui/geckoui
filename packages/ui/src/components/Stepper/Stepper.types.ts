import type { HTMLAttributes, ReactNode } from "react";

/** Extensible size map - To allow module augmentation */
export interface StepperSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

/** Extensible orientation map - To allow module augmentation */
export interface StepperOrientationMap {
  horizontal: unknown;
  vertical: unknown;
}

/**
 * Where a step stands. Worked out from where it sits unless the step says otherwise.
 */
export type StepStatus = "complete" | "current" | "upcoming" | "error";

export interface StepperProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Which step you are on, by its `value`. */
  value: string;

  /**
   * Called when a step is picked. Leaving it out makes the stepper something to read
   * rather than something to use.
   * */
  onChange?: (value: string) => void;

  /** The steps, in order. */
  children?: ReactNode;

  /**
   * Whether the steps have to be taken in order. While true only the ones already done can
   * be gone back to; turn it off when any step is reachable.(Default: true)
   * */
  linear?: boolean;

  /** Which way the steps run.(Default: 'horizontal') */
  orientation?: keyof StepperOrientationMap;

  size?: keyof StepperSizeMap;
  className?: string;

  /** What the whole thing is called.(Default: 'Progress') */
  "aria-label"?: string;
}

export interface StepProps extends Omit<HTMLAttributes<HTMLButtonElement>, "children"> {
  /** What `value` and `onChange` deal in. */
  value: string;

  /** The step's name. */
  children?: ReactNode;

  /** A second line under the name. */
  description?: ReactNode;

  /**
   * Where this step stands. Worked out from where it sits against the current one unless
   * it is given, which is how a step already passed can still show an error.
   * */
  status?: StepStatus;

  /** What goes in the marker. The number, or a tick once it is done. */
  icon?: ReactNode;

  /** Cannot be picked, whatever else is true. */
  disabled?: boolean;
}
