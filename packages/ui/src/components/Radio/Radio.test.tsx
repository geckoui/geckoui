import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Radio } from ".";
import type { RadioProps } from "./Radio.types";

describe("Radio", () => {
  it("renders a radio input", () => {
    render(<Radio name="size" value="sm" />);

    expect(screen.getByRole("radio")).toHaveAttribute("type", "radio");
  });

  it("applies the base class and a custom class", () => {
    render(<Radio className="custom" />);

    expect(screen.getByRole("radio")).toHaveClass("GeckoUIRadio", "custom");
  });

  it("forwards the ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("radio"));
  });

  it("selects on click and reports the value", async () => {
    const onChange = vi.fn();
    render(<Radio name="size" value="sm" onChange={onChange} />);

    await userEvent.click(screen.getByRole("radio"));

    expect(screen.getByRole("radio")).toBeChecked();
    expect(onChange.mock.calls[0][0].target.value).toBe("sm");
  });

  it("keeps only one option of a group selected", async () => {
    render(
      <>
        <Radio name="size" value="sm" aria-label="Small" />
        <Radio name="size" value="lg" aria-label="Large" />
      </>
    );

    await userEvent.click(screen.getByLabelText("Small"));
    await userEvent.click(screen.getByLabelText("Large"));

    expect(screen.getByLabelText("Small")).not.toBeChecked();
    expect(screen.getByLabelText("Large")).toBeChecked();
  });

  it("honours defaultChecked", () => {
    render(<Radio name="size" value="sm" defaultChecked />);

    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("respects a controlled checked prop", () => {
    render(<Radio name="size" value="sm" checked onChange={() => {}} />);

    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("does not change when disabled", async () => {
    const onChange = vi.fn();
    render(<Radio disabled onChange={onChange} />);

    await userEvent.click(screen.getByRole("radio"));

    expect(screen.getByRole("radio")).toBeDisabled();
    expect(screen.getByRole("radio")).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("cannot be overridden to a non radio type", () => {
    render(<Radio {...({ type: "checkbox" } as unknown as RadioProps)} />);

    expect(screen.getByRole("radio")).toHaveAttribute("type", "radio");
  });
});
