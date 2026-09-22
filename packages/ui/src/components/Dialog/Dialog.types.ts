import type { FC, ReactNode } from "react";

export interface DialogContentProps extends DialogOptions {
  /**
   * Function to close the dialog.
   * In case you want to close the dialog programmatically.
   * */
  dismiss: () => void;

  /**
   * Whether this dialog is the topmost entry in the overlay stack.
   * Injected automatically by `GeckoUIProvider`; consumer code does not need to set this.
   */
  isTop?: boolean;
}

export interface ActionsArgs extends DialogContentProps {
  /**
   * Function to be prevented to close the dialog.
   * By default, the dialog will be closed after the action is executed.
   * You can prevent the dialog from closing by calling this function.
   *
   * @example
   * ```tsx
   * const handleConfirm = ({ preventDefault }) => {
   *  // Do something
   *  preventDefault();
   * };
   * */
  preventDefault: () => void;
}

export interface DialogOptions {
  /**
   * Content to be displayed in the confirm dialog.
   * */
  content?: ReactNode | FC<DialogContentProps>;

  /**
   * Additional class name for the confirm modal
   * */
  className?: string;

  /**
   * Dismiss the dialog on pressing the `Escape` key.
   * Default is `true`.
   * */
  dismissOnEscape?: boolean;

  /**
   * Dismiss the dialog on clicking outside the dialog.
   * Default is `true`.
   * */
  dismissOnOutsideClick?: boolean;

  /** Data attributes to be added to the dialog */
  [key: `data-${string}`]: string;
}

export interface DialogProps {
  /**
   * Open/Close the dialog
   * */
  open: boolean;

  /**
   * Callback fired when the dialog asks to be closed (Esc key or backdrop click).
   * */
  onClose?: () => void;

  /**
   * Content to be displayed inside the dialog.
   * */
  children?: ReactNode;

  /**
   * Additional class name for the dialog
   * */
  className?: string;

  /**
   * Dismiss the dialog on pressing the `Escape` key.
   * Default is `true`.
   * */
  dismissOnEscape?: boolean;

  /**
   * Dismiss the dialog on clicking the backdrop.
   * Clicks inside the dialog never dismiss it, including content rendered in a portal
   * such as a `Select` or `Menu` popup.
   * Default is `true`.
   * */
  dismissOnOutsideClick?: boolean;

  /** Data attributes to be added to the dialog */
  [key: `data-${string}`]: string;
}
