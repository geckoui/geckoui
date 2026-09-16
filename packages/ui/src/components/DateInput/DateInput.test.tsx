import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DateInput } from ".";

const wrapper = () => document.querySelector<HTMLElement>(".GeckoUIDateInputWrapper")!;
const input = () => document.querySelector<HTMLElement>(".GeckoUIDateInput")!;
const segments = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIDateInput__segment"));
const calendar = () => document.querySelector<HTMLElement>(".GeckoUIDateInput__calendar");
const header = () => document.querySelector<HTMLElement>(".GeckoUICalendar__header__title");
const dayOfActiveMonth = (day: number) =>
  Array.from(
    document.querySelectorAll<HTMLButtonElement>(".GeckoUICalendar__day-picker__button")
  ).find((b) => b.dataset.activeMonth === "true" && b.textContent === String(day))!;
const clearButton = () =>
  document.querySelector<HTMLButtonElement>(".GeckoUIDateInput__clear-button");

function Controlled({ onChange, ...rest }: Record<string, unknown>) {
  const [value, setValue] = useState<string | null>("");
  return (
    <DateInput
      value={value ?? ""}
      onChange={(v: string | null) => {
        setValue(v);
        (onChange as ((v: string | null) => void) | undefined)?.(v);
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

describe("DateInput", () => {
  it("renders a date input", () => {
    render(<DateInput value="" onChange={() => {}} />);

    expect(input()).toBeInTheDocument();
    expect(screen.getByText("DD/MM/YYYY")).toBeInTheDocument();
  });

  it("keeps the calendar closed at first", () => {
    render(<DateInput value="" onChange={() => {}} />);

    expect(calendar()).toBeNull();
    expect(wrapper()).not.toHaveAttribute("data-calendar-open");
  });

  it("opens the calendar when a segment is clicked", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);

    expect(calendar()).toBeInTheDocument();
    expect(wrapper()).toHaveAttribute("data-calendar-open", "true");
  });

  it("never opens a calendar when hideCalendar is set", async () => {
    render(<Controlled hideCalendar />);

    await userEvent.click(segments()[0]);

    expect(calendar()).toBeNull();
  });

  it("picks a date from the calendar", async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(20));

    expect(onChange).toHaveBeenLastCalledWith("2024-01-20");
  });

  it("closes the calendar after picking a date", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(20));

    expect(calendar()).toBeNull();
  });

  it("shows the picked date in the segments", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(20));

    expect(segments().map((s) => s.textContent)).toEqual(["20", "01", "2024"]);
  });

  it("opens the calendar on the month of the current value", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("5");
    await userEvent.keyboard("3");
    await userEvent.keyboard("2022");

    await waitFor(() => expect(header()).toHaveTextContent("March 2022"));
  });

  it("closes the calendar on Enter", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);
    expect(calendar()).toBeInTheDocument();

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

  it("closes the calendar when the value is cleared", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(20));
    await userEvent.click(clearButton()!);

    expect(calendar()).toBeNull();
    expect(segments().map((s) => s.textContent)).toEqual(["DD", "MM", "YYYY"]);
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
    render(<DateInput value="" onChange={() => {}} format="YYYY-MM-DD" separator="-" />);

    expect(segments().map((s) => s.textContent)).toEqual(["YYYY", "MM", "DD"]);
    expect(screen.getByText("YYYY-MM-DD")).toBeInTheDocument();
  });

  it("passes hasError through", () => {
    render(<DateInput value="2024-01-05" onChange={() => {}} hasError />);

    expect(input()).toHaveAttribute("data-error", "true");
  });

  it("applies wrapperClassName and className separately", () => {
    render(
      <DateInput value="" onChange={() => {}} wrapperClassName="wrap" className="field" />
    );

    expect(wrapper()).toHaveClass("GeckoUIDateInputWrapper", "wrap");
    expect(input()).toHaveClass("GeckoUIDateInput", "field");
  });

  it("applies calendarClassName", async () => {
    render(<Controlled calendarClassName="cal" />);

    await userEvent.click(segments()[0]);

    expect(calendar()).toHaveClass("GeckoUIDateInput__calendar", "cal");
  });

  it("renders a calendar icon by default", () => {
    render(<DateInput value="" onChange={() => {}} />);

    expect(document.querySelector(".GeckoUIDateInput__calendar-icon")).toBeInTheDocument();
  });

  it("hides the calendar icon when asked", () => {
    render(<DateInput value="" onChange={() => {}} hideCalendarIcon />);

    expect(document.querySelector(".GeckoUIDateInput__calendar-icon")).toBeNull();
  });

  it("forwards onStateUpdate", async () => {
    const onStateUpdate = vi.fn();
    render(<Controlled onStateUpdate={onStateUpdate} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("5");

    expect(onStateUpdate).toHaveBeenLastCalledWith({ day: "05", month: "", year: "" });
  });

  it("marks the input focused while the calendar is open", async () => {
    render(<Controlled />);

    await userEvent.click(segments()[0]);

    expect(input()).toHaveAttribute("data-focus", "true");
  });
});
