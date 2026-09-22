import type { RefObject } from "react";
import { useCallback, useLayoutEffect } from "react";

interface AutoResizeOptions {
  /** Off means the height is left to `rows` and to CSS. */
  enabled: boolean;
  minRows: number;
  maxRows?: number;
  /** Refits when it changes, which is what covers a controlled field. */
  value?: unknown;
}

/**
 * Grows a textarea to fit what is in it, between `minRows` and `maxRows`.
 *
 * Returns the function that does it, so an uncontrolled field can call it on input — a
 * controlled one is refitted by the effect when its value changes.
 */
const useAutoResize = (
  ref: RefObject<HTMLTextAreaElement | null>,
  { enabled, minRows, maxRows, value }: AutoResizeOptions
) => {
  const fit = useCallback(() => {
    const el = ref.current;

    if (!el || !enabled) return;

    const style = getComputedStyle(el);

    // `lineHeight` reports the keyword "normal" when it was never set, which is not a number
    const line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

    const min = minRows * line + padding;
    const max = maxRows ? maxRows * line + padding : Infinity;

    /*
     * Collapsed first, or `scrollHeight` only ever reports the height it already has and the
     * field can grow but never shrink.
     */
    el.style.height = "auto";

    const content = el.scrollHeight;

    // scrollHeight counts padding but not borders, so the two box models need different sums
    el.style.height = `${
      Math.min(Math.max(content, min), max) + (style.boxSizing === "border-box" ? border : -padding)
    }px`;

    el.style.overflowY = content > max ? "auto" : "hidden";
  }, [ref, enabled, minRows, maxRows]);

  useLayoutEffect(() => {
    const el = ref.current;

    if (!el) return;

    if (!enabled) {
      // Leave nothing behind, so `rows` and CSS decide the height again
      el.style.height = "";
      el.style.overflowY = "";

      return;
    }

    fit();

    /*
     * Width only. A narrower field rewraps its text and needs another line, but watching the
     * height would feed every write here straight back in.
     */
    let last = el.clientWidth;

    const observer = new ResizeObserver(() => {
      if (el.clientWidth === last) return;

      last = el.clientWidth;
      fit();
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, enabled, fit, value]);

  return fit;
};

export default useAutoResize;
