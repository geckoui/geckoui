import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Alert from "./Alert";

const alert = (c: HTMLElement) => c.querySelector(".GeckoUIAlert") as HTMLElement;

describe("Alert", () => {
  it("renders its title", () => {
    render(<Alert title="Upload failed" />);

    expect(screen.getByText("Upload failed")).toBeInTheDocument();
  });

  it("renders a description when given one", () => {
    render(<Alert title="Upload failed" description="The file was too large." />);

    expect(screen.getByText("The file was too large.")).toBeInTheDocument();
  });

  it("omits the description when not given one", () => {
    const { container } = render(<Alert title="Saved" />);

    expect(container.querySelector(".GeckoUIAlert__description")).toBeNull();
  });

  describe("color", () => {
    it("defaults to default", () => {
      const { container } = render(<Alert title="x" />);

      expect(alert(container)).toHaveAttribute("data-color", "default");
    });

    it.each(["default", "error", "warning", "info", "success"] as const)(
      "exposes %s as data-color",
      (color) => {
        // renamed from variant in v2 so it matches Button and Badge,
        // where variant is the treatment and color is the meaning
        const { container } = render(<Alert color={color} title="x" />);

        expect(alert(container)).toHaveAttribute("data-color", color);
      }
    );

    it("no longer emits data-variant", () => {
      const { container } = render(<Alert color="error" title="x" />);

      expect(alert(container)).not.toHaveAttribute("data-variant");
    });
  });

  describe("condensed", () => {
    it("is off by default", () => {
      const { container } = render(<Alert title="x" />);

      expect(alert(container)).not.toHaveAttribute("data-condensed");
    });

    it("marks the element when set", () => {
      const { container } = render(<Alert condensed title="x" />);

      expect(alert(container)).toHaveAttribute("data-condensed");
    });
  });

  describe("icon", () => {
    it("renders a built-in icon element by default", () => {
      const { container } = render(<Alert color="error" title="x" />);

      expect(container.querySelector(".GeckoUIAlert__icon")).not.toBeNull();
    });

    it("replaces the built-in icon with a custom one", () => {
      const { container } = render(<Alert title="x" icon={<svg data-testid="mine" />} />);

      expect(screen.getByTestId("mine")).toBeInTheDocument();
      expect(container.querySelector(".GeckoUIAlert__icon")).toBeNull();
    });

    it("accepts a component as well as an element", () => {
      const Mine = () => <svg data-testid="mine-fc" />;
      render(<Alert title="x" icon={Mine} />);

      expect(screen.getByTestId("mine-fc")).toBeInTheDocument();
    });
  });

  describe("onRemove", () => {
    it("shows no dismiss button unless a handler is given", () => {
      const { container } = render(<Alert title="x" />);

      expect(container.querySelector(".GeckoUIAlert__remove-button")).toBeNull();
    });

    it("shows a dismiss button when a handler is given", () => {
      const { container } = render(<Alert title="x" onRemove={() => {}} />);

      expect(container.querySelector(".GeckoUIAlert__remove-button")).not.toBeNull();
    });

    it("calls the handler when the button is pressed", async () => {
      const onRemove = vi.fn();
      const { container } = render(<Alert title="x" onRemove={onRemove} />);

      await userEvent.click(container.querySelector(".GeckoUIAlert__remove-button") as HTMLElement);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  it("merges className rather than replacing it", () => {
    const { container } = render(<Alert className="custom" title="x" />);

    expect(alert(container)).toHaveClass("GeckoUIAlert", "custom");
  });
});
