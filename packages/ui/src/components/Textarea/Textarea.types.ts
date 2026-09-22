import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Grow to fit what is typed, between `rows` and `maxRows`.
   * @default false
   * */
  autoResize?: boolean;

  /** The height it starts at, and the shortest it gets while growing. @default 2 */
  rows?: number;

  /** How tall it may grow. Past it the textarea scrolls. `autoResize` only. */
  maxRows?: number;
}
