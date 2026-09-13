import { forwardRef } from "react";

import { classNames } from "../../utils/classNames";
import { formatNumericInput } from "../../utils/formatNumericInput";
import type { CounterInputProps } from "./CounterInput.types";

const countDecimals = (value: number) => (String(value).split(".")[1] ?? "").length;

/**
 * A numeric input component with increment/decrement buttons.
 *
 * The value is a string, not a number, so a half-typed value like "2." survives
 * until the field is left. Converting on every keystroke would collapse it to
 * "2" and delete the decimal point as the user types.
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState("0");
 * <CounterInput value={count} onChange={setCount} min={0} max={10} />
 *
 * // Read it back as a number when you need one
 * const quantity = Number(count || 0);
 * ```
 */
const CounterInput = forwardRef<HTMLInputElement, CounterInputProps>(
  (
    {
      value,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      size = "md",
      className,
      inputClassName,
      buttonClassName,
      disabled,
      readOnly,
      allowTyping = false,
      strict = true,
      positiveOnly = false,
      maxFractionDigits,
      maxWholeDigitPlaces,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const format = (raw: string) =>
      formatNumericInput(raw, { strict, positiveOnly, maxFractionDigits, maxWholeDigitPlaces });

    const clamp = (val: number) => Math.min(Math.max(val, min), max);

    const parsed = parseFloat(value);
    const numeric = Number.isNaN(parsed) ? null : parsed;

    const applyStep = (direction: 1 | -1) => {
      const base = numeric ?? 0;
      const precision = maxFractionDigits ?? Math.max(countDecimals(step), countDecimals(base));
      const next = Number(clamp(base + step * direction).toFixed(precision));

      onChange(format(String(next)));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(format(e.target.value));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);

      if (numeric === null) {
        if (value !== "") onChange("");
        return;
      }

      const clamped = clamp(numeric);
      const settled =
        maxFractionDigits === undefined ? clamped : Number(clamped.toFixed(maxFractionDigits));
      const normalised = format(String(settled));

      if (normalised !== value) onChange(normalised);
    };

    const isAtMin = numeric !== null && numeric <= min;
    const isAtMax = numeric !== null && numeric >= max;

    return (
      <div
        className={classNames("GeckoUICounterInput", className)}
        data-size={size}
        data-state={disabled ? "disabled" : readOnly ? "readonly" : undefined}>
        <button
          type="button"
          className={classNames("GeckoUICounterInput__button", buttonClassName)}
          data-action="decrement"
          onClick={() => applyStep(-1)}
          disabled={disabled || readOnly || isAtMin}
          aria-label="Decrement">
          <span className="GeckoUICounterInput__icon" data-icon="minus" />
        </button>

        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          className={classNames("GeckoUICounterInput__input", inputClassName)}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly || !allowTyping}
          {...rest}
          tabIndex={allowTyping ? 0 : -1}
        />

        <button
          type="button"
          className={classNames("GeckoUICounterInput__button", buttonClassName)}
          data-action="increment"
          onClick={() => applyStep(1)}
          disabled={disabled || readOnly || isAtMax}
          aria-label="Increment">
          <span className="GeckoUICounterInput__icon" data-icon="plus" />
        </button>
      </div>
    );
  }
);

CounterInput.displayName = "CounterInput";

export default CounterInput;
