import { classNames } from "../../../utils/classNames";
import type { StepperProps } from "../Stepper.types";
import { isReachableAt, statusAt, stepValuesFrom } from "../Stepper.utils";
import { StepperContext } from "../useStepper";

/**
 * How far along a set of steps you are.
 *
 * It shows progress and takes you back through it; what each step holds is yours to render.
 * A wizard is usually one form with fields shown and hidden, rather than separate panels —
 * `Tabs` is the component for those.
 *
 * @example
 * ```tsx
 * <Stepper value={step} onChange={setStep}>
 *   <Step value="account">Account</Step>
 *   <Step value="payment" description="Card or bank">Payment</Step>
 *   <Step value="done">Confirm</Step>
 * </Stepper>
 * ```
 */
const Stepper = ({
  value,
  onChange,
  children,
  linear = true,
  orientation = "horizontal",
  size = "md",
  className,
  "aria-label": ariaLabel = "Progress",
  ...rest
}: StepperProps) => {
  const values = stepValuesFrom(children);
  const currentIndex = values.indexOf(value);
  const interactive = Boolean(onChange);

  return (
    <StepperContext.Provider
      value={{
        interactive,
        indexOf: (step) => values.indexOf(step) + 1,
        statusOf: (step) => statusAt(values.indexOf(step), currentIndex),
        isReachable: (step) =>
          interactive && isReachableAt(values.indexOf(step), currentIndex, linear),
        select: (step) => onChange?.(step)
      }}>
      <nav
        aria-label={ariaLabel}
        className={classNames("GeckoUIStepper", className)}
        data-orientation={orientation}
        data-size={size}
        {...rest}>
        <ol className="GeckoUIStepper__list">{children}</ol>
      </nav>
    </StepperContext.Provider>
  );
};

Stepper.displayName = "Stepper";

export default Stepper;
