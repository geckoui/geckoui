import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import { classNames } from "../../../utils/classNames";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import type {
  SliderColorMap,
  SliderLabel,
  SliderMark,
  SliderSizeMap,
  SliderThumb
} from "../Slider.types";
import { clamp, nearestThumb, percentOf, snapToStep, valueAtPercent } from "../Slider.utils";

export interface SliderBaseProps {
  values: number[];
  onValuesChange: (values: number[]) => void;
  onCommit?: (values: number[]) => void;

  /** How close two thumbs may get. Ignored when there is only one. */
  minGap?: number;

  min: number;
  max: number;
  step: number;
  marks?: SliderMark[];
  label?: ReactNode | ((thumb: SliderLabel) => ReactNode);
  renderThumb?: (thumb: SliderThumb) => ReactNode;
  color: keyof SliderColorMap;
  size: keyof SliderSizeMap;
  disabled: boolean;
  className?: string;
  thumbLabels?: string[];
}

/**
 * The track, the thumbs and everything that moves them.
 *
 * Both `Slider` and `RangeSlider` are this with one or two values, so the drag, the
 * keyboard and the marks are written once.
 */
const SliderBase = ({
  values,
  onValuesChange,
  onCommit,
  minGap = 0,
  min,
  max,
  step,
  marks,
  label,
  renderThumb,
  color,
  size,
  disabled,
  className,
  thumbLabels
}: SliderBaseProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);

  /** Where a thumb may go, so the two in a range stop rather than swap. */
  const boundsFor = (index: number): [number, number] => [
    index === 0 ? min : values[index - 1] + minGap,
    index === values.length - 1 ? max : values[index + 1] - minGap
  ];

  const moveThumb = (index: number, to: number) => {
    const [floor, ceiling] = boundsFor(index);
    const next = clamp(snapToStep(to, min, step), Math.max(min, floor), Math.min(max, ceiling));

    if (next === values[index]) return values;

    const updated = values.map((value, at) => (at === index ? next : value));

    onValuesChange(updated);

    return updated;
  };

  const valueFromPointer = (event: PointerEvent<HTMLDivElement>): number => {
    const track = trackRef.current?.getBoundingClientRect();

    if (!track || !track.width) return min;

    const percent = clamp(((event.clientX - track.left) / track.width) * 100, 0, 100);

    return valueAtPercent(percent, min, max);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;

    const at = valueFromPointer(event);
    const index = nearestThumb(values, at);

    // Captured on the track, so the drag carries on past the edge of the slider and does
    // not stop because the pointer left the thumb it started on.
    event.currentTarget.setPointerCapture(event.pointerId);
    setActive(index);
    moveThumb(index, at);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (active === null) return;

    moveThumb(active, valueFromPointer(event));
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (active === null) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    setActive(null);
    onCommit?.(values);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;

    const span = max - min;
    const jump = event.shiftKey ? step * 10 : step;

    const to = {
      ArrowRight: values[index] + jump,
      ArrowUp: values[index] + jump,
      ArrowLeft: values[index] - jump,
      ArrowDown: values[index] - jump,
      PageUp: values[index] + span / 10,
      PageDown: values[index] - span / 10,
      Home: min,
      End: max
    }[event.key];

    if (to === undefined) return;

    event.preventDefault();

    const updated = moveThumb(index, to);

    onCommit?.(updated);
  };

  const filled: [number, number] =
    values.length > 1
      ? [percentOf(values[0], min, max), percentOf(values[values.length - 1], min, max)]
      : [0, percentOf(values[0], min, max)];

  const visibleMarks = (marks ?? []).filter((mark) => mark.value >= min && mark.value <= max);

  return (
    <div
      className={classNames("GeckoUISlider", className)}
      data-color={color}
      data-size={size}
      data-disabled={disabled || undefined}>
      <div
        ref={trackRef}
        className="GeckoUISlider__track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}>
        <div
          className="GeckoUISlider__fill"
          style={{ left: `${filled[0]}%`, width: `${filled[1] - filled[0]}%` }}
        />

        {visibleMarks.map((mark) => {
          const at = percentOf(mark.value, min, max);

          return (
            <span
              key={mark.value}
              className="GeckoUISlider__mark"
              data-filled={
                mark.value >= values[0] && mark.value <= values[values.length - 1] ? "" : undefined
              }
              style={{ left: `${at}%` }}
            />
          );
        })}

        {values.map((value, index) => {
          const showLabel = label !== undefined && (active === index || focused === index);
          const percent = percentOf(value, min, max);

          return (
            <div
              key={index}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-label={thumbLabels?.[index]}
              aria-valuemin={boundsFor(index)[0]}
              aria-valuemax={boundsFor(index)[1]}
              aria-valuenow={value}
              aria-disabled={disabled || undefined}
              aria-orientation="horizontal"
              data-dragging={active === index || undefined}
              className="GeckoUISlider__thumb"
              data-custom={renderThumb ? "" : undefined}
              style={{ left: `${percent}%` }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onFocus={() => setFocused(index)}
              onBlur={() => setFocused(null)}>
              {/*
               * Drawn inside the thumb rather than in place of it: the drag, the keyboard
               * and the aria all live on the element that is positioned, so handing over
               * what it looks like does not hand over how it works.
               */}
              {renderThumb?.({
                value,
                index,
                percent,
                dragging: active === index,
                focused: focused === index
              })}

              {showLabel && (
                <span className="GeckoUISlider__label">
                  {typeof label === "function" ? (
                    label({ value, index })
                  ) : (
                    <DynamicComponentRenderer component={label} />
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!!visibleMarks.length && visibleMarks.some((mark) => mark.label !== undefined) && (
        <div className="GeckoUISlider__mark-labels">
          {visibleMarks.map((mark) =>
            mark.label === undefined ? null : (
              <span
                key={mark.value}
                className="GeckoUISlider__mark-label"
                style={{ left: `${percentOf(mark.value, min, max)}%` }}>
                {mark.label}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

SliderBase.displayName = "SliderBase";

export default SliderBase;
