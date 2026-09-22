import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DialogSurface } from "./DialogSurface";

const surface = () => document.querySelector(".GeckoUIDialog") as HTMLElement;
const backdrop = () => document.querySelector(".GeckoUIDialog__backdrop") as HTMLElement;
const panel = () => document.querySelector(".GeckoUIDialog__dialog") as HTMLElement;

/** The enter transition is driven by requestAnimationFrame. */
async function settle() {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

beforeEach(() => {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
});

afterEach(() => vi.useRealTimers());

describe("DialogSurface", () => {
  it("renders nothing when closed", () => {
    render(<DialogSurface open={false}>content</DialogSurface>);

    expect(surface()).toBeNull();
  });

  it("renders its children when open", () => {
    render(<DialogSurface open>content</DialogSurface>);

    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("marks the panel as a modal dialog", () => {
    render(<DialogSurface open>content</DialogSurface>);

    expect(panel()).toHaveAttribute("role", "dialog");
    expect(panel()).toHaveAttribute("aria-modal", "true");
  });

  describe("enter transition", () => {
    it("starts in the entering state so the CSS has a frame to animate from", () => {
      render(<DialogSurface open>content</DialogSurface>);

      expect(surface()).toHaveAttribute("data-state", "entering");
    });

    it("settles into the open state", async () => {
      render(<DialogSurface open>content</DialogSurface>);

      await settle();

      expect(surface()).toHaveAttribute("data-state", "open");
    });
  });

  describe("dismissing", () => {
    it("closes on a backdrop click", async () => {
      const onDismiss = vi.fn();
      render(
        <DialogSurface open onDismiss={onDismiss}>
          content
        </DialogSurface>
      );
      await settle();

      await userEvent.click(backdrop());

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("does not close when the content is clicked", async () => {
      // this was the bug: clicking inside the dialog dismissed it
      const onDismiss = vi.fn();
      render(
        <DialogSurface open onDismiss={onDismiss}>
          <button>inside</button>
        </DialogSurface>
      );
      await settle();

      await userEvent.click(screen.getByText("inside"));

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("does not close when a drag starts inside and ends on the backdrop", async () => {
      // selecting text and releasing outside must not count as a backdrop click
      const onDismiss = vi.fn();
      render(
        <DialogSurface open onDismiss={onDismiss}>
          <span>text</span>
        </DialogSurface>
      );
      await settle();

      await userEvent.pointer([
        { target: screen.getByText("text"), keys: "[MouseLeft>]" },
        { target: backdrop(), keys: "[/MouseLeft]" }
      ]);

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("can have backdrop dismissal turned off", async () => {
      const onDismiss = vi.fn();
      render(
        <DialogSurface open dismissOnOutsideClick={false} onDismiss={onDismiss}>
          content
        </DialogSurface>
      );
      await settle();

      await userEvent.click(backdrop());

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("closes on Escape", async () => {
      const onDismiss = vi.fn();
      render(
        <DialogSurface open onDismiss={onDismiss}>
          content
        </DialogSurface>
      );
      await settle();

      await userEvent.keyboard("{Escape}");

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("can have Escape turned off", async () => {
      const onDismiss = vi.fn();
      render(
        <DialogSurface open dismissOnEscape={false} onDismiss={onDismiss}>
          content
        </DialogSurface>
      );
      await settle();

      await userEvent.keyboard("{Escape}");

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("ignores Escape and backdrop clicks when it is not the topmost overlay", async () => {
      const onDismiss = vi.fn();
      render(
        <DialogSurface open isTop={false} onDismiss={onDismiss}>
          content
        </DialogSurface>
      );
      await settle();

      await userEvent.keyboard("{Escape}");
      await userEvent.click(backdrop());

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe("scroll lock", () => {
    it("locks the page while open", async () => {
      render(<DialogSurface open>content</DialogSurface>);
      await settle();

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("releases the page once it has finished closing", async () => {
      vi.useFakeTimers();
      const { rerender } = render(<DialogSurface open>content</DialogSurface>);
      act(() => {
        vi.advanceTimersByTime(50);
      });

      rerender(<DialogSurface open={false}>content</DialogSurface>);
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(document.body.style.overflow).not.toBe("hidden");
    });

    it("is still locked during the exit animation", () => {
      vi.useFakeTimers();
      const { rerender } = render(<DialogSurface open>content</DialogSurface>);
      act(() => {
        vi.advanceTimersByTime(50);
      });

      rerender(<DialogSurface open={false}>content</DialogSurface>);
      act(() => {
        vi.advanceTimersByTime(50);
      });

      // releasing early makes the page jump while the dialog is still fading
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("calls onExited once the close animation has finished", () => {
    vi.useFakeTimers();
    const onExited = vi.fn();
    const { rerender } = render(
      <DialogSurface open onExited={onExited}>
        content
      </DialogSurface>
    );
    act(() => {
      vi.advanceTimersByTime(50);
    });

    rerender(
      <DialogSurface open={false} onExited={onExited}>
        content
      </DialogSurface>
    );
    expect(onExited).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onExited).toHaveBeenCalledTimes(1);
  });
});
