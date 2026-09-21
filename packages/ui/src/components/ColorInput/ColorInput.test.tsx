import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import ColorInput from "./ColorInput";

/* The trigger by class: once the panel is open there are swatch buttons in the tree too */
const field = () => document.querySelector(".GeckoUIColorInput") as HTMLButtonElement;
const panel = () => screen.queryByRole("dialog", { name: "Colour picker" });

describe("ColorInput", () => {
  describe("the field", () => {
    it("shows the colour it was given", () => {
      render(<ColorInput defaultValue="#3b82f6" />);

      expect(screen.getByText("#3b82f6")).toBeInTheDocument();
    });

    it("shows the placeholder when there is nothing to show", () => {
      render(<ColorInput value="" placeholder="Pick one" />);

      expect(screen.getByText("Pick one")).toBeInTheDocument();
    });

    it("shows the placeholder when the value means nothing", () => {
      render(<ColorInput value="nonsense" placeholder="Pick one" />);

      expect(screen.getByText("Pick one")).toBeInTheDocument();
    });
  });

  describe("opening", () => {
    it("opens on a click and closes on another", async () => {
      render(<ColorInput defaultValue="#3b82f6" />);

      await userEvent.click(field());
      expect(panel()).toBeInTheDocument();

      await userEvent.click(field());
      expect(panel()).not.toBeInTheDocument();
    });

    it("closes on Escape and puts focus back", async () => {
      render(<ColorInput defaultValue="#3b82f6" />);

      await userEvent.click(field());
      await userEvent.keyboard("{Escape}");

      expect(panel()).not.toBeInTheDocument();
    });

    it("closes on a click outside", async () => {
      render(
        <>
          <ColorInput defaultValue="#3b82f6" />
          <p>Elsewhere</p>
        </>
      );

      await userEvent.click(field());
      expect(panel()).toBeInTheDocument();

      await userEvent.click(screen.getByText("Elsewhere"));
      expect(panel()).not.toBeInTheDocument();
    });

    it("says what it opens", async () => {
      render(<ColorInput defaultValue="#3b82f6" />);

      expect(field()).toHaveAttribute("aria-haspopup", "dialog");
      expect(field()).toHaveAttribute("aria-expanded", "false");

      await userEvent.click(field());

      expect(field()).toHaveAttribute("aria-expanded", "true");
    });

    it("reports opening and closing", async () => {
      const onOpenChange = vi.fn();

      render(<ColorInput defaultValue="#3b82f6" onOpenChange={onOpenChange} />);

      await userEvent.click(field());
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      await userEvent.click(field());
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });
  });

  describe("when it cannot be used", () => {
    it("does not open while read only", async () => {
      render(<ColorInput defaultValue="#3b82f6" readOnly />);

      await userEvent.click(field());

      expect(panel()).not.toBeInTheDocument();
    });

    it("does not say it opens anything while read only", () => {
      render(<ColorInput defaultValue="#3b82f6" readOnly />);

      expect(field()).not.toHaveAttribute("aria-haspopup");
      expect(field()).not.toHaveAttribute("aria-expanded");
    });

    it("still shows the value while read only", () => {
      render(<ColorInput defaultValue="#3b82f6" readOnly />);

      expect(screen.getByText("#3b82f6")).toBeInTheDocument();
    });

    it("does not open while disabled", async () => {
      render(<ColorInput defaultValue="#3b82f6" disabled />);

      await userEvent.click(field());

      expect(panel()).not.toBeInTheDocument();
      expect(field()).toBeDisabled();
    });
  });

  describe("picking", () => {
    it("reports what was picked", async () => {
      const onChange = vi.fn();

      render(<ColorInput defaultValue="#ff0000" swatches={["#0000ff"]} onChange={onChange} />);

      await userEvent.click(field());
      await userEvent.click(screen.getByRole("button", { name: "#0000ff" }));

      expect(onChange).toHaveBeenLastCalledWith("#0000ff");
    });

    it("holds its own value when it is not given one", async () => {
      render(<ColorInput defaultValue="#ff0000" swatches={["#0000ff"]} />);

      await userEvent.click(field());
      await userEvent.click(screen.getByRole("button", { name: "#0000ff" }));
      await userEvent.keyboard("{Escape}");

      expect(screen.getByText("#0000ff")).toBeInTheDocument();
    });

    it("follows the value it is given", async () => {
      const Controlled = () => {
        const [color, setColor] = useState("#ff0000");

        return (
          <>
            <button type="button" onClick={() => setColor("#00ff00")}>
              Green
            </button>
            <ColorInput value={color} onChange={setColor} />
          </>
        );
      };

      render(<Controlled />);

      await userEvent.click(screen.getByRole("button", { name: "Green" }));

      expect(screen.getByText("#00ff00")).toBeInTheDocument();
    });
  });

  describe("state", () => {
    it.each([
      ["enabled", {}],
      ["disabled", { disabled: true }],
      ["readonly", { readOnly: true }]
    ])("reports %s", (expected, props) => {
      const { container } = render(<ColorInput defaultValue="#3b82f6" {...props} />);

      expect(container.querySelector(".GeckoUIColorInput")).toHaveAttribute("data-state", expected);
    });

    it("marks an error", () => {
      const { container } = render(<ColorInput defaultValue="#3b82f6" hasError />);

      expect(container.querySelector(".GeckoUIColorInput")).toHaveAttribute("data-error");
    });
  });

  describe("render", () => {
    it("draws the field inside the trigger, so it still opens", async () => {
      render(
        <ColorInput
          defaultValue="#3b82f6"
          render={({ color }) => <span data-testid="mine">{color}</span>}
        />
      );

      expect(screen.getByTestId("mine")).toHaveTextContent("#3b82f6");

      await userEvent.click(field());

      expect(panel()).toBeInTheDocument();
    });

    it("says whether the panel is open", async () => {
      render(
        <ColorInput
          defaultValue="#3b82f6"
          render={({ open }) => <span data-testid="mine">{open ? "open" : "shut"}</span>}
        />
      );

      expect(screen.getByTestId("mine")).toHaveTextContent("shut");

      await userEvent.click(field());

      expect(screen.getByTestId("mine")).toHaveTextContent("open");
    });

    it("hands an empty string when there is no colour", () => {
      render(
        <ColorInput value="" render={({ color }) => <span data-testid="mine">[{color}]</span>} />
      );

      expect(screen.getByTestId("mine")).toHaveTextContent("[]");
    });
  });
});
