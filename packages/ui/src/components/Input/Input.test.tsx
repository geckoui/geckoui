import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Input } from ".";

describe("Input", () => {
  it("renders a text input", () => {
    render(<Input placeholder="Name" />);

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  });

  it("types into the input", async () => {
    const onChange = vi.fn();
    render(<Input placeholder="Name" onChange={onChange} />);

    await userEvent.type(screen.getByPlaceholderText("Name"), "abc");

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByPlaceholderText("Name")).toHaveValue("abc");
  });

  it("forwards the ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Name" />);

    expect(ref.current).toBe(screen.getByPlaceholderText("Name"));
  });

  it("links the wrapping label to the input with a generated id", () => {
    render(<Input placeholder="Name" />);

    const input = screen.getByPlaceholderText("Name");
    expect(input.id).toBeTruthy();
    expect(input.closest("label")).toHaveAttribute("for", input.id);
  });

  it("uses an explicit id when given", () => {
    render(<Input id="my-input" placeholder="Name" />);

    expect(screen.getByPlaceholderText("Name")).toHaveAttribute("id", "my-input");
    expect(screen.getByPlaceholderText("Name").closest("label")).toHaveAttribute("for", "my-input");
  });

  it("renders a string prefix and suffix", () => {
    render(<Input prefix="$" suffix=".00" placeholder="Amount" />);

    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText(".00")).toBeInTheDocument();
  });

  it("renders a node prefix", () => {
    render(<Input prefix={<span data-testid="icon" />} placeholder="Search" />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders a component suffix and passes it the input ref", () => {
    const ref = createRef<HTMLInputElement>();
    const Suffix = vi.fn((_props: Record<string, unknown>) => <span data-testid="suffix" />);
    render(<Input ref={ref} suffix={Suffix} placeholder="Search" />);

    expect(screen.getByTestId("suffix")).toBeInTheDocument();
    expect(Suffix.mock.calls[0][0]).toMatchObject({ inputRef: ref });
  });

  it("marks the container disabled", () => {
    render(<Input disabled placeholder="Name" />);

    const input = screen.getByPlaceholderText("Name");
    expect(input).toBeDisabled();
    expect(input.closest("label")).toHaveAttribute("data-state", "disabled");
    expect(input.closest("label")).toHaveAttribute("aria-disabled", "true");
  });

  it("marks the container enabled by default", () => {
    render(<Input placeholder="Name" />);

    expect(screen.getByPlaceholderText("Name").closest("label")).toHaveAttribute(
      "data-state",
      "enabled"
    );
  });

  it("flags read only on the container and the input", () => {
    render(<Input readOnly placeholder="Name" />);

    const input = screen.getByPlaceholderText("Name");
    expect(input).toHaveAttribute("readonly");
    expect(input.closest("label")).toHaveAttribute("data-readonly", "true");
  });

  it("omits the read only flag when not read only", () => {
    render(<Input placeholder="Name" />);

    expect(screen.getByPlaceholderText("Name").closest("label")).not.toHaveAttribute(
      "data-readonly"
    );
  });

  it("puts className on the container and inputClassName on the input", () => {
    render(<Input className="wrap" inputClassName="field" placeholder="Name" />);

    const input = screen.getByPlaceholderText("Name");
    expect(input).toHaveClass("GeckoUIInput__input", "field");
    expect(input.closest("label")).toHaveClass("GeckoUIInput", "wrap");
  });

  it("passes through native attributes", () => {
    render(<Input name="email" type="email" maxLength={10} placeholder="Email" />);

    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("maxLength", "10");
  });
});
