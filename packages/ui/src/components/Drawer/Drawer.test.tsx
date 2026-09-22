import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Drawer from "./Drawer";

const panel = () => document.querySelector(".GeckoUIDrawer__drawer") as HTMLElement;
const backdrop = () => document.querySelector(".GeckoUIDrawer__backdrop") as HTMLElement;

async function settle() {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

beforeEach(() => {
  document.body.style.overflow = "";
});
afterEach(() => vi.useRealTimers());

describe("Drawer", () => {
  it("renders its children", () => {
    render(<Drawer open>panel content</Drawer>);

    expect(screen.getByText("panel content")).toBeInTheDocument();
  });

  it("marks the panel as a dialog", () => {
    render(<Drawer open>x</Drawer>);

    expect(panel()).toHaveAttribute("role", "dialog");
  });

  describe("open state", () => {
    it("is closed when open is false", async () => {
      render(<Drawer open={false}>x</Drawer>);
      await settle();

      expect(panel()).toHaveAttribute("data-state", "closed");
    });

    it("opens after a frame, so the CSS has a closed frame to animate from", async () => {
      // mounted already open, as Drawer.show() does: without the delay there is no entrance
      render(<Drawer open>x</Drawer>);

      expect(panel()).toHaveAttribute("data-state", "closed");

      await settle();
      expect(panel()).toHaveAttribute("data-state", "open");
    });
  });

  describe("placement", () => {
    it.each(["left", "right", "top", "bottom"] as const)("exposes %s", async (placement) => {
      render(
        <Drawer open placement={placement}>
          x
        </Drawer>
      );
      await settle();

      expect(panel()).toHaveAttribute("data-placement", placement);
    });

    it("defaults to right", async () => {
      render(<Drawer open>x</Drawer>);
      await settle();

      expect(panel()).toHaveAttribute("data-placement", "right");
    });

    it("re-enters through the closed state when placement changes", async () => {
      // otherwise the old transform is carried to the new anchor and it slides
      // in from the wrong edge
      const { rerender } = render(
        <Drawer open placement="left">
          x
        </Drawer>
      );
      await settle();
      expect(panel()).toHaveAttribute("data-state", "open");

      rerender(
        <Drawer open placement="right">
          x
        </Drawer>
      );

      expect(panel()).toHaveAttribute("data-state", "closed");
      expect(panel()).toHaveAttribute("data-placement", "right");

      await settle();
      expect(panel()).toHaveAttribute("data-state", "open");
    });

    it("suppresses the transition on the frame it settles into a new placement", async () => {
      const { rerender } = render(
        <Drawer open placement="left">
          x
        </Drawer>
      );
      await settle();

      rerender(
        <Drawer open placement="right">
          x
        </Drawer>
      );

      expect(panel()).toHaveAttribute("data-instant");

      await settle();
      expect(panel()).not.toHaveAttribute("data-instant");
    });
  });

  describe("dismissing", () => {
    it("closes on a backdrop click", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose}>
          x
        </Drawer>
      );
      await settle();

      await userEvent.click(backdrop());

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes on Escape", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose}>
          x
        </Drawer>
      );
      await settle();

      await userEvent.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("can have Escape turned off", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open dismissOnEscape={false} onClose={onClose}>
          x
        </Drawer>
      );
      await settle();

      await userEvent.keyboard("{Escape}");

      expect(onClose).not.toHaveBeenCalled();
    });

    it("does not fire Escape while closed", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open={false} onClose={onClose}>
          x
        </Drawer>
      );
      await settle();

      await userEvent.keyboard("{Escape}");

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("scroll lock", () => {
    it("locks the page while open", async () => {
      render(<Drawer open>x</Drawer>);
      await settle();

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("does not lock when the backdrop is click-through", async () => {
      // allowClickOutside exists to leave the page usable, so locking would contradict it
      render(
        <Drawer open allowClickOutside>
          x
        </Drawer>
      );
      await settle();

      expect(document.body.style.overflow).not.toBe("hidden");
    });

    it("stays locked through the slide out", async () => {
      vi.useFakeTimers();
      const { rerender } = render(<Drawer open>x</Drawer>);
      act(() => {
        vi.advanceTimersByTime(50);
      });

      rerender(<Drawer open={false}>x</Drawer>);
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("releases once the slide out has finished", async () => {
      vi.useFakeTimers();
      const { rerender } = render(<Drawer open>x</Drawer>);
      act(() => {
        vi.advanceTimersByTime(50);
      });

      rerender(<Drawer open={false}>x</Drawer>);
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(document.body.style.overflow).not.toBe("hidden");
    });
  });

  describe("backdrop", () => {
    it("is visible when open", async () => {
      render(<Drawer open>x</Drawer>);
      await settle();

      expect(backdrop()).toHaveAttribute("data-state", "visible");
    });

    it("is hidden when hideBackdrop is set", async () => {
      render(
        <Drawer open hideBackdrop>
          x
        </Drawer>
      );
      await settle();

      expect(backdrop()).toHaveAttribute("data-state", "hidden");
    });

    it("is marked click-through when allowClickOutside is set", async () => {
      render(
        <Drawer open allowClickOutside>
          x
        </Drawer>
      );
      await settle();

      expect(backdrop()).toHaveAttribute("data-clickthrough");
    });
  });
});
