import { createContext, useContext } from "react";

import type { StepStatus } from "./Stepper.types";

export interface StepperContextValue {
  /** Where a step stands, and whether it can be picked. */
  statusOf: (value: string) => StepStatus;
  isReachable: (value: string) => boolean;
  select: (value: string) => void;

  /** Which number a step shows, counting from one. */
  indexOf: (value: string) => number;

  /** Whether the stepper is something to use rather than only to read. */
  interactive: boolean;
}

export const StepperContext = createContext<StepperContextValue | null>(null);

export const useStepper = (): StepperContextValue => {
  const context = useContext(StepperContext);

  if (!context) throw new Error("Step has to be used inside a <Stepper>.");

  return context;
};
