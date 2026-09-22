import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { isInsideShadowDOM } from "../utils/isInsideShadowDom";

/**
 * Reuseable hook to detect clicks outside of a ref element that is passed as an argument
 * @param handler - Function to be called when a click is detected outside of the component
 * @param refs - Ref objects to be checked for clicks outside
 * @returns void
 * @example
 *
 * ```js
 * const ref = useRef(null);
 *
 * useClickOutside(() => {
 *   console.log('Clicked outside');
 * }, [ref]); // You can pass multiple refs
 *
 * return (
 *  <div ref={ref}>
 *     <h1>Click outside</h1>
 *  </div>
 * );
 * ```
 */
const useClickOutside = <T extends HTMLElement>(
  handler?: (event: Event | MouseEvent | TouchEvent) => void,
  refs?: RefObject<T | null>[]
) => {
  const handlerRef = useRef(handler);
  const refsRef = useRef(refs);

  handlerRef.current = handler;
  refsRef.current = refs;

  const enabled = !!handler && !!refs && refs.length > 0;

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: Event | MouseEvent | TouchEvent) => {
      const currentRefs = refsRef.current ?? [];
      const isShadow = isInsideShadowDOM(currentRefs[0]?.current as Node);
      const target = isShadow ? event.composedPath()[0] : event.target;

      if (currentRefs.some((ref) => ref.current?.contains(target as Node))) {
        return;
      }

      handlerRef.current?.(event);
    };

    document.addEventListener("mousedown", listener, true);
    document.addEventListener("touchstart", listener, true);

    return () => {
      document.removeEventListener("mousedown", listener, true);
      document.removeEventListener("touchstart", listener, true);
    };
  }, [enabled]);
};

export default useClickOutside;
