import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useEscListener, useScrollLock } from "../../hooks";
import { classNames } from "../../utils/classNames";
import { OVERLAY_ANIMATION_DURATION } from "../GeckoUIProvider/overlay-store";

type AnimationState = "closed" | "entering" | "open" | "closing";

export interface DialogSurfaceProps {
  open: boolean;
  isTop?: boolean;
  className?: string;
  dismissOnEscape?: boolean;
  dismissOnOutsideClick?: boolean;
  style?: CSSProperties;
  dataAttributes?: Record<string, string>;
  onDismiss?: () => void;
  onExited?: () => void;
  children: ReactNode;
}

/**
 * The visual shell shared by the declarative `<Dialog>` and the overlays pushed by
 * `Dialog.show()`. It owns the enter/exit animation and dismissal behaviour only.
 */
export function DialogSurface({
  open,
  isTop = true,
  className,
  dismissOnEscape = true,
  dismissOnOutsideClick = true,
  style,
  dataAttributes,
  onDismiss,
  onExited,
  children
}: DialogSurfaceProps) {
  const [animationState, setAnimationState] = useState<AnimationState>(
    open ? "entering" : "closed"
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pressedOutside = useRef(false);

  const onDismissRef = useRef(onDismiss);
  const onExitedRef = useRef(onExited);
  onDismissRef.current = onDismiss;
  onExitedRef.current = onExited;

  const requestDismiss = useCallback(() => {
    onDismissRef.current?.();
  }, []);

  useEffect(() => {
    setAnimationState((current) => {
      if (open) return current === "open" ? current : "entering";
      return current === "closed" ? current : "closing";
    });
  }, [open]);

  useEffect(() => {
    if (animationState === "entering") {
      let innerFrame = 0;
      const outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => setAnimationState("open"));
      });

      return () => {
        cancelAnimationFrame(outerFrame);
        cancelAnimationFrame(innerFrame);
      };
    }

    if (animationState === "closing") {
      const timer = setTimeout(() => {
        setAnimationState("closed");
        onExitedRef.current?.();
      }, OVERLAY_ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [animationState]);

  // hold the lock until the exit animation finishes, or the page jumps mid-close
  useScrollLock(animationState !== "closed");

  const canDismiss = open && isTop && animationState !== "closing";

  useEscListener(canDismiss && dismissOnEscape ? requestDismiss : undefined);

  const isOutside = (target: EventTarget | null) =>
    target === backdropRef.current || target === rootRef.current;

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    pressedOutside.current = isOutside(event.target);
  };

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    const shouldDismiss = pressedOutside.current && isOutside(event.target);
    pressedOutside.current = false;

    if (shouldDismiss && canDismiss && dismissOnOutsideClick) requestDismiss();
  };

  if (animationState === "closed") return null;

  return (
    <div
      ref={rootRef}
      className="GeckoUIDialog"
      data-state={animationState}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role="presentation"
      {...dataAttributes}>
      <div ref={backdropRef} className="GeckoUIDialog__backdrop">
        <div
          className={classNames("GeckoUIDialog__dialog", className)}
          role="dialog"
          aria-modal="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DialogSurface;
