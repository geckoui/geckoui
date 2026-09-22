import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RHFDateRangeInput } from "..";
import { Form, submit } from "../testUtils";

const segments = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIDateInput__segment"));

const dayOfActiveMonth = (day: number) =>
  Array.from(
    document.querySelectorAll<HTMLButtonElement>(".GeckoUICalendar__day-picker__button")
  ).find((b) => b.dataset.activeMonth === "true" && b.textContent === String(day))!;

describe("RHFDateRangeInput", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2024, 0, 15, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the stored range", () => {
    render(
      <Form defaultValues={{ stay: { from: "2024-01-05", to: "2024-01-10" } }}>
        <RHFDateRangeInput name="stay" />
      </Form>
    );

    expect(segments().map((s) => s.textContent)).toEqual(["05", "01", "2024", "10", "01", "2024"]);
  });

  it("shows an empty input for a missing value", () => {
    render(
      <Form defaultValues={{ stay: null }}>
        <RHFDateRangeInput name="stay" />
      </Form>
    );

    expect(segments().map((s) => s.textContent)).toEqual(["DD", "MM", "YYYY", "DD", "MM", "YYYY"]);
  });

  it("stores a range picked from the calendar", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ stay: null }} onSubmit={onSubmit}>
        <RHFDateRangeInput name="stay" />
      </Form>
    );

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(10));
    await userEvent.click(dayOfActiveMonth(20));
    await submit();

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        stay: { from: "2024-01-10", to: "2024-01-20" }
      })
    );
  });

  it("calls onChange with the picked range", async () => {
    const onChange = vi.fn();
    render(
      <Form defaultValues={{ stay: null }}>
        <RHFDateRangeInput name="stay" onChange={onChange} />
      </Form>
    );

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(10));
    await userEvent.click(dayOfActiveMonth(20));

    expect(onChange).toHaveBeenLastCalledWith({ from: "2024-01-10", to: "2024-01-20" });
  });

  it("marks the input as errored after a failed submit", async () => {
    render(
      <Form defaultValues={{ stay: null }}>
        <RHFDateRangeInput name="stay" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() =>
      expect(document.querySelector(".GeckoUIDateRangeInput")).toHaveAttribute(
        "aria-invalid",
        "true"
      )
    );
  });
});
