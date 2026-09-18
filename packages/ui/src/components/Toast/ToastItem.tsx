import { useCallback, useEffect, useRef, useState } from "react";

import { X } from "../../icons";
import { classNames } from "../../utils/classNames";
import { Spinner } from "../Spinner";
import type { ToastRecord, ToastVariant, ToasterOptions } from "./Toast.types";
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
}

export function ToastItem({ toast, defaults, paused }: ToastItemProps) {
  const { options, message, variant, custom } = toast;
  const [state, setState] = useState<"entering" | "open" | "closing">("entering");

  const duration = options.duration ?? defaults.duration;
  const closeButton = options.closeButton ?? defaults.closeButton;

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

  const icon = options.icon === undefined ? icons[variant] : options.icon;

  if (custom) {
    return (
      <div
        className={classNames("GeckoUIToast__custom", options.className)}
        data-state={state}
        style={options.style}>
        {message}
      </div>
    );
  }

  return (
    <div
      className={classNames("GeckoUIToast", defaults.toastClassName, options.className)}
      data-state={state}
      data-variant={variant}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      style={{ ...defaults.toastStyle, ...options.style }}>
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
