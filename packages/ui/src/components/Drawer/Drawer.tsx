import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useClickOutside, useEscListener, useScrollLock } from "../../hooks";
import { classNames } from "../../utils/classNames";
import { OVERLAY_ANIMATION_DURATION, overlayStore } from "../GeckoUIProvider/overlay-store";
import type { DrawerProps } from "./Drawer.types";

/**
 * Drawer is a slide-out panel component that displays auxiliary content from any edge of the viewport.
 * It provides a less intrusive alternative to modals for navigation menus, settings panels, filters,
 * and contextual information.
 *
 * The component supports four placement directions (top, right, bottom, left) with smooth transitions,
 * optional backdrop overlay, and flexible dismissal behaviors including ESC key and click-outside handling.
 *
 * @example
 * Controlled usage:
 *
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Button onClick={() => setOpen(true)}>Open</Button>
 * <Drawer open={open} onClose={() => setOpen(false)} placement="right" allowClickOutside>
 *   <div className="p-6">Content here</div>
 * </Drawer>
 * ```
 *
 * @example
 * Mobile navigation menu:
 *
 * ```tsx
 * const [menuOpen, setMenuOpen] = useState(false);
 *
 * <Drawer
 *   open={menuOpen}
 *   onClose={() => setMenuOpen(false)}
 *   placement="left"
 *   allowClickOutside
 *   dismissOnEscape
 *   className="w-80 bg-white shadow-xl"
 * >
 *   <nav className="p-6">
 *     <NavigationLinks />
 *   </nav>
 * </Drawer>
 * ```
 */
function Drawer({
  open = false,
  allowClickOutside,
  onClose,
  hideBackdrop = false,
  placement = "right",
  backdropClassName,
  className,
  children,
  dismissOnEscape = true,
  style
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // A drawer mounted already open, as Drawer.show() does, would otherwise appear with no
  // transition: there is no closed frame for the CSS to animate away from. Holding the
  // open state back by one frame gives it that frame.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = open && ready;

  // Hold the scroll lock through the slide out. Releasing it the moment `open` flips
  // makes the page jump sideways while the drawer is still moving.
  const [closing, setClosing] = useState(false);
  const wasOpen = useRef(open);

  useEffect(() => {
    if (wasOpen.current === open) return;
    wasOpen.current = open;

    if (open) return;

    setClosing(true);
    const timer = setTimeout(() => setClosing(false), OVERLAY_ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [open]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleDismiss = useCallback(() => {
    onCloseRef.current?.();
  }, []);

  const dismissOnClickOutside = useCallback(() => {
    if (!allowClickOutside || !open) return;
    handleDismiss();
  }, [allowClickOutside, open, handleDismiss]);

  useClickOutside(dismissOnClickOutside, [drawerRef]);

  // a click-through drawer deliberately leaves the page usable, so it must not lock scroll
  useScrollLock((open || closing) && !allowClickOutside);

  useEscListener(open && dismissOnEscape ? handleDismiss : undefined);

  return (
    <div className="GeckoUIDrawer" style={style}>
      <div
        data-state={visible && !hideBackdrop ? "visible" : "hidden"}
        data-clickthrough={allowClickOutside || undefined}
        className={classNames("GeckoUIDrawer__backdrop", backdropClassName)}
        onMouseDown={open ? handleDismiss : undefined}
        role="presentation"
      />
      <div
        ref={drawerRef}
        data-placement={placement}
        data-state={visible ? "open" : "closed"}
        className={classNames("GeckoUIDrawer__drawer", className)}
        role="dialog"
        aria-modal={!allowClickOutside}>
        {children}
      </div>
    </div>
  );
}

/**
 * Drawer.show provides an imperative API for displaying drawers without managing React state.
 * Each call pushes a new drawer onto the overlay stack and returns an id.
 * Call `Drawer.dismiss(id)` to close a specific drawer, or `Drawer.dismiss()` for the topmost
 * drawer. It never closes a dialog — use `Dialog.dismiss()` for those.
 *
 * `onClose` passed in options is still called when the drawer is dismissed.
 *
 * Requires `<GeckoUIProvider>` to wrap your app.
 *
 * @example
 * Quick action drawer:
 *
 * ```tsx
 * const id = Drawer.show(
 *   <QuickActionsMenu onActionClick={() => Drawer.dismiss(id)} />,
 *   { placement: "bottom", className: "h-80 rounded-t-xl" }
 * );
 * ```
 *
 * @example
 * Contextual help panel:
 *
 * ```tsx
 * Drawer.show(
 *   <HelpDocumentation topic={currentTopic} />,
 *   { placement: "right", allowClickOutside: true, className: "w-[500px]" }
 * );
 * ```
 */
Drawer.show = (node: ReactNode, options: Omit<DrawerProps, "open" | "children"> = {}): string => {
  (document.activeElement as HTMLElement)?.blur();
  return overlayStore.pushDrawer(node, options);
};

Drawer.dismiss = (id?: string): void => {
  overlayStore.dismiss("drawer", id);
};

export default Drawer;
