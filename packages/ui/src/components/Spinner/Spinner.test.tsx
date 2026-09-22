import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from ".";

describe("Spinner", () => {
  it("renders", () => {
    const { container } = render(<Spinner />);

    expect(container.firstChild).not.toBeNull();
  });

  it("is announced as a status, so a screen reader knows something is loading", () => {
    render(<Spinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<Spinner className="custom" />);

    expect(container.querySelector(".custom")).not.toBeNull();
  });
});
