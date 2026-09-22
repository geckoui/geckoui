import type { HTMLAttributes, ReactNode } from "react";

export interface Hsva {
  /** 0 to 360 */
  h: number;
  /** 0 to 100 */
  s: number;
  /** 0 to 100 */
  v: number;
  /** 0 to 1 */
  a: number;
}

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type ColorFormat = "hex" | "rgb" | "hsl";

export interface ColorPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "color"> {
  /** The colour, as a string. Leave it out to let the picker hold its own. */
  value?: string;

  /** What it starts on when uncontrolled. @default "#000000" */
  defaultValue?: string;

  /** Called on every move while dragging. */
  onChange?: (color: string) => void;

  /**
   * Called once the drag ends, the text is committed or a swatch is picked.
   *
   * Use it for the expensive thing — a save, a canvas redraw — and `onChange` for the
   * live preview.
   */
  onChangeComplete?: (color: string) => void;

  /**
   * Which formats the dropdown beside the text field offers, and in what order.
   *
   * The first is what it starts on. Pass one to pin the format and drop the dropdown.
   *
   * ```tsx
   * formats={["rgb", "hex"]}  // starts on RGB, offers both
   * formats={["hex"]}         // hex only, no dropdown
   * ```
   *
   * @default ["hex", "rgb", "hsl"]
   */
  formats?: ColorFormat[];

  /** Called when the format is switched, with the colour rewritten in it. */
  onFormatChange?: (format: ColorFormat, color: string) => void;

  /** Show the field you can type or paste a colour into. @default true */
  showInput?: boolean;

  /** Colours to offer below the panel. Nothing is shown when it is empty. */
  swatches?: string[];

  /** What the swatches are called, for a reader. @default "Preset colours" */
  swatchesLabel?: string;

  /**
   * Offer the eyedropper. The button only renders where the browser has the API, so it is
   * absent rather than dead in browsers without it.
   * @default false
   */
  eyeDropper?: boolean;

  /** Nothing can be moved, typed or picked. @default false */
  disabled?: boolean;

  /** Draw your own saturation area. Position and dragging stay with the picker. */
  renderSaturation?: (state: ColorPickerRenderState) => ReactNode;

  /** Draw your own hue handle. */
  renderHueThumb?: (state: ColorPickerRenderState) => ReactNode;

  /** Draw your own alpha handle. */
  renderAlphaThumb?: (state: ColorPickerRenderState) => ReactNode;

  /** Goes under the panel, above the swatches. */
  footer?: ReactNode;

  className?: string;
}

export interface ColorPickerRenderState {
  /** The colour as the caller's `format` would give it. */
  color: string;
  /** The same colour in parts, for drawing with. */
  hsva: Hsva;
  /** Whether a pointer is down on this control. */
  dragging: boolean;
}
