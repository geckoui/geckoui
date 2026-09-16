import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("defaults to type button, so it does not submit a form by accident", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("can be made a submit button", () => {
    render(<Button type="submit">Save</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  describe("axes", () => {
    it("is a filled, primary, medium button by default", () => {
      render(<Button>x</Button>);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("data-variant", "filled");
      expect(button).toHaveAttribute("data-color", "primary");
      expect(button).toHaveAttribute("data-size", "md");
    });

    it.each(["filled", "outlined", "ghost", "icon"] as const)("exposes variant %s", (variant) => {
      render(<Button variant={variant}>x</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("data-variant", variant);
    });

    it.each(["xs", "sm", "md", "lg", "xl"] as const)("exposes size %s", (size) => {
      render(<Button size={size}>x</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("data-size", size);
    });
  });

  describe("interaction", () => {
    it("calls onClick", async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>x</Button>);

      await userEvent.click(screen.getByRole("button"));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not fire when disabled", async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          x
        </Button>
      );

      await userEvent.click(screen.getByRole("button"));

      expect(onClick).not.toHaveBeenCalled();
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("is reachable and activatable by keyboard", async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>x</Button>);

      await userEvent.tab();
      expect(screen.getByRole("button")).toHaveFocus();

      await userEvent.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("passthrough", () => {
    it("merges className", () => {
      render(<Button className="custom">x</Button>);

      expect(screen.getByRole("button")).toHaveClass("GeckoUIButton", "custom");
    });

    it("forwards a ref", () => {
      let node: HTMLButtonElement | null = null;
      render(<Button ref={(el) => { node = el; }}>x</Button>);

      expect(node).toBeInstanceOf(HTMLButtonElement);
    });

    it("passes aria attributes through", () => {
      render(<Button aria-label="Close dialog">x</Button>);

      expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
    });
  });
});
