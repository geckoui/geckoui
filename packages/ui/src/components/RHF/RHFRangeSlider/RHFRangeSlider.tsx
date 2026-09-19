import type { FC } from "react";

import { RangeSlider } from "../../Slider";
import { RHFController } from "../RHFController";
import type { RHFRangeSliderProps } from "../RHFSlider/RHFSlider.types";

/**
 * React Hook Form wrapper for the RangeSlider component.
 *
 * The field holds a `[low, high]` pair, always in order.
 *
 * @example
 * ```tsx
 * <RHFRangeSlider name="price" min={0} max={500} step={10} minGap={50} />
 * ```
 */
const RHFRangeSlider: FC<RHFRangeSliderProps> = ({
  name,
  control,
  rules,
  onChange,
  defaultValue,
  min = 0,
  max = 100,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <RangeSlider
          value={
            Array.isArray(field.value) && field.value.length === 2
              ? (field.value as [number, number])
              : (defaultValue ?? [min, max])
          }
          onChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          min={min}
          max={max}
          {...rest}
        />
      )}
    />
  );
};

RHFRangeSlider.displayName = "RHFRangeSlider";

export default RHFRangeSlider;
