import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from ".";

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea placeholder="Notes" />);

    expect(screen.getByPlaceholderText("Notes")).toBeInTheDocument();
  });

  it("types into the textarea", async () => {
    const onChange = vi.fn();
    render(<Textarea placeholder="Notes" onChange={onChange} />);

    await userEvent.type(screen.getByPlaceholderText("Notes"), "hi");

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByPlaceholderText("Notes")).toHaveValue("hi");
  });

  it("forwards the ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Notes" />);

    expect(ref.current).toBe(screen.getByPlaceholderText("Notes"));
  });

  it("applies the base class and a custom class", () => {
    render(<Textarea className="custom" placeholder="Notes" />);

    expect(screen.getByPlaceholderText("Notes")).toHaveClass("GeckoUITextarea", "custom");
  });

  // `rows`, `maxRows` and `autoResize` only reach react-textarea-autosize, which sizes
  // the element from measured layout. jsdom reports no layout, so the resulting height
  // is not observable here and these props need a browser test instead.

  it("supports a controlled value", () => {
    render(<Textarea value="fixed" onChange={() => {}} placeholder="Notes" />);

    expect(screen.getByPlaceholderText("Notes")).toHaveValue("fixed");
  });

  it("disables the textarea", () => {
    render(<Textarea disabled placeholder="Notes" />);

    expect(screen.getByPlaceholderText("Notes")).toBeDisabled();
  });

  it("passes through native attributes", () => {
    render(<Textarea name="bio" maxLength={20} readOnly placeholder="Notes" />);

    const el = screen.getByPlaceholderText("Notes");
    expect(el).toHaveAttribute("name", "bio");
    expect(el).toHaveAttribute("maxLength", "20");
    expect(el).toHaveAttribute("readonly");
  });

  it("calls onBlur when focus leaves", async () => {
    const onBlur = vi.fn();
    render(<Textarea onBlur={onBlur} placeholder="Notes" />);

    await userEvent.click(screen.getByPlaceholderText("Notes"));
    await userEvent.tab();

    expect(onBlur).toHaveBeenCalled();
  });
});
