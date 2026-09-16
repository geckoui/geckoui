import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Switch from "./Switch";

const control = () => screen.getByRole("switch") as HTMLInputElement;

describe("Switch", () => {
  it("is exposed as a switch, not a checkbox", () => {
    render(<Switch />);

    expect(control()).toBeInTheDocument();
    expect(control().type).toBe("checkbox");
  });

  it("reflects the checked prop", () => {
    render(<Switch checked onChange={() => {}} />);

    expect(control()).toBeChecked();
  });

  it("reports the new state as a boolean, not an event", () => {
    // the prop is (checked: boolean) => void, unlike a plain input
    const onChange = vi.fn();
    render(<Switch onChange={onChange} />);

    return userEvent.click(control()).then(() => {
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  it("does not fire when disabled", async () => {
    const onChange = vi.fn();
    render(<Switch disabled onChange={onChange} />);

    await userEvent.click(control());

    expect(onChange).not.toHaveBeenCalled();
  });

  it("toggles with the space key", async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange} />);

    await userEvent.tab();
    await userEvent.keyboard(" ");

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles with the enter key, which a native checkbox ignores", async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange} />);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it.each(["sm", "md"] as const)("exposes size %s", (size) => {
    const { container } = render(<Switch size={size} />);

    expect(container.firstChild).toHaveAttribute("data-size", size);
  });

  it("merges className", () => {
    const { container } = render(<Switch className="custom" />);

    expect(container.firstChild).toHaveClass("GeckoUISwitch", "custom");
  });
});
