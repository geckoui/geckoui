import { useEffect } from "react";

/**
 * Reference counted, so stacked overlays do not fight over the lock. Only the first
 * lock touches the DOM and only the last one restores it.
 */
let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

const SCROLLBAR_VARIABLE = "--gecko-scrollbar-width";

function lockBodyScroll() {
  if (lockCount++ > 0) return;

  const { body, documentElement } = document;

  // Hiding the scrollbar widens the viewport, so pay the difference back as padding
  // or every fixed and full width element jumps sideways.
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;

    // exposed so fixed elements pinned to the right edge can compensate too
    documentElement.style.setProperty(SCROLLBAR_VARIABLE, `${scrollbarWidth}px`);
  }
}

function unlockBodyScroll() {
  if (lockCount === 0) return;
  if (--lockCount > 0) return;

  const { body, documentElement } = document;

  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
  documentElement.style.removeProperty(SCROLLBAR_VARIABLE);
}

/**
 * Stops the page behind an overlay from scrolling, without the sideways jump that
 * hiding the scrollbar normally causes.
 *
 * @example
 * ```tsx
 * useScrollLock(open);
 * ```
 * */
const useScrollLock = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    lockBodyScroll();
    return unlockBodyScroll;
  }, [enabled]);
};

export default useScrollLock;
