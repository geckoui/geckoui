import type { RangeSliderProps, SliderProps } from "../../Slider";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFSliderProps extends RHFBaseProps, Omit<SliderProps, "value" | "onChange"> {
  /** Where the thumb starts when the form has nothing for it.(Default: `min`) */
  defaultValue?: number;

  /** Called alongside the form update, on every move. */
  onChange?: (value: number) => void;
}

export interface RHFRangeSliderProps
  extends RHFBaseProps,
    Omit<RangeSliderProps, "value" | "onChange"> {
  /** Where the thumbs start when the form has nothing for them.(Default: `[min, max]`) */
  defaultValue?: [number, number];

  /** Called alongside the form update, on every move. */
  onChange?: (value: [number, number]) => void;
}
