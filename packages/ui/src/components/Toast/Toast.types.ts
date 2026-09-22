import type { CSSProperties, ReactNode } from "react";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Supporting line under the message */
  description?: ReactNode;

  /** Milliseconds before the toast closes itself. `Infinity` keeps it open. */
  duration?: number;

  /** Overrides the Toaster position for this toast */
  position?: ToastPosition;

  /** Primary action button */
  action?: ToastAction;

  /** Secondary action button */
  cancel?: ToastAction;

  /** Reuse an id to replace an existing toast instead of stacking a new one */
  id?: string;

  /** Replaces the variant icon. `null` removes it. */
  icon?: ReactNode | null;

  /** Show the dismiss button */
  closeButton?: boolean;

  /**
   * Whether the toast can be swiped away. Set it to false for one that has to be answered
   * rather than waved off.(Default: true)
   * */
  dismissible?: boolean;

  /** Called whenever the toast leaves, including on auto close */
  onDismiss?: () => void;

  /** Called only when the duration elapses */
  onAutoClose?: () => void;

  className?: string;
  style?: CSSProperties;
}

export interface ToastRecord {
  id: string;
  variant: ToastVariant;
  message: ReactNode;
  options: ToastOptions;
  /** Set when the toast was created by `toast.custom` */
  custom?: boolean;

  /** Bumped when a toast is replaced in place, so its timer restarts */
  generation: number;
}

export interface ToastPromiseMessages<T> {
  loading: ReactNode;
  success: ReactNode | ((value: T) => ReactNode);
  error: ReactNode | ((error: unknown) => ReactNode);
}

export interface ToasterOptions {
  /** Where toasts appear unless a toast overrides it. Default `bottom-right`. */
  position?: ToastPosition;

  /** Default duration in ms. Default `4000`. */
  duration?: number;

  /**
   * Show the dismiss button on every toast. Default `false`.
   *
   * Worth turning on for a toast that neither closes itself nor can be swiped: swiping is
   * pointer only, so that combination leaves a keyboard user no way to be rid of it.
   * */
  closeButton?: boolean;

  /** Whether toasts can be swiped away. Default `true`. */
  dismissible?: boolean;

  /** How many toasts are rendered per position at once. Default `3`. */
  visibleToasts?: number;

  /** Pixels between stacked toasts. Default `14`. */
  gap?: number;

  /** Pixels between the stack and the viewport edge. Default `24`. */
  offset?: number;

  /** Class applied to the stack element for each position */
  className?: string;

  /** Class applied to every toast */
  toastClassName?: string;

  /** Style applied to every toast */
  toastStyle?: CSSProperties;

  /** Class applied to the variant icon */
  iconClassName?: string;

  /** Class applied to the message line */
  messageClassName?: string;

  /** Class applied to the description line */
  descriptionClassName?: string;

  /** Class applied to the action button */
  actionClassName?: string;

  /** Class applied to the cancel button */
  cancelClassName?: string;

  /** Class applied to the dismiss button */
  closeClassName?: string;
}
