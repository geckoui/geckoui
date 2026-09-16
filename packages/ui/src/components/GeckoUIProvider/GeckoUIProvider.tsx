import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { getDataAttributes } from "../../utils";
import { DialogSurface } from "../Dialog/DialogSurface";
import { Drawer } from "../Drawer";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import { Toaster } from "../Toast";
import type { GeckoUIProviderProps } from "./GeckoUIProvider.types";
import type { DialogEntry, DrawerEntry, OverlayEntry } from "./overlay-store";
import { OVERLAY_ANIMATION_DURATION, getZIndex, overlayStore } from "./overlay-store";

const emptySubscribe = () => () => {};
const getNoHost = () => null;
const getMounted = () => true;
const getNotMounted = () => false;
const useIsMounted = () => useSyncExternalStore(emptySubscribe, getMounted, getNotMounted);

function useOverlayEntry(id: string) {
  const [open, setOpen] = useState(true);

  const close = useCallback(() => {
    setOpen(false);
    overlayStore.markClosing(id);
  }, [id]);

  const handleExited = useCallback(() => {
    overlayStore.remove(id);
  }, [id]);

  return { open, close, handleExited };
}

interface EntryRendererProps {
  isTop: boolean;
  zIndex: number;
}

function DialogEntryRenderer({ id, options, isTop, zIndex }: DialogEntry & EntryRendererProps) {
  const {
    content,
    className,
    dismissOnEscape = true,
    dismissOnOutsideClick = true,
    ...rest
  } = options;

  const { open, close, handleExited } = useOverlayEntry(id);

  useEffect(() => overlayStore.registerDismiss(id, close), [id, close]);

  return (
    <DialogSurface
      open={open}
      isTop={isTop}
      className={className}
      dismissOnEscape={dismissOnEscape}
      dismissOnOutsideClick={dismissOnOutsideClick}
      style={{ zIndex }}
      dataAttributes={getDataAttributes(rest)}
      onDismiss={close}
      onExited={handleExited}>
      <DynamicComponentRenderer component={content} dismiss={close} isTop={isTop} />
    </DialogSurface>
  );
}

function DrawerEntryRenderer({
  id,
  node,
  options,
  isTop,
  zIndex
}: DrawerEntry & EntryRendererProps) {
  const { open, close, handleExited } = useOverlayEntry(id);

  const onCloseRef = useRef(options.onClose);
  onCloseRef.current = options.onClose;

  const handleClose = useCallback(() => {
    onCloseRef.current?.();
    close();
  }, [close]);

  useEffect(() => overlayStore.registerDismiss(id, handleClose), [id, handleClose]);

  useEffect(() => {
    if (open) return;

    const timer = setTimeout(handleExited, OVERLAY_ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [open, handleExited]);

  return (
    <Drawer
      {...options}
      open={open}
      style={{ ...options.style, zIndex }}
      onClose={handleClose}
      dismissOnEscape={options.dismissOnEscape !== false && isTop}
      allowClickOutside={!!(options.allowClickOutside && isTop)}>
      {node}
    </Drawer>
  );
}

function OverlayEntryRenderer({
  entry,
  isTop,
  zIndex
}: {
  entry: OverlayEntry;
  isTop: boolean;
  zIndex: number;
}) {
  if (entry.type === "dialog") {
    return <DialogEntryRenderer {...entry} isTop={isTop} zIndex={zIndex} />;
  }

  return <DrawerEntryRenderer {...entry} isTop={isTop} zIndex={zIndex} />;
}

/**
 * GeckoUIProvider must wrap your application tree (below your own context providers).
 *
 * It owns the overlay stack for `Dialog.show()` / `Drawer.show()` and renders each
 * open overlay via `ReactDOM.createPortal` so that React context flows into overlay
 * content. It also renders the toast stacks.
 *
 * Mount one provider. If you nest another one deeper — to give overlays access to a subtree's
 * context — the innermost provider owns the overlay stack and the `<Toaster>`, and the outer
 * ones render nothing but their children.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { GeckoUIProvider } from "@geckoui/geckoui";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           <GeckoUIProvider>
 *             {children}
 *           </GeckoUIProvider>
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function GeckoUIProvider({ children, toastOptions = {} }: GeckoUIProviderProps) {
  const mounted = useIsMounted();
  const [hostId] = useState(() => overlayStore.createHostId());

  useEffect(() => overlayStore.registerHost(hostId), [hostId]);

  const activeHost = useSyncExternalStore(
    overlayStore.subscribe,
    overlayStore.getActiveHost,
    getNoHost
  );
  const entries = useSyncExternalStore<OverlayEntry[]>(
    overlayStore.subscribe,
    overlayStore.getSnapshot,
    overlayStore.getServerSnapshot
  );

  const isHost = activeHost === hostId;
  const topId = overlayStore.getTopId();

  return (
    <>
      {children}
      {mounted &&
        isHost &&
        entries.map((entry, index) =>
          createPortal(
            <OverlayEntryRenderer
              entry={entry}
              isTop={entry.id === topId}
              zIndex={getZIndex(entry, index)}
            />,
            document.body,
            entry.id
          )
        )}
      {isHost && <Toaster {...toastOptions} />}
    </>
  );
}

export default GeckoUIProvider;
