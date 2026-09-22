import type { FC, ReactNode } from "react";

import { type DialogOptions } from "../Dialog";

export interface ConfirmDialogContentProps extends ConfirmDialogOptions {
  /**
   * Function to close the dialog.
   * In case you want to close the dialog programmatically.
   * */
  dismiss: () => void;

  /**
   * Whether this dialog is the topmost entry in the overlay stack.
   * Injected automatically by `GeckoUIProvider`; consumer code does not need to set this.
   * */
  isTop?: boolean;
}

export interface ConfirmDialogActionsArgs extends ConfirmDialogContentProps {
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

export interface ConfirmDialogOptions extends Omit<DialogOptions, "content" | "className"> {
  /**
   * Title of the confirm dialog
   * */
  title?: string;

  /**
   * Content to be displayed in the confirm dialog.
   * */
  content?: ReactNode | FC<ConfirmDialogContentProps>;

  /**
   * Label for the  confirm button.
   * */
  confirmButtonLabel?: string;

  /**
   * Label for the cancel button.
   * */
  cancelButtonLabel?: string;

  /**
   * Additional class name for the confirm modal
   * */
  className?: string;

  /**
   * Additional class name for the title
   * */
  titleClassName?: string;

  /**
   * Additional class name for the content
   * */
  contentClassName?: string;

  /**
   * Optional function to be called when the user confirms the action in the dialog.
   * */
  onConfirm?: (e: ConfirmDialogActionsArgs) => void;

  /**
   * Optional function to be called when the user cancel the action in the dialog.
   * */
  onCancel?: (e: ConfirmDialogActionsArgs) => void;
}
