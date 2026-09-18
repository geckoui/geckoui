import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import Skeleton from "./Skeleton";

const bars = (container: HTMLElement) => container.querySelectorAll(".GeckoUISkeleton__bar");

describe("Skeleton", () => {
  describe("defaults", () => {
    it("is a single pulsing text line", () => {
      const { container } = render(<Skeleton />);
      const root = container.firstChild as HTMLElement;

      expect(root).toHaveAttribute("data-shape", "text");
      expect(root).toHaveAttribute("data-animation", "pulse");
      expect(bars(container)).toHaveLength(1);
    });

    it("marks itself busy rather than announcing, so a page of them stays quiet", () => {
      const { container } = render(<Skeleton />);

      expect(container.firstChild).toHaveAttribute("aria-busy", "true");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("axes", () => {
    it.each(["text", "rounded", "circle"] as const)("exposes shape %s", (shape) => {
      const { container } = render(<Skeleton shape={shape} />);

      expect(container.firstChild).toHaveAttribute("data-shape", shape);
    });

    it.each(["pulse", "wave", "none"] as const)("exposes animation %s", (animation) => {
      const { container } = render(<Skeleton animation={animation} />);

      expect(container.firstChild).toHaveAttribute("data-animation", animation);
    });
  });

  describe("lines", () => {
    it("draws one bar per line", () => {
      const { container } = render(<Skeleton lines={4} />);

      expect(bars(container)).toHaveLength(4);
    });

    it("ignores lines on shapes that are not text, which have nothing to stack", () => {
      const { container } = render(<Skeleton shape="circle" lines={4} />);

      expect(bars(container)).toHaveLength(1);
    });

    it.each([0, -3])("never drops below one bar, for lines=%s", (lines) => {
      const { container } = render(<Skeleton lines={lines} />);

      expect(bars(container)).toHaveLength(1);
    });

    it("rounds a fractional count down rather than rendering a part of a bar", () => {
      const { container } = render(<Skeleton lines={3.7} />);

      expect(bars(container)).toHaveLength(3);
    });
  });

  describe("loading", () => {
    it("draws the placeholder while loading", () => {
      const { container } = render(
        <Skeleton loading>
          <p>Ada Lovelace</p>
        </Skeleton>
      );

      expect(bars(container)).toHaveLength(1);
      expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
    });

    it("swaps to the children once loading is over", () => {
      const { container } = render(
        <Skeleton loading={false}>
          <p>Ada Lovelace</p>
        </Skeleton>
      );

      expect(bars(container)).toHaveLength(0);
      expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    });

    it("leaves nothing of its own behind once loaded, not even a wrapper", () => {
      const { container } = render(
        <Skeleton loading={false} className="w-40">
          <p>Ada Lovelace</p>
        </Skeleton>
      );

      expect(container.querySelector(".GeckoUISkeleton")).not.toBeInTheDocument();
      expect(container.firstChild?.nodeName).toBe("P");
    });

    it("never renders children while loading, so they cannot read data that has not arrived", () => {
      const Explode = () => {
        throw new Error("rendered too early");
      };

      expect(() =>
        render(
          <Skeleton loading>
            <Explode />
          </Skeleton>
        )
      ).not.toThrow();
    });
  });

  describe("passthrough", () => {
    it("keeps the class name alongside its own", () => {
      const { container } = render(<Skeleton className="w-40" />);

      expect(container.firstChild).toHaveClass("GeckoUISkeleton", "w-40");
    });

    it("forwards the rest of the props to the root", () => {
      const { container } = render(<Skeleton data-testid="ph" id="bio" />);

      expect(container.firstChild).toHaveAttribute("data-testid", "ph");
      expect(container.firstChild).toHaveAttribute("id", "bio");
    });

    it("forwards a ref to the root", () => {
      const ref = createRef<HTMLDivElement>();

      render(<Skeleton ref={ref} />);

      expect(ref.current).toHaveClass("GeckoUISkeleton");
    });
  });
});
