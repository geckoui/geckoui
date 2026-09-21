import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useRef, useState } from "react";

import { useClickOutside } from "../../hooks";
import { classNames } from "../../utils/classNames";
import { ColorPicker, parseColor } from "../ColorPicker";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { ColorInputProps } from "./ColorInput.types";

/**
 * A field showing the colour you picked, opening the picker in a popover.
 *
 * `ColorPicker` is the panel on its own, the way `Calendar` is to `DateInput`. Reach for
 * that one when the panel lives somewhere of its own.
 *
 * @example
 * ```tsx
 * const [brand, setBrand] = useState("#3b82f6");
 *
 * <ColorInput value={brand} onChange={setBrand} />
 * ```
 *
 * @example
 * ```tsx
 * <ColorInput
 *   alpha
 *   format="rgb"
 *   swatches={["#ef4444", "#3b82f6"]}
 *   value={brand}
 *   onChange={setBrand}
 *   onChangeComplete={save}
 * />
 * ```
 */
const ColorInput = ({
  value,
  defaultValue = "#000000",
  onChange,
  onChangeComplete,
  onOpenChange,
  placeholder = "Pick a colour",
  render,
  disabled = false,
  readOnly = false,
  hasError = false,
  pickerPlacement = "bottom-start",
  floatingStrategy = "absolute",
  className,
  wrapperClassName,
  pickerClassName,
  ...picker
}: ColorInputProps) => {
  const fieldRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const floating = useFloating({
    placement: pickerPlacement,
    strategy: floatingStrategy,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen
  });

  const toggle = (next: boolean) => {
    if (next === open) return;

    setOpen(next);
    onOpenChange?.(next);
  };

  useClickOutside(() => toggle(false), [panelRef, fieldRef]);

  const color = value ?? internal;
  const parsed = parseColor(color);

  const handleChange = (next: string) => {
    if (value === undefined) setInternal(next);

    onChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      toggle(false);
      fieldRef.current?.focus();
    }
  };

  const state = disabled ? "disabled" : readOnly ? "readonly" : "enabled";

  /*
   * The string as it stands, not reformatted. The panel's own format dropdown decides what
   * comes out of it, and rewriting the label here would undo that on every switch.
   */
  const label = parsed ? color : null;

  return (
    <div
      className={classNames("GeckoUIColorInputWrapper", wrapperClassName)}
      data-custom={render ? "" : undefined}>
      <button
        type="button"
        ref={(node) => {
          fieldRef.current = node;
          floating.refs.setReference(node);
        }}
        className={classNames("GeckoUIColorInput", className)}
        data-custom={render ? "" : undefined}
        data-state={state}
        data-error={hasError || undefined}
        data-open={open || undefined}
        disabled={disabled}
        aria-haspopup={readOnly ? undefined : "dialog"}
        aria-expanded={readOnly ? undefined : open}
        onClick={() => !disabled && !readOnly && toggle(!open)}
        onKeyDown={handleKeyDown}>
        {render ? (
          render({ color: parsed ? color : "", open })
        ) : (
          <>
            {/* One element, two background layers: see the note in ColorPicker.scss */}
            <span
              className="GeckoUIColorInput__swatch"
              style={{ "--gecko-color-layer": parsed ? color : "transparent" } as CSSProperties}
            />

            {label ? (
              <span className="GeckoUIColorInput__value">{label}</span>
            ) : (
              <span className="GeckoUIColorInput__placeholder">
                <DynamicComponentRenderer component={placeholder} />
              </span>
            )}

            <span className="GeckoUIColorInput__caret" aria-hidden="true" />
          </>
        )}
      </button>

      {open && (
        <div
          ref={(node) => {
            panelRef.current = node;
            floating.refs.setFloating(node);
          }}
          role="dialog"
          aria-label="Colour picker"
          className={classNames("GeckoUIColorInput__panel", pickerClassName)}
          style={floating.floatingStyles}>
          <ColorPicker
            {...picker}
            value={color}
            onChange={handleChange}
            onChangeComplete={onChangeComplete}
          />
        </div>
      )}
    </div>
  );
};

ColorInput.displayName = "ColorInput";

export default ColorInput;
