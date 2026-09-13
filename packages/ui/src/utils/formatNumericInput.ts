export interface FormatNumericInputOptions {
  /**
   * Drop leading zeros and normalise the whole part.
   * Turn it off for values like room numbers where "007" is meaningful.
   * */
  strict?: boolean;

  /** Reject a leading minus sign */
  positiveOnly?: boolean;

  /** Digits kept after the decimal point. `0` removes the decimal point entirely. */
  maxFractionDigits?: number;

  /** Digits kept before the decimal point */
  maxWholeDigitPlaces?: number;
}

/**
 * Sanitises a partially typed number without converting it to a `number`.
 *
 * Keeping the value a string is what lets someone type "2." on the way to "2.5":
 * a round trip through `parseFloat` would collapse it to "2" and eat the decimal
 * point as they type.
 *
 * @example
 * ```ts
 * formatNumericInput("2.");      // "2."
 * formatNumericInput("007");     // "7"
 * formatNumericInput("007", { strict: false });          // "007"
 * formatNumericInput("1.239", { maxFractionDigits: 2 }); // "1.23"
 * ```
 * */
export const formatNumericInput = (
  value: string,
  {
    strict = true,
    positiveOnly = false,
    maxFractionDigits,
    maxWholeDigitPlaces
  }: FormatNumericInputOptions = {}
): string => {
  const formattedValue = value
    .replace(/[^0-9.]/g, "")
    .split(".")
    .slice(0, maxFractionDigits === 0 ? 1 : 2)
    .map((part: string, index: number) => {
      if (index === 0) {
        const wholeDigit = part.slice(0, maxWholeDigitPlaces);

        if (wholeDigit === "") return "";

        if (strict) {
          return Number(wholeDigit).toString();
        }

        return wholeDigit;
      }

      return part.slice(0, maxFractionDigits);
    })
    .join(".");

  if (value.startsWith("-") && !positiveOnly) {
    return `-${formattedValue}`;
  }

  return formattedValue;
};
