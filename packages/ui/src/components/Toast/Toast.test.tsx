import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Toaster } from "./Toaster";
import { toast } from "./toast";
import { toastStore } from "./toast-store";

beforeEach(() => {
  toastStore.getSnapshot().forEach((t) => toastStore.remove(t.id));
});

async function settle() {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

const toastEl = () => document.querySelector(".GeckoUIToast") as HTMLElement;

/** jsdom has no pointer capture, so the calls it would make are stubbed out. */
async function swipeAway(el: HTMLElement, to: { x?: number; y?: number }) {
  el.setPointerCapture = () => {};
  el.releasePointerCapture = () => {};

  fireEvent.pointerDown(el, { clientX: 0, clientY: 0, pointerId: 1 });
  fireEvent.pointerMove(el, { clientX: to.x ?? 0, clientY: to.y ?? 0, pointerId: 1 });
  fireEvent.pointerUp(el, { clientX: to.x ?? 0, clientY: to.y ?? 0, pointerId: 1 });

  await act(async () => {
    await new Promise((r) => setTimeout(r, 400));
  });
}

async function show(fn: () => void) {
  render(<Toaster />);
  act(fn);
  await settle();
}

describe("toast", () => {
  it("renders a message", async () => {
    await show(() => toast("Saved"));

    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("renders a description", async () => {
    await show(() => toast.success("Account created", { description: "Check your inbox." }));

    expect(screen.getByText("Check your inbox.")).toBeInTheDocument();
  });

  it("renders the message in a div, so arbitrary nodes are valid markup", async () => {
    // message is a ReactNode: a p cannot contain a div or another p
    await show(() =>
      toast(
        <div>
          <strong>Title</strong>
          <p>Body</p>
        </div>
      )
    );

    const message = document.querySelector(".GeckoUIToast__message") as HTMLElement;
    expect(message.tagName).toBe("DIV");
  });

  describe("variants", () => {
    it.each(["success", "error", "warning", "info"] as const)("marks %s", async (variant) => {
      await show(() => toast[variant]("x"));

      expect(document.querySelector(".GeckoUIToast")).toHaveAttribute("data-variant", variant);
    });

    it("announces errors assertively and everything else politely", async () => {
      await show(() => toast.error("Broke"));
      expect(document.querySelector(".GeckoUIToast")).toHaveAttribute("aria-live", "assertive");
      expect(document.querySelector(".GeckoUIToast")).toHaveAttribute("role", "alert");
    });

    it("uses status and polite for a plain toast", async () => {
      await show(() => toast("Saved"));

      expect(document.querySelector(".GeckoUIToast")).toHaveAttribute("aria-live", "polite");
      expect(document.querySelector(".GeckoUIToast")).toHaveAttribute("role", "status");
    });
  });

  describe("positions", () => {
    it("defaults to bottom-right", async () => {
      await show(() => toast("x"));

      expect(document.querySelector(".GeckoUIToaster")).toHaveAttribute(
        "data-position",
        "bottom-right"
      );
    });

    it("honours a per-toast position", async () => {
      await show(() => toast("x", { position: "top-left" }));

      expect(document.querySelector(".GeckoUIToaster")).toHaveAttribute(
        "data-position",
        "top-left"
      );
    });
  });

  describe("actions", () => {
    it("renders an action button and calls it", async () => {
      const onClick = vi.fn();
      await show(() => toast("Deleted", { action: { label: "Undo", onClick } }));

      await userEvent.click(screen.getByRole("button", { name: "Undo" }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("renders no close button by default", async () => {
      await show(() => toast("x"));

      expect(screen.queryByLabelText("Dismiss notification")).not.toBeInTheDocument();
    });

    it("renders a close button when asked", async () => {
      await show(() => toast("x", { closeButton: true }));

      expect(screen.getByLabelText("Dismiss notification")).toBeInTheDocument();
    });

    it("closes the toast when the close button is pressed", async () => {
      await show(() => toast("Saved", { closeButton: true }));

      await userEvent.click(screen.getByLabelText("Dismiss notification"));
      await act(async () => {
        await new Promise((r) => setTimeout(r, 400));
      });

      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    });
  });

  describe("replacing in place", () => {
    it("swaps a loading toast for a success one without stacking", async () => {
      render(<Toaster />);
      let id = "";
      act(() => {
        id = toast.loading("Uploading");
      });
      await settle();

      act(() => {
        toast.success("Uploaded", { id });
      });
      await settle();

      expect(screen.getByText("Uploaded")).toBeInTheDocument();
      expect(screen.queryByText("Uploading")).not.toBeInTheDocument();
      expect(document.querySelectorAll(".GeckoUIToast")).toHaveLength(1);
    });
  });

  describe("promise", () => {
    it("shows the success message when it resolves", async () => {
      render(<Toaster />);
      act(() => {
        void toast.promise(Promise.resolve("ok"), {
          loading: "Saving",
          success: "Saved",
          error: "Failed"
        });
      });

      await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
    });

    it("shows the error message when it rejects", async () => {
      render(<Toaster />);
      act(() => {
        void toast
          .promise(Promise.reject(new Error("no")), {
            loading: "Saving",
            success: "Saved",
            error: "Failed"
          })
          .catch(() => {});
      });

      await waitFor(() => expect(screen.getByText("Failed")).toBeInTheDocument());
    });

    it("does not reappear after the loading toast is dismissed", async () => {
      // dismissing means stop telling me about this, so the follow-up is cancelled
      render(<Toaster />);
      let resolve: (v: string) => void = () => {};
      const promise = new Promise<string>((r) => (resolve = r));

      act(() => {
        void toast.promise(promise, { loading: "Saving", success: "Saved", error: "Failed" });
      });
      await settle();

      act(() => toast.dismiss());
      await act(async () => {
        await new Promise((r) => setTimeout(r, 400));
      });

      await act(async () => {
        resolve("ok");
        await promise;
      });

      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    });
  });

  describe("dismissing", () => {
    it("removes the toast", async () => {
      await show(() => toast("Saved"));

      act(() => toast.dismiss());
      await act(async () => {
        await new Promise((r) => setTimeout(r, 400));
      });

      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    });
  });

  describe("custom", () => {
    it("renders the node without toast chrome", async () => {
      await show(() => toast.custom(<div data-testid="mine">mine</div>));

      expect(screen.getByTestId("mine")).toBeInTheDocument();
      expect(document.querySelector(".GeckoUIToast")).toBeNull();
    });

    it("can still be swiped away, because it is still a toast", async () => {
      await show(() => toast.custom(<div data-testid="mine">mine</div>));

      const custom = document.querySelector(".GeckoUIToast__custom") as HTMLElement;

      expect(custom).toHaveAttribute("data-swipe", "both");

      await swipeAway(custom, { x: 120 });

      expect(screen.queryByTestId("mine")).not.toBeInTheDocument();
    });
  });

  describe("swiping", () => {
    it("goes either way out from where it sits", async () => {
      await show(() => toast("Saved"));

      expect(toastEl()).toHaveAttribute("data-swipe", "both");

      await swipeAway(toastEl(), { y: 120 });

      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    });

    it("has one way out when it is centred", async () => {
      render(<Toaster position="bottom-center" />);
      act(() => toast("Saved"));
      await settle();

      expect(toastEl()).toHaveAttribute("data-swipe", "y");
    });

    it("springs back from a drag that did not go far enough", async () => {
      await show(() => toast("Saved"));

      const el = toastEl();

      // under both the distance and the flick floor, however fast the events arrive
      fireEvent.pointerDown(el, { clientX: 0, clientY: 0, pointerId: 1 });
      fireEvent.pointerMove(el, { clientX: 15, clientY: 0, pointerId: 1 });
      fireEvent.pointerUp(el, { clientX: 15, clientY: 0, pointerId: 1 });
      await settle();

      expect(screen.getByText("Saved")).toBeInTheDocument();
      expect(el.style.transform).toBe("");
    });

    it("does not move when dragged back into the screen", async () => {
      await show(() => toast("Saved"));

      const el = toastEl();

      fireEvent.pointerDown(el, { clientX: 100, clientY: 100, pointerId: 1 });
      fireEvent.pointerMove(el, { clientX: 0, clientY: 100, pointerId: 1 });
      await settle();

      expect(el.style.transform).toBe("");
    });

    it("stays put when it was told not to be swiped", async () => {
      await show(() => toast("Saved", { dismissible: false }));

      expect(toastEl()).not.toHaveAttribute("data-swipe");

      await swipeAway(toastEl(), { x: 120 });

      expect(screen.getByText("Saved")).toBeInTheDocument();
    });

    it("leaves the buttons inside it alone", async () => {
      // the drag captures the pointer, which would otherwise take the press away from the
      // button it started on and the click would never land
      const onClick = vi.fn();

      await show(() => toast("Saved", { closeButton: true, action: { label: "Undo", onClick } }));

      await userEvent.click(screen.getByRole("button", { name: "Undo" }));

      expect(onClick).toHaveBeenCalled();
    });

    it("closes from the dismiss button", async () => {
      await show(() => toast("Saved", { duration: Infinity, closeButton: true }));

      await userEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
      await act(async () => {
        await new Promise((r) => setTimeout(r, 400));
      });

      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    });

    it("never grows a dismiss button on its own", async () => {
      // whether one is shown is the caller's to decide, even on a toast that never leaves
      await show(() => toast("Saved", { duration: Infinity }));

      expect(
        screen.queryByRole("button", { name: "Dismiss notification" })
      ).not.toBeInTheDocument();
    });
  });
});
