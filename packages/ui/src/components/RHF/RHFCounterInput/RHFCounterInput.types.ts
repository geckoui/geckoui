import type { CounterInputProps } from "../../CounterInput";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFCounterInputProps
  extends RHFBaseProps,
    Omit<CounterInputProps, "name" | "value" | "onChange"> {
  onChange?: (value: string) => void;
}
