import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Checkbox from "./Checkbox";

const box = () => screen.getByRole("checkbox") as HTMLInputElement;

describe("Checkbox", () => {
  it("renders a native checkbox input", () => {
    render(<Checkbox />);

    expect(box()).toBeInTheDocument();
    expect(box().type).toBe("checkbox");
  });

  it("gets an id even when none is supplied, so a label can point at it", () => {
    render(<Checkbox />);

    expect(box().id).toBeTruthy();
  });

  it("uses the id it is given", () => {
    render(<Checkbox id="terms" />);

    expect(box().id).toBe("terms");
  });

  describe("indeterminate", () => {
    it("sets the native DOM property, not just a class", () => {
      // there is no HTML attribute for it, so React cannot set it from JSX.
      // without the property, :indeterminate never matches and the state is not announced
      render(<Checkbox indeterminate />);

      expect(box().indeterminate).toBe(true);
    });

    it("is false when not asked for", () => {
      render(<Checkbox />);

      expect(box().indeterminate).toBe(false);
    });

    it("is independent of checked, as in the platform", () => {
      // a select-all box with some rows selected must be unchecked AND indeterminate,
      // so clicking it selects everything rather than clearing it
      render(<Checkbox checked={false} indeterminate onChange={() => {}} />);

      expect(box().indeterminate).toBe(true);
      expect(box().checked).toBe(false);
    });

    it("can be set alongside checked", () => {
      render(<Checkbox checked indeterminate onChange={() => {}} />);

      expect(box().indeterminate).toBe(true);
      expect(box().checked).toBe(true);
    });

    it("clears when the prop goes away", () => {
      const { rerender } = render(<Checkbox indeterminate />);
      expect(box().indeterminate).toBe(true);

      rerender(<Checkbox indeterminate={false} />);

      expect(box().indeterminate).toBe(false);
    });

    it("is re-applied after a click, which clears it in the browser", () => {
      // the browser clears the property itself on click, so a controlled checkbox
      // that keeps indeterminate set must not silently lose the dash
      const { rerender } = render(<Checkbox checked={false} indeterminate onChange={() => {}} />);

      box().indeterminate = false; // what the browser does on click
      rerender(<Checkbox checked={false} indeterminate onChange={() => {}} />);

      expect(box().indeterminate).toBe(true);
    });
  });

  describe("interaction", () => {
    it("calls onChange when clicked", async () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} />);

      await userEvent.click(box());

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("reports the new checked state to onChange", async () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} />);

      await userEvent.click(box());

      expect(onChange.mock.calls[0][0].target.checked).toBe(true);
    });

    it("does not fire when disabled", async () => {
      const onChange = vi.fn();
      render(<Checkbox disabled onChange={onChange} />);

      await userEvent.click(box());

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("passthrough", () => {
    it("merges className onto the input", () => {
      render(<Checkbox className="custom" />);

      expect(box()).toHaveClass("GeckoUICheckbox__input", "custom");
    });

    it("forwards a ref to the input", () => {
      let node: HTMLInputElement | null = null;
      render(
        <Checkbox
          ref={(el) => {
            node = el;
          }}
        />
      );

      expect(node).toBeInstanceOf(HTMLInputElement);
    });

    it("passes standard input attributes through", () => {
      render(<Checkbox name="terms" value="yes" readOnly checked />);

      expect(box()).toHaveAttribute("name", "terms");
      expect(box()).toHaveAttribute("value", "yes");
    });
  });
});
