import type { ReactNode } from "react";

import type { ToastOptions, ToastPromiseMessages } from "./Toast.types";
import { toastStore } from "./toast-store";

const resolve = <T,>(value: ReactNode | ((arg: T) => ReactNode), arg: T): ReactNode =>
  typeof value === "function" ? (value as (arg: T) => ReactNode)(arg) : value;

/**
 * Show a toast. Returns the id, which you can pass to `toast.dismiss(id)` or reuse
 * as `options.id` to replace the toast in place.
 *
 * Requires `<GeckoUIProvider>` to be mounted.
 *
 * @example
 * ```tsx
 * toast("Saved");
 * toast.success("Account created", { description: "Check your inbox." });
 * toast.error("Upload failed", { action: { label: "Retry", onClick: retry } });
 *
 * const id = toast.loading("Uploading…");
 * toast.success("Uploaded", { id });   // replaces the loading toast
 * ```
 */
function toast(message: ReactNode, options?: ToastOptions) {
  return toastStore.push("default", message, options);
}

toast.success = (message: ReactNode, options?: ToastOptions) =>
  toastStore.push("success", message, options);

toast.error = (message: ReactNode, options?: ToastOptions) =>
  toastStore.push("error", message, options);

toast.warning = (message: ReactNode, options?: ToastOptions) =>
  toastStore.push("warning", message, options);

toast.info = (message: ReactNode, options?: ToastOptions) =>
  toastStore.push("info", message, options);

/** Stays open until you replace or dismiss it. */
toast.loading = (message: ReactNode, options?: ToastOptions) =>
  toastStore.push("loading", message, { duration: Infinity, ...options });

/** Renders your own node with no toast chrome around it. */
toast.custom = (content: ReactNode, options?: ToastOptions) =>
  toastStore.push("default", content, options, true);

/**
 * Follows a promise, swapping the same toast through loading, success and error.
 *
 * Dismissing the loading toast cancels the follow-up: the success or error toast
 * will not appear over a dismissal. Calling `toast.success(msg, { id })` yourself
 * still shows it, since that is an explicit request.
 *
 * @example
 * ```tsx
 * toast.promise(saveUser(), {
 *   loading: "Saving…",
 *   success: (user) => `Saved ${user.name}`,
 *   error: "Could not save"
 * });
 * ```
 */
toast.promise = <T,>(
  promise: Promise<T>,
  messages: ToastPromiseMessages<T>,
  options?: ToastOptions
) => {
  const id = toastStore.push("loading", messages.loading, { duration: Infinity, ...options });

  promise
    .then((value) => {
      // dismissing the loading toast means "stop telling me about this"
      if (toastStore.isDismissed(id)) return;
      toastStore.push("success", resolve(messages.success, value), { ...options, id });
    })
    .catch((error: unknown) => {
      if (toastStore.isDismissed(id)) return;
      toastStore.push("error", resolve(messages.error, error), { ...options, id });
    });

  return promise;
};

/** Dismiss one toast, or every toast when called with no id. */
toast.dismiss = (id?: string) => toastStore.dismiss(id);

export { toast };
