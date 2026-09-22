import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from ".";

const pageButton = (label: string) => screen.getByRole("button", { name: label });

describe("Pagination", () => {
  it("renders a button per page when there are few pages", () => {
    render(<Pagination currentPage={1} totalPages={3} onChange={() => {}} />);

    expect(pageButton("1")).toBeInTheDocument();
    expect(pageButton("2")).toBeInTheDocument();
    expect(pageButton("3")).toBeInTheDocument();
  });

  it("hides itself when there is only one page", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onChange={() => {}} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("reports the page that was clicked", async () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onChange={onChange} />);

    await userEvent.click(pageButton("3"));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("always shows the first and last page for a long range", () => {
    render(<Pagination currentPage={10} totalPages={20} onChange={() => {}} />);

    expect(pageButton("1")).toBeInTheDocument();
    expect(pageButton("20")).toBeInTheDocument();
  });

  it("collapses the middle of a long range", () => {
    render(<Pagination currentPage={10} totalPages={20} onChange={() => {}} />);

    // an ellipsis stands in for the pages that are not shown
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  it("does not step below the first page", async () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onChange={onChange} />);

    const previous = screen.getAllByRole("button")[0];
    await userEvent.click(previous);

    expect(onChange).not.toHaveBeenCalledWith(0);
  });

  it("does not step past the last page", async () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={5} onChange={onChange} />);

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[buttons.length - 1]);

    expect(onChange).not.toHaveBeenCalledWith(6);
  });

  it("merges className", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={5} onChange={() => {}} className="custom" />
    );

    expect(container.firstChild).toHaveClass("custom");
  });
});
