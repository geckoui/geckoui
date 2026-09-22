import { forwardRef, useCallback, useRef } from "react";

import useAutoResize from "../../hooks/useAutoResize";
import { classNames } from "../../utils/classNames";
import type { TextareaProps } from "./Textarea.types";

/**
 * A textarea, optionally growing to fit what is typed.
 *
 * Without `autoResize` it is a plain textarea: `rows` sets the height, CSS can change it,
 * and the user can drag it.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Type something..." />
 * <Textarea rows={5} placeholder="Five rows tall" />
 * ```
 *
 * @example
 * Growing from two rows to ten, then scrolling:
 *
 * ```tsx
 * <Textarea autoResize rows={2} maxRows={10} placeholder="Say something" />
 * ```
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ autoResize = false, className, rows = 2, maxRows, onInput, value, ...rest }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    const fit = useAutoResize(innerRef, {
      enabled: autoResize,
      minRows: rows,
      maxRows,
      value
    });

    /*
     * The effect refits when a controlled `value` changes. An uncontrolled one never tells
     * React anything, so it is refitted here instead.
     */
    const handleInput = useCallback(
      (event: React.FormEvent<HTMLTextAreaElement>) => {
        fit();
        onInput?.(event);
      },
      [fit, onInput]
    );

    return (
      <textarea
        {...rest}
        className={classNames("GeckoUITextarea", className)}
        ref={(node) => {
          innerRef.current = node;

          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        rows={rows}
        value={value}
        onInput={handleInput}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
