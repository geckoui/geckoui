import type { FC } from "react";

import type { RangeSliderProps } from "../Slider.types";
import SliderBase from "../SliderBase/SliderBase";

/**
 * Pick a span by dragging either end.
 *
 * The thumbs stop at each other rather than swapping, so the lower one stays the lower one
 * and `value` is always in order.
 *
 * @example
 * ```tsx
 * <RangeSlider value={price} onChange={setPrice} />
 * <RangeSlider value={price} onChange={setPrice} minGap={10} onChangeEnd={search} />
 * <RangeSlider value={price} onChange={setPrice} label={({ value }) => `£${value}`} />
 * ```
 */
const RangeSlider: FC<RangeSliderProps> = ({
  value,
  onChange,
  onChangeEnd,
  minGap = 0,
  min = 0,
  max = 100,
  step = 1,
  color = "primary",
  size = "md",
  disabled = false,
  thumbLabels = ["Minimum", "Maximum"],
  ...rest
}) => (
  <SliderBase
    values={value}
    onValuesChange={([low, high]) => onChange([low, high])}
    onCommit={([low, high]) => onChangeEnd?.([low, high])}
    minGap={minGap}
    thumbLabels={thumbLabels}
    min={min}
    max={max}
    step={step}
    color={color}
    size={size}
    disabled={disabled}
    {...rest}
  />
);

RangeSlider.displayName = "RangeSlider";

export default RangeSlider;
