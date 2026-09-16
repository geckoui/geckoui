import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getZIndex, overlayStore } from "./overlay-store";

/** The store is a module singleton, so each test starts from an empty stack. */
function reset() {
  overlayStore.getSnapshot().forEach((entry) => overlayStore.remove(entry.id));
}

beforeEach(reset);
afterEach(() => {
  vi.restoreAllMocks();
  reset();
});

describe("overlayStore", () => {
  describe("pushing", () => {
    it("returns a unique id per overlay", () => {
      const a = overlayStore.pushDialog({});
      const b = overlayStore.pushDialog({});

      expect(a).not.toBe(b);
      expect(overlayStore.getSnapshot()).toHaveLength(2);
    });

    it("keeps overlays in the order they were opened", () => {
      const first = overlayStore.pushDrawer(null, {});
      const second = overlayStore.pushDialog({});

      expect(overlayStore.getSnapshot().map((e) => e.id)).toEqual([first, second]);
    });

    it("notifies subscribers", () => {
      const listener = vi.fn();
      const unsubscribe = overlayStore.subscribe(listener);

      overlayStore.pushDialog({});
      expect(listener).toHaveBeenCalled();

      unsubscribe();
    });

    it("stops notifying after unsubscribe", () => {
      const listener = vi.fn();
      overlayStore.subscribe(listener)();

      overlayStore.pushDialog({});

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("topmost", () => {
    it("is the most recent overlay when they are the same type", () => {
      overlayStore.pushDialog({});
      const second = overlayStore.pushDialog({});

      expect(overlayStore.getTopId()).toBe(second);
    });

    it("prefers a dialog over a drawer opened after it", () => {
      // dialogs always render above drawers, so the dialog owns Esc and click outside
      const dialog = overlayStore.pushDialog({});
      overlayStore.pushDrawer(null, {});

      expect(overlayStore.getTopId()).toBe(dialog);
    });

    it("can be narrowed to one type", () => {
      const dialog = overlayStore.pushDialog({});
      const drawer = overlayStore.pushDrawer(null, {});

      expect(overlayStore.getTopId("dialog")).toBe(dialog);
      expect(overlayStore.getTopId("drawer")).toBe(drawer);
    });

    it("ignores an overlay that has started closing", () => {
      const lower = overlayStore.pushDialog({});
      const upper = overlayStore.pushDialog({});

      overlayStore.markClosing(upper);

      // the one underneath must take over at once, not after the exit animation
      expect(overlayStore.getTopId()).toBe(lower);
    });

    it("is undefined when nothing is open", () => {
      expect(overlayStore.getTopId()).toBeUndefined();
    });
  });

  describe("dismissing", () => {
    it("calls the registered dismiss handler for a given id", () => {
      const id = overlayStore.pushDialog({});
      const dismiss = vi.fn();
      overlayStore.registerDismiss(id, dismiss);

      overlayStore.dismiss("dialog", id);

      expect(dismiss).toHaveBeenCalledTimes(1);
    });

    it("dismisses the topmost of a type when no id is given", () => {
      const first = overlayStore.pushDialog({});
      const second = overlayStore.pushDialog({});
      const dismissFirst = vi.fn();
      const dismissSecond = vi.fn();
      overlayStore.registerDismiss(first, dismissFirst);
      overlayStore.registerDismiss(second, dismissSecond);

      overlayStore.dismiss("dialog");

      expect(dismissSecond).toHaveBeenCalledTimes(1);
      expect(dismissFirst).not.toHaveBeenCalled();
    });

    it("never closes an overlay of another type", () => {
      // Dialog.dismiss() must not close a drawer, and the other way round
      const dialog = overlayStore.pushDialog({});
      const drawer = overlayStore.pushDrawer(null, {});
      const dismissDialog = vi.fn();
      const dismissDrawer = vi.fn();
      overlayStore.registerDismiss(dialog, dismissDialog);
      overlayStore.registerDismiss(drawer, dismissDrawer);

      overlayStore.dismiss("drawer");

      expect(dismissDrawer).toHaveBeenCalledTimes(1);
      expect(dismissDialog).not.toHaveBeenCalled();
    });

    it("does not remove the entry itself, so the exit animation can run", () => {
      const id = overlayStore.pushDialog({});
      overlayStore.registerDismiss(id, vi.fn());

      overlayStore.dismiss("dialog", id);

      expect(overlayStore.getSnapshot()).toHaveLength(1);
    });

    it("is a no-op when nothing is open", () => {
      expect(() => overlayStore.dismiss("dialog")).not.toThrow();
    });
  });

  describe("removing", () => {
    it("takes the overlay out of the stack", () => {
      const id = overlayStore.pushDialog({});

      overlayStore.remove(id);

      expect(overlayStore.getSnapshot()).toHaveLength(0);
    });

    it("ignores an unknown id", () => {
      overlayStore.pushDialog({});

      overlayStore.remove("does-not-exist");

      expect(overlayStore.getSnapshot()).toHaveLength(1);
    });
  });

  describe("hosts", () => {
    it("reports no active host before a provider registers", () => {
      expect(overlayStore.getActiveHost()).toBeNull();
    });

    it("makes the first registered host the active one", () => {
      const first = overlayStore.createHostId();
      const second = overlayStore.createHostId();

      const releaseFirst = overlayStore.registerHost(first);
      const releaseSecond = overlayStore.registerHost(second);

      // provider effects run child first, so the innermost provider owns the stack
      expect(overlayStore.getActiveHost()).toBe(first);

      releaseFirst();
      expect(overlayStore.getActiveHost()).toBe(second);

      releaseSecond();
      expect(overlayStore.getActiveHost()).toBeNull();
    });

    it("errors when an overlay is opened with no provider mounted", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      overlayStore.pushDialog({});

      expect(error).toHaveBeenCalledWith(expect.stringContaining("GeckoUIProvider"));
    });
  });

  describe("z-index", () => {
    it("puts every dialog above every drawer", () => {
      const drawer = overlayStore.getSnapshot();
      void drawer;
      overlayStore.pushDrawer(null, {});
      overlayStore.pushDialog({});
      const [first, second] = overlayStore.getSnapshot();

      expect(getZIndex(second, 1)).toBeGreaterThan(getZIndex(first, 0));
    });

    it("stacks later overlays of the same type above earlier ones", () => {
      overlayStore.pushDialog({});
      overlayStore.pushDialog({});
      const [first, second] = overlayStore.getSnapshot();

      expect(getZIndex(second, 1)).toBeGreaterThan(getZIndex(first, 0));
    });
  });
});
