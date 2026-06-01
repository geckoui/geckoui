import type { RHFNumberInputProps } from "../RHFNumberInput";

interface Currency {
  symbol?: string;
  code?: string;
}

export interface RHFCurrencyInputProps extends Omit<RHFNumberInputProps, "strict"> {
  /**
   * The currency to display with the input.
   * The symbol and code are displayed as a prefix and suffix, respectively.
   * */
  currency?: Currency;
}
