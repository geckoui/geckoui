import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TimeInput from "./TimeInput";

const field = (container: HTMLElement) =>
  container.querySelector(".GeckoUITimeInput") as HTMLElement;

const segment = (container: HTMLElement, name: string) =>
  within(field(container)).getByLabelText(name);

const picker = () => document.querySelector(".GeckoUITimeInput__picker");

const column = (name: string) =>
  document.querySelector(`.GeckoUITimeInput__column[aria-label="${name}"]`) as HTMLElement;

const cell = (name: string, text: string) =>
  within(column(name))
    .getAllByRole("option")
    .find((option) => option.textContent === text) as HTMLElement;

describe("TimeInput", () => {
  describe("what it shows", () => {
    it("shows the format as the placeholder while there is nothing in it", () => {
      render(<TimeInput />);

      expect(screen.getByText("HH:mm")).toBeInTheDocument();
    });

    it("splits the value across the segments", () => {
      const { container } = render(<TimeInput value="09:30" />);

      expect(segment(container, "hour")).toHaveValue("09");
      expect(segment(container, "minute")).toHaveValue("30");
    });

    it("shows a 24 hour value on a 12 hour clock without changing it", () => {
      const { container } = render(<TimeInput value="16:05" format="hh:mm A" />);

      expect(segment(container, "hour")).toHaveValue("04");
      expect(segment(container, "minute")).toHaveValue("05");
      expect(segment(container, "meridiem")).toHaveValue("PM");
    });

    it("adds the seconds segment only when the format asks for it", () => {
      const { container, rerender } = render(<TimeInput value="09:30" />);

      expect(within(field(container)).queryByLabelText("second")).not.toBeInTheDocument();

      rerender(<TimeInput value="09:30:15" format="HH:mm:ss" />);

      expect(segment(container, "second")).toHaveValue("15");
    });
  });

  describe("typing", () => {
    it("sends the time once every segment is filled, and not before", async () => {
      const onChange = vi.fn();
      const { container } = render(<TimeInput onChange={onChange} />);

      await userEvent.click(segment(container, "hour"));
      await userEvent.keyboard("09");

      expect(onChange).toHaveBeenLastCalledWith(null);

      await userEvent.keyboard("30");

      expect(onChange).toHaveBeenLastCalledWith("09:30");
    });

    it("moves to the next segment once one is full", async () => {
      const { container } = render(<TimeInput />);

      await userEvent.click(segment(container, "hour"));
      await userEvent.keyboard("09");

      expect(segment(container, "minute")).toHaveFocus();
    });

    it("moves on from a first digit that cannot start a two digit number", async () => {
      const { container } = render(<TimeInput />);

      await userEvent.click(segment(container, "hour"));
      // no hour starts with 3, so the segment is settled at 03 rather than waiting
      await userEvent.keyboard("3");

      expect(segment(container, "hour")).toHaveValue("03");
      expect(segment(container, "minute")).toHaveFocus();
    });

    it("holds a segment at its ceiling", async () => {
      const { container } = render(<TimeInput format="hh:mm A" />);

      await userEvent.click(segment(container, "hour"));
      // 1 could still become 10, 11 or 12, so it waits; 3 would take it past the clock
      await userEvent.keyboard("13");

      expect(segment(container, "hour")).toHaveValue("12");
    });

    it("sends 24 hours whatever the clock on screen says", async () => {
      const onChange = vi.fn();
      const { container } = render(<TimeInput format="hh:mm A" onChange={onChange} />);

      await userEvent.click(segment(container, "hour"));
      await userEvent.keyboard("0430");
      await userEvent.keyboard("p");

      expect(onChange).toHaveBeenLastCalledWith("16:30");
    });

    it("sets the meridiem from a and p", async () => {
      const { container } = render(<TimeInput value="16:30" format="hh:mm A" />);

      await userEvent.click(segment(container, "meridiem"));
      await userEvent.keyboard("a");

      expect(segment(container, "meridiem")).toHaveValue("AM");
    });
  });

  describe("the keyboard", () => {
    it("walks between segments with the arrows", async () => {
      const { container } = render(<TimeInput value="09:30" />);

      await userEvent.click(segment(container, "hour"));
      await userEvent.keyboard("{ArrowRight}");

      expect(segment(container, "minute")).toHaveFocus();

      await userEvent.keyboard("{ArrowLeft}");

      expect(segment(container, "hour")).toHaveFocus();
    });

    it("steps the segment under the caret, wrapping at the ends", async () => {
      const onChange = vi.fn();
      const { container } = render(<TimeInput value="23:30" onChange={onChange} />);

      await userEvent.click(segment(container, "hour"));
      await userEvent.keyboard("{ArrowUp}");

      expect(onChange).toHaveBeenLastCalledWith("00:30");

      await userEvent.keyboard("{ArrowDown}");

      expect(onChange).toHaveBeenLastCalledWith("23:30");
    });

    it("goes back a segment on backspace from an empty one", async () => {
      const { container } = render(<TimeInput />);

      await userEvent.click(segment(container, "minute"));
      await userEvent.keyboard("{Backspace}");

      expect(segment(container, "hour")).toHaveFocus();
    });
  });

  describe("the picker", () => {
    it("opens from a click anywhere in the field", async () => {
      const { container } = render(<TimeInput />);

      expect(picker()).not.toBeInTheDocument();

      await userEvent.click(field(container));

      expect(picker()).toBeInTheDocument();
    });

    it("gives every segment a column of its own", async () => {
      const { container } = render(<TimeInput format="hh:mm:ss A" />);

      await userEvent.click(field(container));

      expect(document.querySelectorAll(".GeckoUITimeInput__column")).toHaveLength(4);
    });

    it("fills one segment per pick and stays open for the rest", async () => {
      const onChange = vi.fn();
      const { container } = render(<TimeInput onChange={onChange} />);

      await userEvent.click(field(container));
      await userEvent.click(cell("hour", "09"));

      expect(picker()).toBeInTheDocument();
      expect(onChange).toHaveBeenLastCalledWith(null);

      await userEvent.click(cell("minute", "30"));

      expect(onChange).toHaveBeenLastCalledWith("09:30");
    });

    it("thins the minute column by the step", async () => {
      const { container } = render(<TimeInput step={15} />);

      await userEvent.click(field(container));

      expect(within(column("minute")).getAllByRole("option")).toHaveLength(4);
    });

    it("closes on Escape", async () => {
      const { container } = render(<TimeInput />);

      await userEvent.click(field(container));
      await userEvent.keyboard("{Escape}");

      expect(picker()).not.toBeInTheDocument();
    });
  });

  describe("closing", () => {
    it("keeps a time the rule allows", async () => {
      const { container, rerender } = render(<TimeInput onChange={() => {}} />);

      await userEvent.click(field(container));
      await userEvent.click(cell("hour", "09"));
      await userEvent.click(cell("minute", "30"));
      await userEvent.keyboard("{Escape}");

      rerender(<TimeInput value="09:30" onChange={() => {}} />);

      expect(segment(container, "hour")).toHaveValue("09");
    });

    it("drops a time the rule turns down, rather than showing one the caller never got", async () => {
      const onChange = vi.fn();
      const { container } = render(
        <TimeInput onChange={onChange} disabledTime={({ hour }) => hour === 9} />
      );

      await userEvent.click(field(container));
      await userEvent.click(cell("minute", "30"));
      await userEvent.keyboard("{Escape}");

      // the minute alone is not a time, so nothing was ever sent
      expect(onChange).toHaveBeenLastCalledWith(null);
      expect(segment(container, "minute")).toHaveValue("");
    });
  });

  describe("disabledTime", () => {
    it("greys out the cells the rule turns down", async () => {
      const { container } = render(<TimeInput disabledTime={({ hour }) => hour < 9} />);

      await userEvent.click(field(container));

      expect(cell("hour", "08")).toBeDisabled();
      expect(cell("hour", "09")).toBeEnabled();
    });

    it("sends null rather than a time the rule turns down", async () => {
      const onChange = vi.fn();
      const { container } = render(
        <TimeInput onChange={onChange} disabledTime={({ minute }) => minute > 0} />
      );

      await userEvent.click(segment(container, "hour"));
      await userEvent.keyboard("0930");

      expect(onChange).toHaveBeenLastCalledWith(null);
    });
  });

  describe("clearing", () => {
    it("empties the field and closes", async () => {
      const onChange = vi.fn();
      const { container } = render(<TimeInput value="09:30" onChange={onChange} />);

      await userEvent.click(field(container));
      await userEvent.click(screen.getByRole("button", { name: "Clear" }));

      expect(onChange).toHaveBeenCalledWith(null);
      expect(picker()).not.toBeInTheDocument();
    });

    it("has nothing to clear while it is empty", () => {
      render(<TimeInput />);

      expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    });
  });

  describe("states", () => {
    it.each(["disabled", "readonly"] as const)("does not open when %s", async (state) => {
      const { container } = render(
        <TimeInput value="09:30" disabled={state === "disabled"} readOnly={state === "readonly"} />
      );

      await userEvent.click(field(container));

      expect(picker()).not.toBeInTheDocument();
      expect(field(container)).toHaveAttribute("data-state", state);
    });

    it("marks itself in error", () => {
      const { container } = render(<TimeInput hasError />);

      expect(field(container)).toHaveAttribute("data-error", "true");
    });
  });

  it("calls onSubmit once the last segment is filled", async () => {
    const onSubmit = vi.fn();
    const { container } = render(<TimeInput onSubmit={onSubmit} />);

    await userEvent.click(segment(container, "hour"));
    await userEvent.keyboard("0930");

    expect(onSubmit).toHaveBeenCalled();
  });
});
