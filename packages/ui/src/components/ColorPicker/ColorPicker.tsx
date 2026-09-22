import type { CSSProperties, ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { classNames } from "../../utils/classNames";
import type {
  ColorFormat,
  ColorPickerProps,
  ColorPickerRenderState,
  Hsva
} from "./ColorPicker.types";
import { cssColor, formatColor, parseColor, sameColor } from "./ColorPicker.utils";
import { ColorSlider } from "./ColorSlider";
import { FormatSelect } from "./FormatSelect";
import { SaturationArea } from "./SaturationArea";

const BLACK: Hsva = { h: 0, s: 0, v: 0, a: 1 };

const FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: "HEX",
  rgb: "RGB",
  hsl: "HSL"
};

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

/**
 * The colour picker panel: a saturation square, a hue slider, and whatever else you turn
 * on.
 *
 * It works in HSV internally, which is what the square is a plane of, and hands you back a
 * string in whichever `format` you asked for.
 *
 * `onChange` fires on every move so a preview can follow the drag. `onChangeComplete`
 * fires once the drag ends, which is where the expensive work belongs.
 *
 * @example
 * ```tsx
 * const [color, setColor] = useState("#3b82f6");
 *
 * <ColorPicker value={color} onChange={setColor} />
 * ```
 *
 * @example
 * With alpha, swatches and the eyedropper:
 *
 * ```tsx
 * <ColorPicker
 *   alpha
 *   eyeDropper
 *   format="rgb"
 *   swatches={["#ef4444", "#f59e0b", "#10b981", "#3b82f6"]}
 *   value={color}
 *   onChange={setColor}
 *   onChangeComplete={save}
 * />
 * ```
 */
