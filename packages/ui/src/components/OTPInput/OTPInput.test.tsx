import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { OTPInput } from ".";

const boxes = () => screen.getAllByRole("textbox") as HTMLInputElement[];

// The component detects delete with the deprecated `event.keyCode`, which
// `user-event` no longer sets. Real browsers still send it, so the tests fire it
// directly rather than working around the component.
const pressBackspace = () => {
  const el = document.activeElement as HTMLElement;
  fireEvent.keyDown(el, { key: "Backspace", keyCode: 8 });
  fireEvent.keyUp(el, { key: "Backspace", keyCode: 8 });
};

function Controlled({ length = 6, ...rest }: { length?: number } & Record<string, unknown>) {
  const [value, setValue] = useState("");
  return <OTPInput value={value} onChange={setValue} length={length} {...rest} />;
}

describe("OTPInput", () => {
  it("renders one box per digit", () => {
    render(<OTPInput value="" onChange={() => {}} length={6} />);

    expect(boxes()).toHaveLength(6);
  });

  it("honours a custom length", () => {
    render(<OTPInput value="" onChange={() => {}} length={4} />);

    expect(boxes()).toHaveLength(4);
  });

  it("spreads the value across the boxes", () => {
    render(<OTPInput value="123" onChange={() => {}} length={6} />);

    expect(boxes()[0]).toHaveValue("1");
    expect(boxes()[1]).toHaveValue("2");
    expect(boxes()[2]).toHaveValue("3");
    expect(boxes()[3]).toHaveValue("");
  });

  it("ignores value longer than length", () => {
    render(<OTPInput value="123456789" onChange={() => {}} length={4} />);

    expect(boxes()).toHaveLength(4);
    expect(boxes()[3]).toHaveValue("4");
  });

  it("collects typed digits into one value", async () => {
    const onChange = vi.fn();
    render(<OTPInput value="" onChange={onChange} length={6} />);

    await userEvent.type(boxes()[0], "1");

    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("advances focus as digits are typed", async () => {
    render(<Controlled />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("123");

    expect(boxes()[3]).toHaveFocus();
  });

  it("fires onOTPComplete once the last box is filled", async () => {
    const onOTPComplete = vi.fn();
    render(<Controlled length={4} onOTPComplete={onOTPComplete} />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("1234");

    expect(onOTPComplete).toHaveBeenCalledWith("1234");
  });

  it("does not fire onOTPComplete before the code is full", async () => {
    const onOTPComplete = vi.fn();
    render(<Controlled length={4} onOTPComplete={onOTPComplete} />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("12");

    expect(onOTPComplete).not.toHaveBeenCalled();
  });

  it("deletes the last digit on backspace", async () => {
    render(<Controlled />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("12");
    pressBackspace();

    expect(boxes()[0]).toHaveValue("1");
    expect(boxes()[1]).toHaveValue("");
  });

  it("keeps deleting on repeated backspace", async () => {
    render(<Controlled />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("12");
    pressBackspace();
    pressBackspace();

    expect(boxes()[0]).toHaveValue("");
    expect(boxes()[1]).toHaveValue("");
  });

  it("stays empty when backspacing an empty code", async () => {
    render(<Controlled />);

    await userEvent.click(boxes()[0]);
    pressBackspace();

    expect(boxes()[0]).toHaveValue("");
  });

  it("moves focus back to the emptied box after backspace", async () => {
    render(<Controlled />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("12");
    pressBackspace();

    expect(boxes()[1]).toHaveFocus();
  });

  it("rejects letters by default", async () => {
    render(<Controlled />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("a");

    expect(boxes()[0]).toHaveValue("");
  });

  it("accepts letters when numberOnly is off", async () => {
    render(<Controlled numberOnly={false} />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("a");

    expect(boxes()[0]).toHaveValue("a");
  });

  it("uses a numeric inputMode when numberOnly is set", () => {
    render(<OTPInput value="" onChange={() => {}} length={4} numberOnly />);

    boxes().forEach((box) => expect(box).toHaveAttribute("inputMode", "numeric"));
  });

  it("disables every box when disabled", () => {
    render(<OTPInput value="" onChange={() => {}} length={4} disabled />);

    boxes().forEach((box) => expect(box).toBeDisabled());
  });

  it("calls onBlur when a box loses focus", async () => {
    const onBlur = vi.fn();
    render(<OTPInput value="" onChange={() => {}} length={4} onBlur={onBlur} />);

    await userEvent.click(boxes()[0]);
    await userEvent.tab();

    expect(onBlur).toHaveBeenCalled();
  });

  it("only leaves the next empty box tabbable", () => {
    render(<OTPInput value="12" onChange={() => {}} length={4} />);

    expect(boxes()[0]).toHaveAttribute("tabIndex", "-1");
    expect(boxes()[1]).toHaveAttribute("tabIndex", "-1");
    expect(boxes()[2]).toHaveAttribute("tabIndex", "0");
    expect(boxes()[3]).toHaveAttribute("tabIndex", "-1");
  });

  it("applies a custom class to each input", () => {
    render(<OTPInput value="" onChange={() => {}} length={2} inputClassName="custom-box" />);

    boxes().forEach((box) => expect(box).toHaveClass("custom-box"));
  });
});
