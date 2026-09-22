import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import type { Hsva } from "../ColorPicker.types";
import { clamp, pureHue } from "../ColorPicker.utils";

export interface SaturationAreaProps {
  hsva: Hsva;
  onChange: (next: { s: number; v: number }) => void;
  onCommit: () => void;
  disabled: boolean;
  label: string;
  children?: (dragging: boolean) => ReactNode;
}

/**
 * The square. Across is saturation, down is value, and the hue behind it comes from the
 * hue slider.
 */
const SaturationArea = ({
  hsva,
  onChange,
  onCommit,
  disabled,
  label,
  children
}: SaturationAreaProps) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const moveTo = (event: PointerEvent<HTMLDivElement>) => {
    const area = areaRef.current?.getBoundingClientRect();

    if (!area?.width || !area.height) return;

    onChange({
      s: clamp(((event.clientX - area.left) / area.width) * 100, 0, 100),
      // Down is less value, so the bright corner is at the top where every picker puts it
      v: clamp(100 - ((event.clientY - area.top) / area.height) * 100, 0, 100)
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;

    // Captured on the square, so the drag carries on past its edge rather than stopping
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

    const step = event.shiftKey ? 10 : 1;

    const next = {
      ArrowRight: { s: hsva.s + step, v: hsva.v },
      ArrowLeft: { s: hsva.s - step, v: hsva.v },
      ArrowUp: { s: hsva.s, v: hsva.v + step },
      ArrowDown: { s: hsva.s, v: hsva.v - step },
      Home: { s: 0, v: hsva.v },
      End: { s: 100, v: hsva.v }
    }[event.key];

    if (!next) return;

    event.preventDefault();
    onChange({ s: clamp(next.s, 0, 100), v: clamp(next.v, 0, 100) });
    onCommit();
  };

  return (
    <div
      ref={areaRef}
      className="GeckoUIColorPicker__saturation"
      // backgroundColor, not background: the shorthand would wipe the gradients in the CSS
      style={{ backgroundColor: pureHue(hsva.h) }}
      data-dragging={dragging || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={(event) => dragging && moveTo(event)}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}>
      <div
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsva.s)}
        aria-valuetext={`saturation ${Math.round(hsva.s)}%, brightness ${Math.round(hsva.v)}%`}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        className="GeckoUIColorPicker__saturation__thumb"
        data-custom={children ? "" : undefined}
        style={{ left: `${hsva.s}%`, top: `${100 - hsva.v}%` }}
        onKeyDown={handleKeyDown}>
        {children?.(dragging)}
      </div>
    </div>
  );
};

SaturationArea.displayName = "SaturationArea";

export default SaturationArea;
