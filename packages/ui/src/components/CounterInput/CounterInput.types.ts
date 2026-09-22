import type { InputHTMLAttributes } from "react";

export interface CounterInputSizeMap {
  sm: unknown;
  md: unknown;
  lg: unknown;
}

export interface CounterInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  /**
   * Current value, held as a string so a half-typed value like "2." is not
   * collapsed to "2" while the user is still typing. Convert with `Number(value)`
   * when you need a number.
   * */
  value: string;

  /** Callback when the value changes. Receives the sanitised string. */
  onChange: (value: string) => void;

  /** Minimum allowed value */
  min?: number;

  /** Maximum allowed value */
  max?: number;

  /** Increment/decrement step (default: 1) */
  step?: number;

  /** Size variant (default: 'md') */
  size?: keyof CounterInputSizeMap;

  /** Disable the entire component */
  disabled?: boolean;

  /** Read-only mode - buttons and input are non-interactive */
  readOnly?: boolean;

  /** Allow typing in input field (default: false) */
  allowTyping?: boolean;

  /** Class name for the input element */
  inputClassName?: string;

  /** Class name for the buttons */
  buttonClassName?: string;

  /**
   * Drop leading zeros and normalise the whole part (default: true)
   * */
  strict?: boolean;

  /** Reject a leading minus sign (default: false) */
  positiveOnly?: boolean;

  /** Digits kept after the decimal point. `0` makes the field integer only. */
  maxFractionDigits?: number;

  /** Digits kept before the decimal point */
  maxWholeDigitPlaces?: number;
}
