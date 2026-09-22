import { getDataAttributes } from "../../utils";
import { overlayStore } from "../GeckoUIProvider/overlay-store";
import type { DialogOptions, DialogProps } from "./Dialog.types";
import { DialogSurface } from "./DialogSurface";

/**
 * Dialog renders content in a centered modal overlay.
 *
 * Use it declaratively with `open` / `onClose` when the dialog belongs to a component's
 * state, or imperatively with `Dialog.show()` when it is a one-off triggered from anywhere.
 * The imperative form requires `<GeckoUIProvider>` to wrap your app.
 *
 * Clicking the backdrop or pressing Esc dismisses the dialog. Clicks inside the dialog never
 * dismiss it, including popups rendered in a portal such as `Select` or `Menu`.
 *
 * @example
 * Declarative:
 *
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Button onClick={() => setOpen(true)}>Open</Button>
 * <Dialog open={open} onClose={() => setOpen(false)}>
 *   <h3>Hello</h3>
 *   <Button onClick={() => setOpen(false)}>Close</Button>
 * </Dialog>
 * ```
 */
function Dialog({
  open = false,
  onClose,
  className,
  dismissOnEscape = true,
  dismissOnOutsideClick = true,
  children,
  ...rest
}: DialogProps) {
  return (
    <DialogSurface
      open={open}
      className={className}
      dismissOnEscape={dismissOnEscape}
      dismissOnOutsideClick={dismissOnOutsideClick}
      onDismiss={onClose}
      dataAttributes={getDataAttributes(rest)}>
      {children}
    </DialogSurface>
  );
}

/**
 * Dialog.show opens a dialog imperatively, without managing React state.
 *
 * Each call pushes a new dialog onto the overlay stack and returns an id. Dialogs stack on
 * top of each other and always render above drawers. Requires `<GeckoUIProvider>`.
 *
 * @example
 * ```tsx
 * const id = Dialog.show({
 *   content: ({ dismiss }) => (
 *     <div>
 *       <p>First dialog</p>
 *       <Button onClick={() => Dialog.show({ content: () => <p>Second dialog</p> })}>
 *         Open another
 *       </Button>
 *       <Button onClick={dismiss}>Close this</Button>
 *     </div>
 *   )
 * });
 *
 * Dialog.dismiss(id);
 * ```
 *
 * @note
 * For dialogs requiring user confirmation with standardized action buttons,
 * consider using the `ConfirmDialog` component instead.
 */
Dialog.show = (options: DialogOptions): string => {
  (document.activeElement as HTMLElement)?.blur();
  return overlayStore.pushDialog(options);
};

/**
 * Closes a dialog opened with `Dialog.show()`.
 *
 * Pass the id returned by `show()` to close that dialog, or call it with no argument to close
 * the topmost dialog. It never closes a drawer — use `Drawer.dismiss()` for those.
 */
Dialog.dismiss = (id?: string): void => {
  overlayStore.dismiss("dialog", id);
};

export default Dialog;
