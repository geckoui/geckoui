import { useCallback, useEffect, useRef } from "react";

/**
 * Open overlays (menus, popovers, drawers, dialogs) in the order they opened.
 *
 * An outside click or Escape should close only the topmost one: a Select open inside a
 * Drawer closes on a click on the backdrop, and the Drawer stays. Each overlay still runs
 * its own dismiss handler; it just asks `isTop()` first.
 *
 * "Top" is read when the gesture starts. A menu closes during the same click, and
 * without the snapshot the Drawer's handler for that click would find itself on top.
 * The mousedown that follows a touch is not a new gesture, so it takes no snapshot.
 */
const stack: object[] = [];
let topAtGesture: object | undefined;
let gestureActive = false;
let listening = false;

function startGesture() {
  topAtGesture = stack[stack.length - 1];
  gestureActive = true;
}

function endGesture() {
  // After the click's own handlers have all run
  setTimeout(() => {
    gestureActive = false;
    topAtGesture = undefined;
  });
}

function listen() {
  if (listening || typeof window === "undefined") return;
  listening = true;

  for (const type of ["pointerdown", "touchstart", "keydown"]) {
    window.addEventListener(type, startGesture, true);
  }
  for (const type of ["click", "keyup", "pointercancel"]) {
    window.addEventListener(type, endGesture, true);
  }
}

function isTopLayer(layer: object) {
  return (gestureActive ? topAtGesture : stack[stack.length - 1]) === layer;
}

/**
 * Registers an overlay while `active` and returns `isTop()`, which tells its dismiss
 * handlers whether this overlay is the one an outside click or Escape is meant for.
 */
export function useLayer(active: boolean) {
  const layer = useRef<object>({}).current;

  useEffect(() => {
    if (!active) return;

    listen();
    stack.push(layer);

    return () => {
      const index = stack.lastIndexOf(layer);
      if (index !== -1) stack.splice(index, 1);
    };
  }, [active, layer]);

  return useCallback(() => isTopLayer(layer), [layer]);
}