const ColorPicker = ({
  value,
  defaultValue = "#000000",
  onChange,
  onChangeComplete,
  formats = ["hex", "rgb", "hsl"],
  onFormatChange,
  showInput = true,
  swatches,
  swatchesLabel = "Preset colours",
  eyeDropper = false,
  disabled = false,
  renderSaturation,
  renderHueThumb,
  renderAlphaThumb,
  footer,
  className,
  ...rest
}: ColorPickerProps) => {
  const [internal, setInternal] = useState<Hsva>(() => parseColor(value ?? defaultValue) ?? BLACK);
  const [typed, setTyped] = useState<string | null>(null);
  const [hasDropper, setHasDropper] = useState(false);

  /*
   * Which format is on show. Seeded from the prop and moved by the dropdown, so a caller
   * can set the starting format and still let someone switch it.
   */
  const preferred = formats[0] ?? "hex";
  const [active, setActive] = useState<ColorFormat>(preferred);

  useEffect(() => setActive(preferred), [preferred]);

  /*
   * The last string we handed out. A controlled `value` is compared against this rather
   * than against the parsed colour, so dragging through greys keeps the hue the pointer is
   * on: every grey parses back to hue 0, which would otherwise snap the hue slider home.
   */
  const emitted = useRef<string | null>(null);

  useEffect(() => {
    // Only where it exists, so the button is absent rather than dead
    setHasDropper(typeof window !== "undefined" && typeof window.EyeDropper === "function");
  }, []);

  useEffect(() => {
    if (value === undefined || value === emitted.current) return;

    const parsed = parseColor(value);

    if (parsed && !sameColor(parsed, internal)) setInternal(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = (next: Hsva, complete: boolean) => {
    // Alpha only goes into the string when there is some: a solid colour stays #3b82f6
    const color = formatColor(next, active, next.a < 1);

    emitted.current = color;
    setInternal(next);
    onChange?.(color);

    if (complete) onChangeComplete?.(color);
  };

  const commit = () => onChangeComplete?.(formatColor(internal, active, internal.a < 1));

  const current = formatColor(internal, active, internal.a < 1);

  const switchFormat = (next: ColorFormat) => {
    const color = formatColor(internal, next, internal.a < 1);

    emitted.current = color;
    setActive(next);
    setTyped(null);
    onFormatChange?.(next, color);
    onChange?.(color);
  };
  const state: ColorPickerRenderState = { color: current, hsva: internal, dragging: false };

  const pickSwatch = (swatch: string) => {
    const parsed = parseColor(swatch);

    if (!parsed || disabled) return;

    emit(parsed, true);
  };

  const handleTyped = (event: ChangeEvent<HTMLInputElement>) => setTyped(event.target.value);

  /** Takes what was typed if it means anything, and puts back what was there if not. */
  const commitTyped = () => {
    const parsed = typed === null ? null : parseColor(typed);

    if (parsed) emit(parsed, true);

    setTyped(null);
  };

  const handleTypedKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitTyped();
    }

    if (event.key === "Escape") setTyped(null);
  };

  const openDropper = async () => {
    if (disabled || !window.EyeDropper) return;

    try {
      const { sRGBHex } = await new window.EyeDropper().open();
      const parsed = parseColor(sRGBHex);

      // The eyedropper reads the screen, which is opaque, so the alpha on hand is kept
      if (parsed) emit({ ...parsed, a: internal.a }, true);
    } catch {
      // Dismissing the eyedropper rejects, which is a choice rather than a failure
    }
  };

  return (
    <div
      {...rest}
      className={classNames("GeckoUIColorPicker", className)}
      data-disabled={disabled || undefined}>
      <SaturationArea
        hsva={internal}
        disabled={disabled}
        label="Saturation and brightness"
        onChange={({ s, v }) => emit({ ...internal, s, v }, false)}
        onCommit={commit}>
        {renderSaturation ? (dragging) => renderSaturation({ ...state, dragging }) : undefined}
      </SaturationArea>

      <div className="GeckoUIColorPicker__controls">
        {/*
         * The colour and the checkerboard are two background layers on the one element,
         * not two stacked elements. Stacked, the lighter one underneath shows through the
         * anti-aliased edge as a ring.
         */}
        <div
          className="GeckoUIColorPicker__preview"
          style={{ "--gecko-color-layer": cssColor(internal) } as CSSProperties}
        />

        <div className="GeckoUIColorPicker__sliders">
          <ColorSlider
            kind="hue"
            value={internal.h}
            min={0}
            max={360}
            step={1}
            disabled={disabled}
            label="Hue"
            valueText={`${Math.round(internal.h)} degrees`}
            onChange={(h) => emit({ ...internal, h }, false)}
            onCommit={commit}>
            {renderHueThumb ? (dragging) => renderHueThumb({ ...state, dragging }) : undefined}
          </ColorSlider>

          <ColorSlider
            kind="alpha"
            value={internal.a}
            min={0}
            max={1}
            step={0.01}
            disabled={disabled}
            label="Opacity"
            valueText={`${Math.round(internal.a * 100)} percent`}
            /*
             * The colour as picked at full opacity, not the pure hue: with a dark or a
             * washed out colour the hue is nothing like what the slider is fading out.
             */
            trackStyle={`linear-gradient(to right, transparent, ${cssColor({
              ...internal,
              a: 1
            })})`}
            onChange={(a) => emit({ ...internal, a }, false)}
            onCommit={commit}>
            {renderAlphaThumb ? (dragging) => renderAlphaThumb({ ...state, dragging }) : undefined}
          </ColorSlider>
        </div>

        {eyeDropper && hasDropper && (
          <button
            type="button"
            className="GeckoUIColorPicker__dropper"
            aria-label="Pick a colour from the screen"
            disabled={disabled}
            onClick={openDropper}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m2 22 1-1h3l9-9M3 21v-3l9-9" />
              <path d="m15 6 3.3-3.3a2.4 2.4 0 0 1 3.4 3.4L18 9l.4.4a1 1 0 0 1 0 1.4l-1 1a1 1 0 0 1-1.4 0l-4.8-4.8a1 1 0 0 1 0-1.4l1-1a1 1 0 0 1 1.4 0Z" />
            </svg>
          </button>
        )}
      </div>

      {showInput && (
        <div className="GeckoUIColorPicker__field">
          {formats.length > 1 && (
            <FormatSelect
              value={active}
              options={formats}
              labels={FORMAT_LABELS}
              disabled={disabled}
              onChange={switchFormat}
            />
          )}

          <input
            type="text"
            className="GeckoUIColorPicker__input"
            aria-label="Colour value"
            spellCheck={false}
            disabled={disabled}
            value={typed ?? current}
            onChange={handleTyped}
            onBlur={commitTyped}
            onKeyDown={handleTypedKeyDown}
          />
        </div>
      )}

      {footer}

      {!!swatches?.length && (
        <div className="GeckoUIColorPicker__swatches" role="group" aria-label={swatchesLabel}>
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className="GeckoUIColorPicker__swatch"
              aria-label={swatch}
              aria-pressed={swatch.toLowerCase() === current.toLowerCase()}
              disabled={disabled}
              style={{ "--gecko-color-layer": swatch } as CSSProperties}
              onClick={() => pickSwatch(swatch)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

ColorPicker.displayName = "ColorPicker";

export default ColorPicker;
