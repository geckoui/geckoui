import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Progress from "./Progress";

const bar = (container: HTMLElement) =>
  container.querySelector(".GeckoUIProgress__bar") as HTMLElement;

const width = (container: HTMLElement) =>
  bar(container).style.getPropertyValue("--gecko-progress-percent");

afterEach(() => vi.restoreAllMocks());

describe("Progress", () => {
  describe("defaults", () => {
    it("is a medium primary bar", () => {
      const { container } = render(<Progress value={40} />);
      const root = container.firstChild as HTMLElement;

      expect(root).toHaveAttribute("data-size", "md");
      expect(root).toHaveAttribute("data-color", "primary");
    });

    it("measures against 100, so value reads as a percentage", () => {
      const { container } = render(<Progress value={40} />);

      expect(width(container)).toBe("40%");
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "100");
    });
  });

  describe("value", () => {
    it("scales against max", () => {
      const { container } = render(<Progress value={3} max={7} />);

      expect(width(container)).toBe("43%");
    });

    it.each([
      [500, 100, "100%"],
      [-20, 100, "0%"],
      [0, 100, "0%"],
      [100, 100, "100%"]
    ])("clamps %s of %s to %s", (value, max, expected) => {
      const { container } = render(<Progress value={value} max={max} />);

      expect(width(container)).toBe(expected);
    });

    it("reports the clamped value to a screen reader, not the one given", () => {
      render(<Progress value={500} max={100} />);

      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    });
  });

  describe("indeterminate", () => {
    it("runs on its own when there is no value", () => {
      const { container } = render(<Progress />);

      expect(container.firstChild).toHaveAttribute("data-indeterminate", "true");
    });

    it("leaves off aria-valuenow, so the value reads as unknown rather than zero", () => {
      render(<Progress />);

      expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    });

    it("is determinate at zero, which is a known value", () => {
      const { container } = render(<Progress value={0} />);

      expect(container.firstChild).not.toHaveAttribute("data-indeterminate");
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    });
  });

  describe("label", () => {
    it("shows a node", () => {
      render(<Progress value={40} label="Uploading" />);

      expect(screen.getByText("Uploading")).toBeInTheDocument();
    });

    it("calls a function with how far along it is", () => {
      render(
        <Progress
          value={3}
          max={7}
          label={({ percent, value, max }) => `${percent} ${value} ${max}`}
        />
      );

      expect(screen.getByText("43 3 7")).toBeInTheDocument();
    });

    it("hands the function the clamped value, so it cannot report more than is shown", () => {
      render(<Progress value={500} label={({ value }) => `${value}`} />);

      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("keeps a node while indeterminate, and drops a function that has nothing to report", () => {
      const { rerender, container } = render(<Progress label="Uploading" />);

      expect(screen.getByText("Uploading")).toBeInTheDocument();

      rerender(<Progress label={({ percent }) => `${percent}%`} />);

      expect(container.querySelector(".GeckoUIProgress__label")).not.toBeInTheDocument();
    });

    it("renders no label element when there is none", () => {
      const { container } = render(<Progress value={40} />);

      expect(container.querySelector(".GeckoUIProgress__label")).not.toBeInTheDocument();
    });
  });

  describe("axes", () => {
    it.each(["default", "primary", "success", "error", "warning", "info"] as const)(
      "exposes color %s",
      (color) => {
        const { container } = render(<Progress value={40} color={color} />);

        expect(container.firstChild).toHaveAttribute("data-color", color);
      }
    );

    it.each(["sm", "md", "lg"] as const)("exposes size %s", (size) => {
      const { container } = render(<Progress value={40} size={size} />);

      expect(container.firstChild).toHaveAttribute("data-size", size);
    });
  });

  describe("a max that cannot work", () => {
    it("warns in development, because an empty bar otherwise looks like stalled work", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<Progress value={5} max={0} />);

      expect(warn).toHaveBeenCalledWith(expect.stringContaining("max above 0"));
    });

    it("stays at zero rather than dividing by it", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const { container } = render(<Progress value={5} max={0} />);

      expect(width(container)).toBe("0%");
    });
  });

  describe("passthrough", () => {
    it("keeps the class name alongside its own", () => {
      const { container } = render(<Progress value={40} className="my-4" />);

      expect(container.firstChild).toHaveClass("GeckoUIProgress", "my-4");
    });

    it("forwards a ref and the rest of the props to the root", () => {
      const ref = createRef<HTMLDivElement>();

      render(<Progress value={40} ref={ref} aria-label="Upload" />);

      expect(ref.current).toHaveClass("GeckoUIProgress");
      expect(screen.getByRole("progressbar", { name: "Upload" })).toBeInTheDocument();
    });
  });
});
