import type { FC } from "react";

import { Slider } from "../../Slider";
import { RHFController } from "../RHFController";
import type { RHFSliderProps } from "./RHFSlider.types";

/**
 * React Hook Form wrapper for the Slider component.
 *
 * The field holds a number. `onChange` fires all the way through a drag, so put anything
 * expensive in `onChangeEnd`.
 *
 * @example
 * ```tsx
 * <RHFSlider name="volume" />
 * <RHFSlider name="volume" min={0} max={11} step={1} label={({ value }) => value} />
 * ```
 */
const RHFSlider: FC<RHFSliderProps> = ({
  name,
  control,
  rules,
  onChange,
  defaultValue,
  min = 0,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <Slider
          value={typeof field.value === "number" ? field.value : (defaultValue ?? min)}
          onChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          min={min}
          {...rest}
        />
      )}
    />
  );
};

RHFSlider.displayName = "RHFSlider";

export default RHFSlider;
