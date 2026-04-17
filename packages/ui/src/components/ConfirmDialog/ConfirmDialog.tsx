import { useCallback, useEffect, useState } from "react";

import { usePreventDefault } from "../../hooks";
import { isAsyncFn } from "../../utils";
import { classNames } from "../../utils/classNames";
import { Dialog } from "../Dialog";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import { LoadingButton } from "../LoadingButton";
import type { ConfirmDialogContentProps, ConfirmDialogOptions } from "./ConfirmDialog.types";

function ConfirmDialogContent({
  confirmButtonLabel = "Ok",
  cancelButtonLabel = "Cancel",
  title,
  content,
  titleClassName,
  contentClassName,
  dismiss,
  onConfirm,
  onCancel
}: ConfirmDialogContentProps) {
  const [cancelLoading, setCancelLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { preventDefault, attachPreventDefault } = usePreventDefault();

  const handleConfirm = useCallback(async () => {
    const isAsync = isAsyncFn(onConfirm);
    if (isAsync) {
      setConfirmLoading(true);
    }

    await onConfirm?.({ preventDefault, dismiss });

    setConfirmLoading(false);

    attachPreventDefault(dismiss);
  }, [attachPreventDefault, dismiss, onConfirm, preventDefault]);

  const handleCancel = () => {
    const isAsync = isAsyncFn(onCancel);

    if (isAsync) {
      setCancelLoading(true);
    }

    onCancel?.({ preventDefault, dismiss });

    setCancelLoading(false);

    attachPreventDefault(dismiss);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = document.activeElement;

      if (e.key === "Enter") {
        // Prevent default if the active element is a tabbable a.k.a focusable element
        if (el && el instanceof HTMLElement && el.tabIndex > -1) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        handleConfirm();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      return document.removeEventListener("keydown", onKeyDown);
    };
  }, [handleConfirm]);

  return (
    <>
      <div className={classNames("GeckoUIConfirmDialog__title", titleClassName)}>
        <DynamicComponentRenderer component={title} />
      </div>
      <div className={classNames("GeckoUIConfirmDialog__content", contentClassName)}>
        <DynamicComponentRenderer component={content} dismiss={dismiss} />
      </div>
      <div className="GeckoUIConfirmDialog__actions">
        <LoadingButton
          className={classNames("GeckoUIConfirmDialog__cancel-button")}
          onClick={handleCancel}
          size="md"
          variant="outlined"
          loading={cancelLoading}
          disabled={confirmLoading}>
          {cancelButtonLabel}
        </LoadingButton>
        <LoadingButton
          className={classNames("GeckoUIConfirmDialog__confirm-button")}
          onClick={handleConfirm}
          size="md"
          loading={confirmLoading}
          disabled={cancelLoading}>
          {confirmButtonLabel}
        </LoadingButton>
      </div>
    </>
  );
}

export const show = (options: ConfirmDialogOptions) => {
  Dialog.show({
    dismissOnEsc: true,
    dismissOnOutsideClick: true,
    ...options,
    className: classNames("GeckoUIConfirmDialog__dialog", options.className),
    content: ({ dismiss }) => <ConfirmDialogContent {...options} dismiss={dismiss} />
  });
};

/**
 * ConfirmDialog is a flexible confirmation modal component that prompts users for action validation.
 * Built on top of the Dialog component, it provides a standardized interface for displaying
 * confirmation prompts with customizable content, buttons, and behavior.
 *
 * @example
 * Delete confirmation with simple text:
 *
 * ```tsx
 * ConfirmDialog.show({
 *   title: "Delete Account",
 *   content: "Are you sure you want to permanently delete your account? This action cannot be undone.",
 *   confirmButtonLabel: "Delete",
 *   cancelButtonLabel: "Keep Account",
 *   onConfirm: async () => {
 *     showSuccessNotification("Account deleted successfully");
 *   },
 *   onCancel: () => {
 *     trackAnalytics("account_deletion_cancelled");
 *   }
 * });
 * ```
 *
 * @example
 * By default, if you pass an async function to `onConfirm` or `onCancel`, the dialog
 * will show a loading state on the respective button until the promise resolves.
 *
 * ```tsx
 * ConfirmDialog.show({
 *   title: "Save Changes",
 *   content: "Would you like to save your changes before leaving?",
 *   confirmButtonLabel: "Save & Exit",
 *   cancelButtonLabel: "Discard",
 *   className: "max-w-[500px]",
 *   onConfirm: async () => {
 *     try {
 *       await saveFormData();
 *       router.push("/dashboard");
 *     } catch (error) {
 *       showError("Failed to save changes");
 *       dismiss();
 *     }
 *   }
 * });
 * ```
 *
 * @example
 * Rich content with custom component:
 *
 * ```tsx
 * ConfirmDialog.show({
 *   title: "Transfer Ownership",
 *   content: ({ dismiss }) => (
 *     <div className="space-y-4">
 *       <p>Transfer project ownership to:</p>
 *       <UserSelector onSelect={setSelectedUser} />
 *       <Button variant="link" onClick={dismiss}>
 *         Cancel transfer
 *       </Button>
 *     </div>
 *   ),
 *   confirmButtonLabel: "Transfer Now",
 *   cancelButtonLabel: "Go Back",
 *   titleClassName: "text-warning",
 *   contentClassName: "min-h-[200px]",
 *   onConfirm: ({ dismiss }) => {
 *     performTransfer();
 *     dismiss();
 *   }
 * });
 * ```
 *
 * @example
 * Programmatic dismissal from external code:
 *
 * ```tsx
 * // Show dialog
 * ConfirmDialog.show({
 *   title: "Processing",
 *   content: "Please wait while we process your request..."
 * });
 *
 * // Close from anywhere in your app
 * ConfirmDialog.dismiss();
 * ```
 */
const ConfirmDialog = { show, dismiss: Dialog.dismiss };

export default ConfirmDialog;
