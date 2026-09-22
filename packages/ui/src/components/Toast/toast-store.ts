import type { ReactNode } from "react";

import type { ToastOptions, ToastRecord, ToastVariant } from "./Toast.types";

let counter = 0;
let toasts: ToastRecord[] = [];

const listeners = new Set<() => void>();

function notify() {
  toasts = [...toasts];
  listeners.forEach((listener) => listener());
}

export const toastStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): ToastRecord[] {
    return toasts;
  },

  getServerSnapshot(): ToastRecord[] {
    return EMPTY;
  },

  /** Adds a toast, or replaces one in place when the id already exists. */
  push(variant: ToastVariant, message: ReactNode, options: ToastOptions = {}, custom = false) {
    const id = options.id ?? `toast-${++counter}`;
    const index = toasts.findIndex((t) => t.id === id);
    const generation = index === -1 ? 0 : toasts[index].generation + 1;
    const record: ToastRecord = {
      id,
      variant,
      message,
      options: { ...options, id },
      custom,
      generation
    };

    if (index === -1) toasts.push(record);
    else toasts[index] = record;

    // an id can be reused for a later, unrelated toast
    dismissed.delete(id);

    notify();
    return id;
  },

  /**
   * True when this id was dismissed and has not been used again since. Lets
   * `toast.promise` finish quietly instead of reappearing over a dismissal.
   */
  isDismissed(id: string) {
    return dismissed.has(id);
  },

  /** Removes the toast from the list. The item calls this after its exit animation. */
  remove(id: string) {
    const toast = toasts.find((t) => t.id === id);
    if (!toast) return;

    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },

  /** Asks a toast to close. Without an id, every toast closes. */
  dismiss(id?: string) {
    const targets = id === undefined ? [...dismissers.keys()] : [id];
    targets.forEach((target) => {
      dismissed.add(target);
      dismissers.get(target)?.();
    });
  },

  registerDismiss(id: string, fn: () => void): () => void {
    dismissers.set(id, fn);
    return () => {
      dismissers.delete(id);
    };
  }
};

const EMPTY: ToastRecord[] = [];
const dismissers = new Map<string, () => void>();
const dismissed = new Set<string>();
