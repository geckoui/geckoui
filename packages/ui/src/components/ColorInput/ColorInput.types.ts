import type { Placement, Strategy } from "@floating-ui/react";
import type { ReactNode } from "react";

import type { ColorPickerProps } from "../ColorPicker";

export interface ColorInputProps
  extends Omit<ColorPickerProps, "className" | "footer" | "defaultValue"> {
  /** What it starts on when uncontrolled. @default "#000000" */
  defaultValue?: string;

  /** Shown in place of the value when there is none. @default "Pick a colour" */
  placeholder?: ReactNode;

  /**
   * Draw the field yourself: a swatch on its own, a swatch with your own label, anything.
   *
   * It is drawn **inside** the trigger, so opening, closing, focus and the aria stay with
   * the component. You are handing over what it looks like, not how it works.
   *
   * ```tsx
   * <ColorInput
   *   render={({ color }) => <span className="size-6 rounded" style={{ background: color }} />}
   * />
   * ```
   */
  render?: (state: ColorInputRenderState) => ReactNode;

  /** Cannot be opened. @default false */
  disabled?: boolean;

  /** Shows the value, but the picker does not open. @default false */
  readOnly?: boolean;

  /** Draws the field in its error colours. @default false */
  hasError?: boolean;

  /** @default "bottom-start" */
  pickerPlacement?: Placement;

  /** @default "absolute" */
  floatingStrategy?: Strategy;

  className?: string;
  wrapperClassName?: string;
  pickerClassName?: string;

  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

export interface ColorInputRenderState {
  /** The colour as the caller's `format` would give it, or `""` when there is none. */
  color: string;
  /** Whether the picker is open. */
  open: boolean;
}
