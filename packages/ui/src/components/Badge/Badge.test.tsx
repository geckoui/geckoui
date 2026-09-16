import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Badge from "./Badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>Draft</Badge>);

    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders as a span, so it can sit inline in a sentence", () => {
    const { container } = render(<Badge>Draft</Badge>);

    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  describe("defaults", () => {
    it("is a soft, default, medium, rounded badge", () => {
      const { container } = render(<Badge>Draft</Badge>);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveAttribute("data-variant", "soft");
      expect(badge).toHaveAttribute("data-color", "default");
      expect(badge).toHaveAttribute("data-size", "md");
      expect(badge).toHaveAttribute("data-shape", "rounded");
    });
  });

  describe("axes", () => {
    it.each(["filled", "soft", "outlined"] as const)("exposes variant %s", (variant) => {
      const { container } = render(<Badge variant={variant}>x</Badge>);

      expect(container.firstChild).toHaveAttribute("data-variant", variant);
    });

    it.each(["default", "primary", "success", "error", "warning", "info"] as const)(
      "exposes color %s",
      (color) => {
        const { container } = render(<Badge color={color}>x</Badge>);

        expect(container.firstChild).toHaveAttribute("data-color", color);
      }
    );

    it.each(["sm", "md", "lg"] as const)("exposes size %s", (size) => {
      const { container } = render(<Badge size={size}>x</Badge>);

      expect(container.firstChild).toHaveAttribute("data-size", size);
    });

    it.each(["rounded", "pill", "square"] as const)("exposes shape %s", (shape) => {
      const { container } = render(<Badge shape={shape}>x</Badge>);

      expect(container.firstChild).toHaveAttribute("data-shape", shape);
    });

    it("keeps the axes independent", () => {
      const { container } = render(
        <Badge variant="outlined" color="error" size="lg" shape="pill">
          x
        </Badge>
      );
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveAttribute("data-variant", "outlined");
      expect(badge).toHaveAttribute("data-color", "error");
      expect(badge).toHaveAttribute("data-size", "lg");
      expect(badge).toHaveAttribute("data-shape", "pill");
    });
  });

  describe("dot", () => {
    it("is absent by default", () => {
      const { container } = render(<Badge>x</Badge>);

      expect(container.querySelector(".GeckoUIBadge__dot")).toBeNull();
    });

    it("renders when asked", () => {
      const { container } = render(<Badge dot>Live</Badge>);

      expect(container.querySelector(".GeckoUIBadge__dot")).not.toBeNull();
    });

    it("is hidden from assistive tech, since it repeats the label", () => {
      const { container } = render(<Badge dot>Live</Badge>);

      expect(container.querySelector(".GeckoUIBadge__dot")).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("icon", () => {
    it("renders the node exactly as given, with no wrapper", () => {
      const { container } = render(<Badge icon={<svg data-testid="star" />}>Featured</Badge>);
      const icon = screen.getByTestId("star");

      expect(icon).toBeInTheDocument();
      // styling lives where the icon is defined, so the badge must not wrap it
      expect(icon.parentElement).toBe(container.firstChild);
    });

    it("accepts a component as well as an element", () => {
      const Star = () => <svg data-testid="star-fc" />;
      render(<Badge icon={Star}>Featured</Badge>);

      expect(screen.getByTestId("star-fc")).toBeInTheDocument();
    });

    it("takes precedence over dot", () => {
      const { container } = render(
        <Badge dot icon={<svg data-testid="star" />}>
          x
        </Badge>
      );

      expect(screen.getByTestId("star")).toBeInTheDocument();
      expect(container.querySelector(".GeckoUIBadge__dot")).toBeNull();
    });
  });

  describe("passthrough", () => {
    it("merges className rather than replacing it", () => {
      const { container } = render(<Badge className="custom">x</Badge>);

      expect(container.firstChild).toHaveClass("GeckoUIBadge", "custom");
    });

    it("forwards a ref to the element", () => {
      let node: HTMLSpanElement | null = null;
      render(<Badge ref={(el) => (node = el)}>x</Badge>);

      expect(node).toBeInstanceOf(HTMLSpanElement);
    });

    it("passes standard span attributes through", () => {
      render(<Badge title="a tooltip">x</Badge>);

      expect(screen.getByText("x")).toHaveAttribute("title", "a tooltip");
    });
  });
});
