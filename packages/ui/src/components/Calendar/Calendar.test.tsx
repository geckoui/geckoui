import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Calendar } from ".";
import type { CalendarRef, DateRange } from "./Calendar/Calendar.types";

const container = () => document.querySelector<HTMLElement>(".GeckoUICalendar")!;
const header = () => document.querySelector<HTMLElement>(".GeckoUICalendar__header__title")!;
const leftArrow = () =>
  document.querySelector<HTMLElement>(".GeckoUICalendar__header__arrow-button--left")!;
const rightArrow = () =>
  document.querySelector<HTMLElement>(".GeckoUICalendar__header__arrow-button--right")!;
const dayButtons = () =>
  Array.from(document.querySelectorAll<HTMLButtonElement>(".GeckoUICalendar__day-picker__button"));
const dayOfActiveMonth = (day: number) =>
  dayButtons().find((b) => b.dataset.activeMonth === "true" && b.textContent === String(day))!;
const monthButtons = () =>
  Array.from(document.querySelectorAll<HTMLButtonElement>(".GeckoUICalendar__month-picker__button"));
const yearButtons = () =>
  Array.from(document.querySelectorAll<HTMLButtonElement>(".GeckoUICalendar__year-picker__button"));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date(2024, 0, 15, 12));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Calendar", () => {
  it("opens on the current month when nothing is selected", () => {
    render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

    expect(header()).toHaveTextContent("January 2024");
  });

  it("opens on the month of the selected date", () => {
    render(<Calendar selectedDate="2023-07-04" onSelectDate={() => {}} />);

    expect(header()).toHaveTextContent("July 2023");
  });

  it("falls back to today for an invalid selected date", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Calendar selectedDate="04/07/2023" onSelectDate={() => {}} />);

    expect(header()).toHaveTextContent("January 2024");
    spy.mockRestore();
  });

  it("warns about an invalid selected date", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Calendar selectedDate="04/07/2023" onSelectDate={() => {}} />);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Invalid date format"));
    spy.mockRestore();
  });

  it("starts in day view", () => {
    render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

    expect(container()).toHaveAttribute("data-mode", "day");
    expect(dayButtons()).toHaveLength(42);
  });

  it("marks the mode on the container", () => {
    render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

    expect(container()).toHaveAttribute("data-selection", "single");
  });

  it("reports the clicked date in ISO format", async () => {
    const onSelectDate = vi.fn();
    render(<Calendar selectedDate={null} onSelectDate={onSelectDate} />);

    await userEvent.click(dayOfActiveMonth(5));

    expect(onSelectDate).toHaveBeenCalledWith("2024-01-05");
  });

  it("marks the selected day", () => {
    render(<Calendar selectedDate="2024-01-05" onSelectDate={() => {}} />);

    expect(dayOfActiveMonth(5)).toHaveAttribute("data-selected", "true");
    expect(dayOfActiveMonth(6)).not.toHaveAttribute("data-selected");
  });

  it("marks today", () => {
    render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

    expect(dayOfActiveMonth(15)).toHaveAttribute("data-today", "true");
  });

  it("marks days outside the active month", () => {
    render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

    expect(dayButtons()[0]).not.toHaveAttribute("data-active-month");
  });

  it("moves to the previous month", async () => {
    render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

    await userEvent.click(leftArrow());

    expect(header()).toHaveTextContent("December 2023");
  });

  it("moves to the next month", async () => {
    render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

    await userEvent.click(rightArrow());

    expect(header()).toHaveTextContent("February 2024");
  });

  it("rolls the year over when paging past December", async () => {
    render(<Calendar selectedDate="2024-12-01" onSelectDate={() => {}} />);

    await userEvent.click(rightArrow());

    expect(header()).toHaveTextContent("January 2025");
  });

  it("disables days rejected by disableDate", async () => {
    const onSelectDate = vi.fn();
    render(
      <Calendar
        selectedDate={null}
        onSelectDate={onSelectDate}
        disableDate={(date) => date === "2024-01-05"}
      />
    );

    expect(dayOfActiveMonth(5)).toBeDisabled();
    expect(dayOfActiveMonth(5)).toHaveAttribute("data-disabled", "true");

    await userEvent.click(dayOfActiveMonth(5));
    expect(onSelectDate).not.toHaveBeenCalled();
  });

  it("renders a custom day cell", () => {
    render(
      <Calendar
        selectedDate="2024-01-05"
        onSelectDate={() => {}}
        renderDayCell={({ day, isSelected }) => (
          <span data-testid={`cell-${day}`}>{isSelected ? "*" : day}</span>
        )}
      />
    );

    expect(screen.getAllByTestId("cell-5")[0]).toHaveTextContent("*");
  });

  describe("views", () => {
    it("switches to month view from the header", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());

      expect(container()).toHaveAttribute("data-mode", "month");
      expect(monthButtons()).toHaveLength(12);
      expect(header()).toHaveTextContent("2024");
    });

    it("marks the active month", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());

      expect(monthButtons()[0]).toHaveAttribute("data-selected", "true");
    });

    it("picks a month and returns to day view", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());
      await userEvent.click(screen.getByRole("button", { name: "Mar" }));

      expect(container()).toHaveAttribute("data-mode", "day");
      expect(header()).toHaveTextContent("March 2024");
    });

    it("pages the year from month view", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());
      await userEvent.click(rightArrow());

      expect(header()).toHaveTextContent("2025");
    });

    it("switches to year view from the month header", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());
      await userEvent.click(header());

      expect(container()).toHaveAttribute("data-mode", "year");
      expect(yearButtons()).toHaveLength(12);
    });

    it("shows a decade in year view", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());
      await userEvent.click(header());

      expect(header()).toHaveTextContent("2020 - 2029");
      expect(yearButtons()[0]).toHaveTextContent("2019");
      expect(yearButtons().at(-1)).toHaveTextContent("2030");
    });

    it("marks the first and last year as outside the decade", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());
      await userEvent.click(header());

      expect(yearButtons()[0]).toHaveAttribute("data-prev-next", "true");
      expect(yearButtons()[1]).not.toHaveAttribute("data-prev-next");
    });

    it("pages the decade", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());
      await userEvent.click(header());
      await userEvent.click(rightArrow());

      expect(header()).toHaveTextContent("2030 - 2039");
    });

    it("picks a year and drops back to month view", async () => {
      render(<Calendar selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());
      await userEvent.click(header());
      await userEvent.click(screen.getByRole("button", { name: "2026" }));

      expect(container()).toHaveAttribute("data-mode", "month");
      expect(header()).toHaveTextContent("2026");
    });
  });

  describe("range mode", () => {
    function RangeCalendar({ onSelectRange }: { onSelectRange?: (r: DateRange | null) => void }) {
      const [range, setRange] = useState<DateRange | null>({ from: null });
      return (
        <Calendar
          mode="range"
          selectedRange={range ?? { from: null }}
          onSelectRange={(r) => {
            setRange(r);
            onSelectRange?.(r);
          }}
        />
      );
    }

    it("marks the container as a range calendar", () => {
      render(<RangeCalendar />);

      expect(container()).toHaveAttribute("data-selection", "range");
    });

    it("renders only the active month as buttons", () => {
      render(<RangeCalendar />);

      expect(dayButtons().every((b) => b.dataset.activeMonth === "true")).toBe(true);
      expect(dayButtons()).toHaveLength(31);
    });

    it("reports the start on the first click", async () => {
      const onSelectRange = vi.fn();
      render(<RangeCalendar onSelectRange={onSelectRange} />);

      await userEvent.click(dayOfActiveMonth(10));

      expect(onSelectRange).toHaveBeenCalledWith({ from: "2024-01-10", to: undefined });
    });

    it("reports both ends on the second click", async () => {
      const onSelectRange = vi.fn();
      render(<RangeCalendar onSelectRange={onSelectRange} />);

      await userEvent.click(dayOfActiveMonth(10));
      await userEvent.click(dayOfActiveMonth(20));

      expect(onSelectRange).toHaveBeenLastCalledWith({ from: "2024-01-10", to: "2024-01-20" });
    });

    it("swaps the ends when the second click is earlier", async () => {
      const onSelectRange = vi.fn();
      render(<RangeCalendar onSelectRange={onSelectRange} />);

      await userEvent.click(dayOfActiveMonth(20));
      await userEvent.click(dayOfActiveMonth(10));

      expect(onSelectRange).toHaveBeenLastCalledWith({ from: "2024-01-10", to: "2024-01-20" });
    });

    it("starts a new range on the next click", async () => {
      const onSelectRange = vi.fn();
      render(<RangeCalendar onSelectRange={onSelectRange} />);

      await userEvent.click(dayOfActiveMonth(10));
      await userEvent.click(dayOfActiveMonth(20));
      await userEvent.click(dayOfActiveMonth(5));

      expect(onSelectRange).toHaveBeenLastCalledWith({ from: "2024-01-05", to: undefined });
    });

    it("marks the ends and the days between", () => {
      render(
        <Calendar
          mode="range"
          selectedRange={{ from: "2024-01-10", to: "2024-01-12" }}
          onSelectRange={() => {}}
        />
      );

      expect(dayOfActiveMonth(10)).toHaveAttribute("data-range-start", "true");
      expect(dayOfActiveMonth(12)).toHaveAttribute("data-range-end", "true");
      expect(dayOfActiveMonth(11)).toHaveAttribute("data-in-range", "true");
      expect(dayOfActiveMonth(13)).not.toHaveAttribute("data-in-range");
    });

    it("previews the range while hovering after the first click", async () => {
      render(<RangeCalendar />);

      await userEvent.click(dayOfActiveMonth(10));
      await userEvent.hover(dayOfActiveMonth(13));

      expect(dayOfActiveMonth(11)).toHaveAttribute("data-hover-preview", "true");
      expect(dayOfActiveMonth(10)).toHaveAttribute("data-hover-preview-start", "true");
      expect(dayOfActiveMonth(13)).toHaveAttribute("data-hover-preview-end", "true");
    });

    it("does not preview before the first click", async () => {
      render(<RangeCalendar />);

      await userEvent.hover(dayOfActiveMonth(13));

      expect(dayOfActiveMonth(13)).not.toHaveAttribute("data-hover-preview");
    });

    it("opens on the month of the range start", () => {
      render(
        <Calendar
          mode="range"
          selectedRange={{ from: "2023-07-04", to: "2023-07-10" }}
          onSelectRange={() => {}}
        />
      );

      expect(header()).toHaveTextContent("July 2023");
    });
  });

  describe("calendarRef", () => {
    it("moves to a given month and year", async () => {
      const ref = createRef<CalendarRef>();
      render(<Calendar calendarRef={ref} selectedDate={null} onSelectDate={() => {}} />);

      await userEvent.click(header());
      act(() => ref.current!.moveTo(6, 2022));

      expect(container()).toHaveAttribute("data-mode", "day");
      expect(header()).toHaveTextContent("June 2022");
    });

    it("clears a single selection", () => {
      const onSelectDate = vi.fn();
      const ref = createRef<CalendarRef>();
      render(<Calendar calendarRef={ref} selectedDate="2024-01-05" onSelectDate={onSelectDate} />);

      ref.current!.clearSelection();

      expect(onSelectDate).toHaveBeenCalledWith("");
    });

    it("clears a range selection", () => {
      const onSelectRange = vi.fn();
      const ref = createRef<CalendarRef>();
      render(
        <Calendar
          mode="range"
          calendarRef={ref}
          selectedRange={{ from: "2024-01-05", to: "2024-01-08" }}
          onSelectRange={onSelectRange}
        />
      );

      ref.current!.clearSelection();

      expect(onSelectRange).toHaveBeenCalledWith(null);
    });
  });
});
