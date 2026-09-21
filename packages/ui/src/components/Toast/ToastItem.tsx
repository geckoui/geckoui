import { useCallback, useEffect, useRef, useState } from "react";

import { X } from "../../icons";
import { classNames } from "../../utils/classNames";
import { Spinner } from "../Spinner";
import type { ToastPosition, ToastRecord, ToastVariant, ToasterOptions } from "./Toast.types";
import { axisOf, shouldDismiss, swipeDirectionsFor } from "./Toast.utils";
import { ToastErrorIcon, ToastInfoIcon, ToastSuccessIcon, ToastWarningIcon } from "./ToastIcons";
import { toastStore } from "./toast-store";

export const TOAST_ANIMATION_DURATION = 200;

const icons: Partial<Record<ToastVariant, React.ReactNode>> = {
  success: <ToastSuccessIcon />,
  error: <ToastErrorIcon />,
  warning: <ToastWarningIcon />,
  info: <ToastInfoIcon />,
  loading: <Spinner className="GeckoUIToast__spinner" />
};

interface ToastItemProps {
  toast: ToastRecord;
  defaults: Required<Pick<ToasterOptions, "duration" | "closeButton">> &
    Omit<ToasterOptions, "duration" | "closeButton" | "position" | "className">;
  /** Timers hold while the pointer is over the stack, so toasts do not vanish mid-read */
  paused: boolean;
  /** Where this stack sits, which is the way its toasts are swiped away */
  position: ToastPosition;
}

export function ToastItem({ toast, defaults, paused, position }: ToastItemProps) {
  const { options, message, variant, custom } = toast;
  const [state, setState] = useState<"entering" | "open" | "closing">("entering");

  const duration = options.duration ?? defaults.duration;
  const dismissible = options.dismissible ?? defaults.dismissible ?? true;

  const closeButton = options.closeButton ?? defaults.closeButton;

  const swipe = swipeDirectionsFor(position);
  const [offset, setOffset] = useState(0);
  const [axis, setAxis] = useState<"x" | "y" | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragFrom = useRef({ x: 0, y: 0 });
  const dragStartedAt = useRef(0);

  const remaining = useRef(duration);
  const startedAt = useRef(0);
  const closedBy = useRef<"auto" | "manual" | null>(null);

  const close = useCallback((reason: "auto" | "manual") => {
    if (closedBy.current) return;
    closedBy.current = reason;
    setState("closing");
  }, []);

  // register first so `toast.dismiss(id)` can reach this toast immediately
  useEffect(() => toastStore.registerDismiss(toast.id, () => close("manual")), [toast.id, close]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setState("open"));
    return () => cancelAnimationFrame(raf);
  }, []);

  const generationRef = useRef(toast.generation);

  useEffect(() => {
    // a replaced toast (same id, e.g. loading -> success) restarts its clock
    if (generationRef.current !== toast.generation) {
      generationRef.current = toast.generation;
      remaining.current = duration;
      closedBy.current = null;
    }

    if (state === "closing") {
      const timer = setTimeout(() => {
        options.onDismiss?.();
        if (closedBy.current === "auto") options.onAutoClose?.();
        toastStore.remove(toast.id);
      }, TOAST_ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }

    if (paused || !Number.isFinite(remaining.current)) return;

    startedAt.current = Date.now();
    const timer = setTimeout(() => close("auto"), remaining.current);

    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [state, paused, close, options, toast.id, toast.generation, duration]);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dismissible) return;

    /*
     * Not from a control. Capturing the pointer here would send the rest of the sequence to
     * the toast, so the press would never finish as a click on the button it started on.
     */
    if ((event.target as HTMLElement).closest("button, a, input, select, textarea")) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragFrom.current = { x: event.clientX, y: event.clientY };
    dragStartedAt.current = Date.now();
    setAxis(null);
    setDragging(true);
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const dx = event.clientX - dragFrom.current.x;
    const dy = event.clientY - dragFrom.current.y;
    const going = axis ?? axisOf(dx, dy, swipe);

    if (!going) return;
    if (!axis) setAxis(going);

    // Only towards the edge it leaves by: dragging back in does nothing, so the toast
    // never wanders into the middle of the screen
    const along = going === "x" ? dx * swipe.x : dy * swipe.y;

    setOffset(Math.max(along, 0));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    // Asked for first: releasing a capture that was never taken throws, which would leave
    // the toast stranded halfway out instead of springing back.
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragging(false);

    if (shouldDismiss(offset, Date.now() - dragStartedAt.current)) return close("manual");

    setOffset(0);
    setAxis(null);
  };

  const dragStyle =
    offset > 0 && axis
      ? {
          transform:
            axis === "x"
              ? `translateX(${offset * swipe.x}px)`
              : `translateY(${offset * swipe.y}px)`,
          // fades on the way out, so letting go halfway reads as half gone
          opacity: Math.max(1 - offset / 160, 0.2)
        }
      : undefined;

  const swipeProps = {
    "data-state": state,
    "data-dragging": dragging || undefined,
    "data-dismissible": dismissible || undefined,
    "data-swipe": dismissible ? (swipe.x ? "both" : "y") : undefined,
    onPointerDown: startDrag,
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onPointerCancel: endDrag
  };

  /*
   * A custom toast is still a toast: whatever is inside it, it is swiped away the same way.
   * Only what it looks like is the caller's business.
   */
  if (custom) {
    return (
      <div
        className={classNames("GeckoUIToast__custom", options.className)}
        style={{ ...options.style, ...dragStyle }}
        {...swipeProps}>
        {message}
      </div>
    );
  }

  const icon = options.icon === undefined ? icons[variant] : options.icon;

  return (
    <div
      className={classNames("GeckoUIToast", defaults.toastClassName, options.className)}
      data-variant={variant}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      style={{ ...defaults.toastStyle, ...options.style, ...dragStyle }}
      {...swipeProps}>
      {icon ? <span className="GeckoUIToast__icon">{icon}</span> : null}

      <div className="GeckoUIToast__body">
        <div className="GeckoUIToast__message">{message}</div>
        {options.description ? (
          <div className="GeckoUIToast__description">{options.description}</div>
        ) : null}

        {options.action || options.cancel ? (
          <div className="GeckoUIToast__actions">
            {options.action ? (
              <button
                type="button"
                className="GeckoUIToast__action"
                onClick={() => {
                  options.action?.onClick();
                  close("manual");
                }}>
                {options.action.label}
              </button>
            ) : null}
            {options.cancel ? (
              <button
                type="button"
                className="GeckoUIToast__cancel"
                onClick={() => {
                  options.cancel?.onClick();
                  close("manual");
                }}>
                {options.cancel.label}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {closeButton ? (
        <button
          type="button"
          className="GeckoUIToast__close"
          aria-label="Dismiss notification"
          onClick={() => close("manual")}>
          <X />
        </button>
      ) : null}
    </div>
  );
}
