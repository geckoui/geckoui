import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import CounterInput from "./CounterInput";

const field = () => screen.getByRole("textbox") as HTMLInputElement;
const minus = () => screen.getByLabelText("Decrement");
const plus = () => screen.getByLabelText("Increment");

/** Mirrors real usage: the parent owns the value. */
function Controlled({ initial = "0", ...rest }: { initial?: string } & Record<string, unknown>) {
  const [value, setValue] = useState(initial);
  return <CounterInput value={value} onChange={setValue} allowTyping {...rest} />;
}

describe("CounterInput", () => {
  it("shows the value it is given", () => {
    render(<CounterInput value="7" onChange={() => {}} />);

    expect(field()).toHaveValue("7");
  });

  it("is read-only until typing is allowed", () => {
    render(<CounterInput value="1" onChange={() => {}} />);

    expect(field()).toHaveAttribute("readonly");
  });

  it("accepts typing when allowTyping is set", () => {
    render(<CounterInput value="1" onChange={() => {}} allowTyping />);

    expect(field()).not.toHaveAttribute("readonly");
  });

  it("offers a decimal keypad, since the field accepts decimals", () => {
    render(<CounterInput value="1" onChange={() => {}} />);

    expect(field()).toHaveAttribute("inputmode", "decimal");
  });

  describe("typing", () => {
    it("keeps a trailing decimal point so a fraction can be finished", async () => {
      // deleting the 8 from 2.8 must leave "2.", or 2.5 can never be reached
      render(<Controlled initial="2.8" />);

      await userEvent.type(field(), "{backspace}");

      expect(field()).toHaveValue("2.");
    });

    it("lets a decimal be typed all the way through", async () => {
      render(<Controlled initial="" />);

      await userEvent.type(field(), "2.5");

      expect(field()).toHaveValue("2.5");
    });

    it("keeps a trailing zero", async () => {
      render(<Controlled initial="" />);

      await userEvent.type(field(), "2.0");

      expect(field()).toHaveValue("2.0");
    });

    it("rejects letters", async () => {
      render(<Controlled initial="" />);

      await userEvent.type(field(), "1a2");

      expect(field()).toHaveValue("12");
    });

    it("reports a string to onChange", async () => {
      const onChange = vi.fn();
      render(<CounterInput value="" onChange={onChange} allowTyping />);

      await userEvent.type(field(), "5");

      expect(onChange).toHaveBeenCalledWith("5");
    });

    it("does not clamp while typing", async () => {
      // typing 1 on the way to 10 must not be snapped up to the minimum
      render(<Controlled initial="" min={5} />);

      await userEvent.type(field(), "1");

      expect(field()).toHaveValue("1");
    });
  });

  describe("blur", () => {
    it("clamps to min", async () => {
      render(<Controlled initial="" min={5} />);

      await userEvent.type(field(), "1");
      await userEvent.tab();

      expect(field()).toHaveValue("5");
    });

    it("clamps to max", async () => {
      render(<Controlled initial="" max={10} />);

      await userEvent.type(field(), "99");
      await userEvent.tab();

      expect(field()).toHaveValue("10");
    });

    it("settles an incomplete value to empty", async () => {
      render(<Controlled initial="" />);

      await userEvent.type(field(), ".");
      await userEvent.tab();

      expect(field()).toHaveValue("");
    });
  });

  describe("step buttons", () => {
    it("increments by one by default", async () => {
      render(<Controlled initial="2" />);

      await userEvent.click(plus());

      expect(field()).toHaveValue("3");
    });

    it("decrements by one by default", async () => {
      render(<Controlled initial="2" />);

      await userEvent.click(minus());

      expect(field()).toHaveValue("1");
    });

    it("uses the step it is given", async () => {
      render(<Controlled initial="0" step={5} />);

      await userEvent.click(plus());

      expect(field()).toHaveValue("5");
    });

    it("does not accumulate floating point error", async () => {
      // 0.1 + 0.2 must read as 0.3, not 0.30000000000000004
      render(<Controlled initial="0.1" step={0.2} />);

      await userEvent.click(plus());

      expect(field()).toHaveValue("0.3");
    });

    it("steps from a half typed value", async () => {
      render(<Controlled initial="2." />);

      await userEvent.click(plus());

      expect(field()).toHaveValue("3");
    });

    it("treats an empty field as zero", async () => {
      render(<Controlled initial="" />);

      await userEvent.click(plus());

      expect(field()).toHaveValue("1");
    });

    it("disables decrement at the minimum", () => {
      render(<CounterInput value="0" onChange={() => {}} min={0} />);

      expect(minus()).toBeDisabled();
      expect(plus()).toBeEnabled();
    });

    it("disables increment at the maximum", () => {
      render(<CounterInput value="10" onChange={() => {}} max={10} />);

      expect(plus()).toBeDisabled();
      expect(minus()).toBeEnabled();
    });

    it("does not step below zero when positiveOnly is set", async () => {
      // without a floor, 0 - 1 formats back to 1 and the minus button increments
      render(<Controlled initial="0" positiveOnly />);

      await userEvent.click(minus());

      expect(field()).toHaveValue("0");
    });

    it("steps from the sanitised value when maxFractionDigits is set", async () => {
      // "2.8" is not a legal value for an integer field, so it must step from 2 to 3
      render(<Controlled initial="2.8" maxFractionDigits={0} />);

      await userEvent.click(plus());

      expect(field()).toHaveValue("3");
    });

    it("is disabled along with the component", () => {
      render(<CounterInput value="1" onChange={() => {}} disabled />);

      expect(plus()).toBeDisabled();
      expect(minus()).toBeDisabled();
    });
  });
});
