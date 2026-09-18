import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Popover, PopoverContent, PopoverTrigger, usePopover } from ".";
import { Button } from "../Button";

const content = () => document.querySelector<HTMLElement>(".GeckoUIPopover__content");
const trigger = (name = "Filters") => screen.getByRole("button", { name });

function Basic({ children, panel, ...rest }: Record<string, unknown> = {}) {
  return (
    <Popover {...rest}>
      <PopoverTrigger>
        <Button>Filters</Button>
      </PopoverTrigger>
      <PopoverContent>{(panel as never) ?? "Panel content"}</PopoverContent>
      {children as never}
    </Popover>
  );
}

describe("Popover", () => {
  describe("opening and closing", () => {
    it("starts closed", () => {
      render(<Basic />);

      expect(content()).toBeNull();
    });

    it("opens on click and closes on a second click", async () => {
      render(<Basic />);

      await userEvent.click(trigger());
      expect(content()).toHaveTextContent("Panel content");

      await userEvent.click(trigger());
      expect(content()).toBeNull();
    });

    it("honours defaultOpen", () => {
      render(<Basic defaultOpen />);

      expect(content()).toBeInTheDocument();
    });

    it("reports every change", async () => {
      const onOpenChange = vi.fn();
      render(<Basic onOpenChange={onOpenChange} />);

      await userEvent.click(trigger());
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      await userEvent.click(trigger());
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it("does not open when disabled", async () => {
      const onOpenChange = vi.fn();
      render(<Basic disabled onOpenChange={onOpenChange} />);

      await userEvent.click(trigger());

      expect(content()).toBeNull();
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("stays shut when disabled even with defaultOpen", () => {
      render(<Basic disabled defaultOpen />);

      expect(content()).toBeNull();
    });
  });

  describe("dismissing", () => {
    it("closes when something outside is clicked", async () => {
      render(
        <div>
          <button type="button">outside</button>
          <Basic />
        </div>
      );

      await userEvent.click(trigger());
      await userEvent.click(trigger("outside"));

      await waitFor(() => expect(content()).toBeNull());
    });

    it("stays open when the panel itself is clicked", async () => {
      render(<Basic panel={<p>Panel content</p>} />);

      await userEvent.click(trigger());
      await userEvent.click(screen.getByText("Panel content"));

      expect(content()).toBeInTheDocument();
    });

    it("keeps itself open when dismissOnOutsideClick is off", async () => {
      render(
        <div>
          <button type="button">outside</button>
          <Basic dismissOnOutsideClick={false} />
        </div>
      );

      await userEvent.click(trigger());
      await userEvent.click(trigger("outside"));

      expect(content()).toBeInTheDocument();
    });

    it("closes on Escape", async () => {
      render(<Basic />);

      await userEvent.click(trigger());
      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(content()).toBeNull());
    });

    it("closes on Escape from inside a text field", async () => {
      render(<Basic panel={<input aria-label="search" />} />);

      await userEvent.click(trigger());
      await userEvent.type(screen.getByLabelText("search"), "abc");
      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(content()).toBeNull());
    });

    it("ignores Escape when dismissOnEscape is off", async () => {
      render(<Basic dismissOnEscape={false} />);

      await userEvent.click(trigger());
      await userEvent.keyboard("{Escape}");

      expect(content()).toBeInTheDocument();
    });
  });

  describe("focus", () => {
    it("moves focus into the panel when it opens", async () => {
      render(<Basic panel={<input aria-label="search" />} />);

      await userEvent.click(trigger());

      expect(screen.getByLabelText("search")).toHaveFocus();
    });

    it("focuses the panel itself when there is nothing focusable inside", async () => {
      render(<Basic />);

      await userEvent.click(trigger());

      expect(content()).toHaveFocus();
    });

    it("hands focus back to the trigger on Escape", async () => {
      render(<Basic panel={<input aria-label="search" />} />);

      await userEvent.click(trigger());
      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(trigger()).toHaveFocus());
    });
  });

  describe("controlled", () => {
    it("follows the open it is given", async () => {
      const onOpenChange = vi.fn();
      render(<Basic open={false} onOpenChange={onOpenChange} />);

      await userEvent.click(trigger());

      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(content()).toBeNull();
    });

    it("opens when the value changes from outside", async () => {
      function Controlled() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button type="button" onClick={() => setOpen(true)}>
              outside
            </button>
            <Basic open={open} onOpenChange={setOpen} />
          </>
        );
      }

      render(<Controlled />);
      await userEvent.click(trigger("outside"));

      expect(content()).toBeInTheDocument();
    });
  });

  describe("the trigger", () => {
    it("uses the child as the trigger rather than wrapping it", () => {
      render(<Basic />);

      expect(trigger().tagName).toBe("BUTTON");
      expect(trigger()).toHaveClass("GeckoUIButton");
    });

    it("reports the popover state", async () => {
      render(<Basic />);

      expect(trigger()).toHaveAttribute("aria-expanded", "false");
      expect(trigger()).toHaveAttribute("aria-haspopup", "dialog");
      expect(trigger()).toHaveAttribute("data-state", "closed");

      await userEvent.click(trigger());

      expect(trigger()).toHaveAttribute("aria-expanded", "true");
      expect(trigger()).toHaveAttribute("data-state", "open");
    });

    it("keeps the child's own click handler", async () => {
      const onClick = vi.fn();

      render(
        <Popover>
          <PopoverTrigger>
            <Button onClick={onClick}>Filters</Button>
          </PopoverTrigger>
          <PopoverContent>Panel content</PopoverContent>
        </Popover>
      );

      await userEvent.click(trigger());

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(content()).toBeInTheDocument();
    });
  });

  describe("the panel", () => {
    it("is a dialog", async () => {
      render(<Basic />);

      await userEvent.click(trigger());

      expect(content()).toHaveAttribute("role", "dialog");
    });

    it("takes a custom class", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger>
            <Button>Filters</Button>
          </PopoverTrigger>
          <PopoverContent className="custom">Panel content</PopoverContent>
        </Popover>
      );

      expect(content()).toHaveClass("GeckoUIPopover__content", "custom");
    });

    it("renders no arrow by default", () => {
      render(<Basic defaultOpen />);

      expect(document.querySelector(".GeckoUIPopover__arrow")).toBeNull();
    });

    it("renders an arrow when asked", () => {
      render(<Basic defaultOpen arrow />);

      expect(document.querySelector(".GeckoUIPopover__arrow")).toBeInTheDocument();
    });
  });

  describe("usePopover", () => {
    it("throws outside a Popover", () => {
      const Outside = () => {
        usePopover();
        return null;
      };
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<Outside />)).toThrow("usePopover must be used within a Popover");

      spy.mockRestore();
    });

    it("closes the popover from inside it", async () => {
      const Cancel = () => {
        const { close } = usePopover();
        return <Button onClick={close}>Cancel</Button>;
      };

      render(<Basic defaultOpen panel={<Cancel />} />);

      await userEvent.click(trigger("Cancel"));

      expect(content()).toBeNull();
      await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it("reports whether it is open", async () => {
      const Readout = () => {
        const { open } = usePopover();
        return <p>state: {open ? "open" : "closed"}</p>;
      };

      render(<Basic>{<Readout />}</Basic>);
      expect(screen.getByText("state: closed")).toBeInTheDocument();

      await userEvent.click(trigger());
      expect(screen.getByText("state: open")).toBeInTheDocument();
    });
  });
});
