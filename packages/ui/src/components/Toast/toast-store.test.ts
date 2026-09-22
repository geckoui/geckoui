import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { toastStore } from "./toast-store";

/** Module singleton, so clear the queue between tests. */
function reset() {
  toastStore.getSnapshot().forEach((t) => toastStore.remove(t.id));
}

beforeEach(reset);
afterEach(reset);

describe("toastStore", () => {
  describe("pushing", () => {
    it("queues a toast and returns its id", () => {
      const id = toastStore.push("default", "Saved");

      expect(id).toBeTruthy();
      expect(toastStore.getSnapshot()).toHaveLength(1);
      expect(toastStore.getSnapshot()[0].message).toBe("Saved");
    });

    it("gives each toast a unique id", () => {
      expect(toastStore.push("default", "a")).not.toBe(toastStore.push("default", "b"));
    });

    it("honours an explicit id", () => {
      expect(toastStore.push("default", "a", { id: "mine" })).toBe("mine");
    });

    it("keeps insertion order", () => {
      const a = toastStore.push("default", "a");
      const b = toastStore.push("default", "b");

      expect(toastStore.getSnapshot().map((t) => t.id)).toEqual([a, b]);
    });

    it("notifies subscribers", () => {
      const listener = vi.fn();
      const unsubscribe = toastStore.subscribe(listener);

      toastStore.push("default", "a");

      expect(listener).toHaveBeenCalled();
      unsubscribe();
    });

    it("returns a stable empty array as the server snapshot", () => {
      // a fresh array each call makes React report an infinite loop risk
      expect(toastStore.getServerSnapshot()).toBe(toastStore.getServerSnapshot());
      expect(toastStore.getServerSnapshot()).toHaveLength(0);
    });
  });

  describe("replacing in place", () => {
    it("reuses the slot rather than stacking a second toast", () => {
      const id = toastStore.push("loading", "Uploading");
      toastStore.push("success", "Uploaded", { id });

      expect(toastStore.getSnapshot()).toHaveLength(1);
      expect(toastStore.getSnapshot()[0].variant).toBe("success");
      expect(toastStore.getSnapshot()[0].message).toBe("Uploaded");
    });

    it("keeps its position in the queue", () => {
      const first = toastStore.push("default", "first");
      const second = toastStore.push("default", "second");

      toastStore.push("success", "first again", { id: first });

      expect(toastStore.getSnapshot().map((t) => t.id)).toEqual([first, second]);
    });

    it("bumps the generation so the item restarts its timer", () => {
      const id = toastStore.push("loading", "Uploading");
      expect(toastStore.getSnapshot()[0].generation).toBe(0);

      toastStore.push("success", "Uploaded", { id });
      expect(toastStore.getSnapshot()[0].generation).toBe(1);
    });
  });

  describe("dismissing", () => {
    it("calls the registered handler rather than removing immediately", () => {
      const id = toastStore.push("default", "a");
      const dismiss = vi.fn();
      toastStore.registerDismiss(id, dismiss);

      toastStore.dismiss(id);

      expect(dismiss).toHaveBeenCalledTimes(1);
      // still queued, so the exit animation can play
      expect(toastStore.getSnapshot()).toHaveLength(1);
    });

    it("dismisses every toast when called with no id", () => {
      const a = toastStore.push("default", "a");
      const b = toastStore.push("default", "b");
      const dismissA = vi.fn();
      const dismissB = vi.fn();
      toastStore.registerDismiss(a, dismissA);
      toastStore.registerDismiss(b, dismissB);

      toastStore.dismiss();

      expect(dismissA).toHaveBeenCalledTimes(1);
      expect(dismissB).toHaveBeenCalledTimes(1);
    });

    it("marks the id dismissed so a promise follow-up can be suppressed", () => {
      const id = toastStore.push("loading", "Saving");
      toastStore.registerDismiss(id, () => toastStore.remove(id));

      toastStore.dismiss(id);

      expect(toastStore.isDismissed(id)).toBe(true);
    });

    it("clears the dismissed mark when the id is deliberately reused", () => {
      // your own code pushing to the id is an explicit request and must still show
      const id = toastStore.push("loading", "Saving");
      toastStore.registerDismiss(id, () => toastStore.remove(id));
      toastStore.dismiss(id);

      toastStore.push("success", "Saved", { id });

      expect(toastStore.isDismissed(id)).toBe(false);
      expect(toastStore.getSnapshot()).toHaveLength(1);
    });
  });

  describe("removing", () => {
    it("takes the toast out of the queue", () => {
      const id = toastStore.push("default", "a");

      toastStore.remove(id);

      expect(toastStore.getSnapshot()).toHaveLength(0);
    });

    it("ignores an unknown id", () => {
      toastStore.push("default", "a");

      toastStore.remove("nope");

      expect(toastStore.getSnapshot()).toHaveLength(1);
    });
  });
});
