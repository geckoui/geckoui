import { Children, type ReactNode, isValidElement } from "react";

import type { StepProps, StepStatus } from "./Stepper.types";

/** The values of the steps declared as children, in order. */
export const stepValuesFrom = (children: ReactNode): string[] =>
  Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<StepProps> =>
        isValidElement(child) && (child.type as { displayName?: string })?.displayName === "Step"
    )
    .map((child) => child.props.value);

/**
 * Where a step stands, from where it sits against the one you are on.
 *
 * A step that names its own status keeps it, which is how one already passed can still
 * show an error rather than a tick.
 */
export const statusAt = (index: number, currentIndex: number): StepStatus => {
  if (currentIndex < 0) return "upcoming";
  if (index < currentIndex) return "complete";

  return index === currentIndex ? "current" : "upcoming";
};

/**
 * Whether a step can be picked.
 *
 * In order, only what is behind you: skipping ahead in a wizard usually means arriving
 * somewhere that depends on an answer you have not given yet. Going back is nearly always
 * fine, so it is allowed.
 */
export const isReachableAt = (index: number, currentIndex: number, linear: boolean): boolean =>
  linear ? index <= currentIndex : true;
