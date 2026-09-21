import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import { clamp } from "../ColorPicker.utils";

export interface ColorSliderProps {
  /** What it is sliding through, from `min` to `max`. */
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onCommit: () => void;
  disabled: boolean;
  label: string;
  /** Tells the CSS which gradient to paint: `hue` or `alpha`. */
  kind: "hue" | "alpha";
  /** The gradient for an alpha track, which depends on the colour it is fading out. */
  trackStyle?: string;
  valueText?: string;
  children?: (dragging: boolean) => ReactNode;
}

/**
 * The hue and alpha tracks. One piece of drag and keyboard code, painted two ways.
 */
const ColorSlider = ({
  value,
  min,
  max,
  step,
  onChange,
  onCommit,
  disabled,
  label,
  kind,
  trackStyle,
  valueText,
  children
}: ColorSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const moveTo = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current?.getBoundingClientRect();

    if (!track?.width) return;

    const percent = clamp((event.clientX - track.left) / track.width, 0, 1);

    onChange(clamp(min + percent * (max - min), min, max));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    moveTo(event);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragging(false);
    onCommit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const jump = event.shiftKey ? step * 10 : step;

    const to = {
      ArrowRight: value + jump,
      ArrowUp: value + jump,
      ArrowLeft: value - jump,
      ArrowDown: value - jump,
      Home: min,
      End: max
    }[event.key];

    if (to === undefined) return;

    event.preventDefault();
    onChange(clamp(to, min, max));
    onCommit();
  };

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={trackRef}
      className="GeckoUIColorPicker__slider"
      data-kind={kind}
      data-dragging={dragging || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={(event) => dragging && moveTo(event)}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}>
      {/*
       * The gradient goes in as a custom property so the CSS can lay it over the
       * checkerboard on this one element. A second element underneath would show its own
       * edge through the rounded corners.
       */}
      <div
        className="GeckoUIColorPicker__slider__track"
        style={trackStyle ? ({ "--gecko-color-layer": trackStyle } as CSSProperties) : undefined}
      />

      <div
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(value * 100) / 100}
        aria-valuetext={valueText}
        aria-disabled={disabled || undefined}
        aria-orientation="horizontal"
        tabIndex={disabled ? -1 : 0}
        className="GeckoUIColorPicker__slider__thumb"
        data-custom={children ? "" : undefined}
        style={{ left: `${percent}%` }}
        onKeyDown={handleKeyDown}>
        {children?.(dragging)}
      </div>
    </div>
  );
};

ColorSlider.displayName = "ColorSlider";

export default ColorSlider;
