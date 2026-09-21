import type { ColorInputProps } from "../../ColorInput";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFColorInputProps
  extends RHFBaseProps,
    Omit<ColorInputProps, "value" | "onChange"> {
  /** What the field shows when the form has nothing for it.(Default: "") */
  defaultValue?: string;

  /** Called alongside the form update. */
  onChange?: (color: string) => void;
}
