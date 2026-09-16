import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { classNames } from "../../utils/classNames";

import type { ToastPosition, ToasterOptions, ToastRecord } from "./Toast.types";
import { ToastItem } from "./ToastItem";
import { toastStore } from "./toast-store";

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];

const subscribeNever = () => () => {};
const mounted = () => true;
const notMounted = () => false;

/**
 * Renders the toast stacks. `GeckoUIProvider` mounts this for you.
 */
export function Toaster({
  position = "bottom-right",
  duration = 4000,
  closeButton = false,
  visibleToasts = 3,
  gap = 14,
  offset = 24,
  className,
  ...rest
}: ToasterOptions) {
  const isMounted = useSyncExternalStore(subscribeNever, mounted, notMounted);
  const toasts = useSyncExternalStore<ToastRecord[]>(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot
  );
  const [pausedRegion, setPausedRegion] = useState<ToastPosition | null>(null);

  if (!isMounted || toasts.length === 0) return null;

  const defaults = { duration, closeButton, ...rest };

  return createPortal(
    <>
      {POSITIONS.map((region) => {
        const items = toasts.filter((t) => (t.options.position ?? position) === region);
        if (items.length === 0) return null;

        // newest wins when more arrive than the stack shows
        const visible = items.slice(-visibleToasts);

        return (
          <ol
            key={region}
            className={classNames("GeckoUIToaster", className)}
            data-position={region}
            style={{ gap, "--gecko-toast-offset": `${offset}px` } as React.CSSProperties}
            onMouseEnter={() => setPausedRegion(region)}
            onMouseLeave={() => setPausedRegion(null)}
            onFocus={() => setPausedRegion(region)}
            onBlur={() => setPausedRegion(null)}>
            {visible.map((toast) => (
              <li key={toast.id} className="GeckoUIToaster__item">
                <ToastItem toast={toast} defaults={defaults} paused={pausedRegion === region} />
              </li>
            ))}
          </ol>
        );
      })}
    </>,
    document.body
  );
}

export default Toaster;
