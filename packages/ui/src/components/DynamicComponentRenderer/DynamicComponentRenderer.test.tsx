import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DynamicComponentRenderer } from ".";

describe("DynamicComponentRenderer", () => {
  it("renders nothing for undefined", () => {
    const { container } = render(<DynamicComponentRenderer />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for null", () => {
    const { container } = render(<DynamicComponentRenderer component={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for an empty string", () => {
    const { container } = render(<DynamicComponentRenderer component="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("wraps a string in a span", () => {
    const { container } = render(<DynamicComponentRenderer component="Hello" />);

    expect(container.querySelector("span")).toHaveTextContent("Hello");
  });

  it("wraps a number in a span, including zero", () => {
    const { container } = render(<DynamicComponentRenderer component={0} />);

    expect(container.querySelector("span")).toHaveTextContent("0");
  });

  it("puts className on the span wrapper", () => {
    const { container } = render(<DynamicComponentRenderer component="Hi" className="custom" />);

    expect(container.querySelector("span")).toHaveClass("custom");
  });

  it("renders a react node as is", () => {
    render(<DynamicComponentRenderer component={<b data-testid="node">Bold</b>} />);

    expect(screen.getByTestId("node").tagName).toBe("B");
  });

  it("calls a function component with the remaining props", () => {
    const Component = vi.fn(() => <span data-testid="fn" />);
    render(<DynamicComponentRenderer component={Component} className="custom" extra={1} />);

    expect(screen.getByTestId("fn")).toBeInTheDocument();
    expect(Component.mock.calls[0][0]).toEqual({ className: "custom", extra: 1 });
  });
});
