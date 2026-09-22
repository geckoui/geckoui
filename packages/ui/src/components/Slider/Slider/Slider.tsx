import type { FC } from "react";

import type { SliderProps } from "../Slider.types";
import SliderBase from "../SliderBase/SliderBase";

/**
 * Pick a number by dragging.
 *
 * `onChange` fires all the way through a drag so the slider stays controlled; put anything
 * expensive in `onChangeEnd`, which fires once when it is let go.
 *
 * @example
 * ```tsx
 * <Slider value={volume} onChange={setVolume} />
 * <Slider value={volume} onChange={setVolume} onChangeEnd={save} step={5} />
 * <Slider value={volume} onChange={setVolume} label={({ value }) => `${value}%`} />
 * <Slider
 *   value={volume}
 *   onChange={setVolume}
 *   marks={[{ value: 0, label: "Off" }, { value: 100, label: "Max" }]}
 * />
 * ```
 */
const Slider: FC<SliderProps> = ({
  value,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  color = "primary",
  size = "md",
  disabled = false,
  "aria-label": ariaLabel,
  ...rest
}) => (
  <SliderBase
    values={[value]}
    onValuesChange={([next]) => onChange(next)}
    onCommit={([next]) => onChangeEnd?.(next)}
    thumbLabels={ariaLabel ? [ariaLabel] : undefined}
    min={min}
    max={max}
    step={step}
    color={color}
    size={size}
    disabled={disabled}
    {...rest}
  />
);

Slider.displayName = "Slider";

export default Slider;
