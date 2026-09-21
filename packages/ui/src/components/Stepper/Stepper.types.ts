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

  /**
   * What goes between the steps. A line that fills as you go, unless you give something
   * else — an arrow, a dot, whatever suits.
   * */
  separator?: ReactNode;

  size?: keyof StepperSizeMap;
  className?: string;

  /** What the whole thing is called.(Default: 'Progress') */
  "aria-label"?: string;
}

/** Everything a step knows about itself, for drawing one yourself. */
export interface StepRenderArgs {
  value: string;

  /** Which number it is, counting from one. */
  index: number;

  status: StepStatus;

  /** Whether picking it would go anywhere. */
  reachable: boolean;

  disabled: boolean;

  /** Go to this step. Does nothing when it cannot be reached. */
  select: () => void;

  /** What was passed as the step's name and second line. */
  children: ReactNode;
  description: ReactNode;
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

  /**
   * Draw the step yourself. Everything it knows is handed over and nothing of its own is
   * rendered — no marker, no classes, no styles to work around.
   *
   * The list item and the joint to the next step stay, so it is still a list and still
   * joined up. Reach for this when the design is not a marker beside a label; the props
   * above are quicker when it is.
   *
   * @example
   * ```tsx
   * <Step
   *   value="dev"
   *   render={({ index, status, select }) => (
   *     <button onClick={select} data-current={status === "current"}>
   *       <span className="chip">{index}</span> Dev
   *     </button>
   *   )}
   * />
   * ```
   * */
  render?: (step: StepRenderArgs) => ReactNode;
}
