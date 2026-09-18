import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InputError } from ".";

describe("InputError", () => {
  it("renders its children", () => {
    render(<InputError>This field is required</InputError>);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies the base class", () => {
    render(<InputError>Oops</InputError>);

    expect(screen.getByText("Oops")).toHaveClass("GeckoUIInputError");
  });

  it("keeps a custom class alongside the base class", () => {
    render(<InputError className="custom">Oops</InputError>);

    expect(screen.getByText("Oops")).toHaveClass("GeckoUIInputError", "custom");
  });

  it("passes through native attributes", () => {
    render(
      <InputError role="alert" id="err">
        Oops
      </InputError>
    );

    const el = screen.getByRole("alert");
    expect(el).toHaveAttribute("id", "err");
  });

  it("renders nothing visible for empty children", () => {
    const { container } = render(<InputError />);

    expect(container.querySelector(".GeckoUIInputError")).toBeEmptyDOMElement();
  });
});
