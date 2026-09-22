import { classNames } from "../../../utils/classNames";
import type { StepProps } from "../Stepper.types";
import { useStepper } from "../useStepper";

const TickIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="m5 13 4 4L19 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * One step.
 *
 * Where it stands comes from where it sits against the current one, so a straight run of
 * steps needs nothing said. `status` overrides it, which is how a step already passed can
 * show an error rather than a tick.
 *
 * @example
 * ```tsx
 * <Step value="account">Account</Step>
 * <Step value="payment" description="Card or bank">Payment</Step>
 * <Step value="review" status="error">Review</Step>
 * ```
 */
const Step = ({
  value,
  children,
  description,
  status,
  icon,
  disabled = false,
  render,
  className,
  onClick,
  ...rest
}: StepProps) => {
  const { statusOf, isReachable, select, indexOf, interactive, separator } = useStepper();

  const state = status ?? statusOf(value);
  const reachable = !disabled && isReachable(value) && state !== "current";

  const pick = () => {
    if (reachable) select(value);
  };

  const joint = separator ? (
    <span className="GeckoUIStepper__separator" aria-hidden="true">
      {separator}
    </span>
  ) : (
    /* the run between one marker and the next, filled as far as you have got */
    <span className="GeckoUIStepper__line" aria-hidden="true" />
  );

  /*
   * Handed over whole. The list item and the joint stay, so it is still a list and still
   * joined up, but nothing else of the step's own is there to be worked around.
   */
  if (render) {
    return (
      <li className="GeckoUIStepper__step" data-status={state}>
        {render({
          value,
          index: indexOf(value),
          status: state,
          reachable,
          disabled,
          select: pick,
          children,
          description
        })}
        {joint}
      </li>
    );
  }

  const marker =
    icon ??
    (state === "complete" ? <TickIcon /> : state === "error" ? <ErrorIcon /> : indexOf(value));

  return (
    <li className="GeckoUIStepper__step" data-status={state}>
      <button
        type="button"
        // Read only until it is given something to do, so a plain indicator is not a row of
        // buttons a keyboard has to walk through
        disabled={!reachable}
        tabIndex={interactive && reachable ? 0 : -1}
        aria-current={state === "current" ? "step" : undefined}
        data-status={state}
        className={classNames("GeckoUIStepper__button", className)}
        onClick={(event) => {
          onClick?.(event);
          pick();
        }}
        {...rest}>
        <span className="GeckoUIStepper__marker" aria-hidden="true">
          {marker}
        </span>

        <span className="GeckoUIStepper__body">
          <span className="GeckoUIStepper__label">{children}</span>
          {description ? <span className="GeckoUIStepper__description">{description}</span> : null}
        </span>
      </button>

      {joint}
    </li>
  );
};

Step.displayName = "Step";

export default Step;
