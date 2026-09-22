import type { RatingProps } from "../../Rating";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFRatingProps
  extends RHFBaseProps,
    Omit<RatingProps, "value" | "onChange" | "name"> {
  /** Where it starts when the form has nothing for it.(Default: 0) */
  defaultValue?: number;

  /** Called alongside the form update. */
  onChange?: (value: number) => void;
}
