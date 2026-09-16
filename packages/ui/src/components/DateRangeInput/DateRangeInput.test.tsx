import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DateRangeInput } from ".";
import type { DateRange } from "../Calendar";

const wrapper = () => document.querySelector<HTMLElement>(".GeckoUIDateRangeInputWrapper")!;
const input = () => document.querySelector<HTMLElement>(".GeckoUIDateRangeInput")!;
const segments = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIDateInput__segment"));
const calendar = () => document.querySelector<HTMLElement>(".GeckoUICalendar");
const dayOfActiveMonth = (day: number) =>
  Array.from(
    document.querySelectorAll<HTMLButtonElement>(".GeckoUICalendar__day-picker__button")
  ).find((b) => b.dataset.activeMonth === "true" && b.textContent === String(day))!;
const clearButton = () =>
  document.querySelector<HTMLButtonElement>(".GeckoUIDateInput__clear-button");

const empty: DateRange = { from: null, to: null };

function Controlled({ onChange, ...rest }: Record<string, unknown>) {
  const [value, setValue] = useState<DateRange>(empty);
  return (
    <DateRangeInput
      value={value}
      onChange={(v: DateRange | null) => {
        setValue(v ?? empty);
        (onChange as ((v: DateRange | null) => void) | undefined)?.(v);
      }}
      {...rest}
    />
  );
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date(2024, 0, 15, 12));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("DateRangeInput", () => {
  it("renders a range input", () => {
    render(<DateRangeInput value={empty} onChange={() => {}} />);

    expect(input()).toBeInTheDocument();
    expect(segments()).toHaveLength(6);
  });

  it("keeps the calendar closed at first", () => {
    render(<DateRangeInput value={empty} onChange={() => {}} />);

    expect(calendar()).toBeNull();
    expect(wrapper()).not.toHaveAttribute("data-calendar-open");
  });

  it("opens a range calendar when a segment is clicked", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);

    expect(calendar()).toBeInTheDocument();
    expect(calendar()).toHaveAttribute("data-selection", "range");
    expect(wrapper()).toHaveAttribute("data-calendar-open", "true");
  });

  it("never opens a calendar when hideCalendar is set", async () => {
    render(<Controlled hideCalendar />);

    await userEvent.click(segments()[0]);

    expect(calendar()).toBeNull();
  });

  it("reports the start on the first calendar click and stays open", async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(10));

    expect(onChange).toHaveBeenLastCalledWith({ from: "2024-01-10", to: undefined });
    expect(calendar()).toBeInTheDocument();
  });

  it("reports both ends on the second calendar click and closes", async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(10));
    await userEvent.click(dayOfActiveMonth(20));

    expect(onChange).toHaveBeenLastCalledWith({ from: "2024-01-10", to: "2024-01-20" });
    await waitFor(() => expect(calendar()).toBeNull());
  });

  it("shows the picked range in the segments", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(10));
    await userEvent.click(dayOfActiveMonth(20));

    expect(segments().map((s) => s.textContent)).toEqual([
      "10",
      "01",
      "2024",
      "20",
      "01",
      "2024"
    ]);
  });

  it("closes the calendar on Enter", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("{Enter}");

    expect(calendar()).toBeNull();
  });

  it("calls onSubmit on Enter", async () => {
    const onSubmit = vi.fn();
    render(<Controlled onSubmit={onSubmit} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("closes the calendar when the range is cleared", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(10));
    await userEvent.click(dayOfActiveMonth(20));
    await userEvent.click(clearButton()!);

    expect(calendar()).toBeNull();
    expect(segments().map((s) => s.textContent)).toEqual([
      "DD",
      "MM",
      "YYYY",
      "DD",
      "MM",
      "YYYY"
    ]);
  });

  it("closes the calendar when clicking outside", async () => {
    render(
      <div>
        <button type="button">Outside</button>
        <Controlled />
      </div>
    );

    await userEvent.click(segments()[0]);
    expect(calendar()).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Outside" }));

    await waitFor(() => expect(calendar()).toBeNull());
  });

  it("does not open the calendar when disabled", async () => {
    render(<Controlled disabled />);

    await userEvent.click(input());

    expect(calendar()).toBeNull();
  });

  it("does not open the calendar when read only", async () => {
    render(<Controlled readOnly />);

    await userEvent.click(input());

    expect(calendar()).toBeNull();
  });

  it("passes the format through to the segments", () => {
    render(<DateRangeInput value={empty} onChange={() => {}} format="YYYY-MM-DD" />);

    expect(segments().map((s) => s.textContent)).toEqual([
      "YYYY",
      "MM",
      "DD",
      "YYYY",
      "MM",
      "DD"
    ]);
  });

  it("passes hasError through", () => {
    render(
      <DateRangeInput value={{ from: "2024-01-05", to: "2024-01-10" }} onChange={() => {}} hasError />
    );

    expect(input()).toHaveAttribute("data-error", "true");
  });

  it("applies wrapperClassName and className separately", () => {
    render(
      <DateRangeInput value={empty} onChange={() => {}} wrapperClassName="wrap" className="field" />
    );

    expect(wrapper()).toHaveClass("GeckoUIDateRangeInputWrapper", "wrap");
    expect(input()).toHaveClass("GeckoUIDateRangeInput", "field");
  });

  it("marks the input focused while the calendar is open", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);

    expect(input()).toHaveAttribute("data-focus", "true");
  });
});
