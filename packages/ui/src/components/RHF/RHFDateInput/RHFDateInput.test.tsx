import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RHFDateInput } from "..";
import { Form, submit } from "../testUtils";

const dateInput = () => document.querySelector<HTMLElement>(".GeckoUIDateInput")!;

const segments = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIDateInput__segment"));

const dayOfActiveMonth = (day: number) =>
  Array.from(
    document.querySelectorAll<HTMLButtonElement>(".GeckoUICalendar__day-picker__button")
  ).find((b) => b.dataset.activeMonth === "true" && b.textContent === String(day))!;

describe("RHFDateInput", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2024, 0, 15, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the stored date", () => {
    render(
      <Form defaultValues={{ dob: "2024-01-05" }}>
        <RHFDateInput name="dob" />
      </Form>
    );

    expect(segments().map((s) => s.textContent)).toEqual(["05", "01", "2024"]);
  });

  it("shows an empty input for a missing value", () => {
    render(
      <Form defaultValues={{ dob: null }}>
        <RHFDateInput name="dob" />
      </Form>
    );

    expect(segments().map((s) => s.textContent)).toEqual(["DD", "MM", "YYYY"]);
  });

  it("stores a date picked from the calendar", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ dob: "" }} onSubmit={onSubmit}>
        <RHFDateInput name="dob" />
      </Form>
    );

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(20));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ dob: "2024-01-20" }));
  });

  it("calls onChange with the picked date", async () => {
    const onChange = vi.fn();
    render(
      <Form defaultValues={{ dob: "" }}>
        <RHFDateInput name="dob" onChange={onChange} />
      </Form>
    );

    await userEvent.click(segments()[0]);
    await userEvent.click(dayOfActiveMonth(20));

    expect(onChange).toHaveBeenCalledWith("2024-01-20");
  });

  it("marks the input as errored after a failed submit", async () => {
    render(
      <Form defaultValues={{ dob: "" }}>
        <RHFDateInput name="dob" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() => expect(dateInput()).toHaveAttribute("data-error", "true"));
  });

  it("passes the format through", () => {
    render(
      <Form defaultValues={{ dob: "" }}>
        <RHFDateInput name="dob" format="YYYY-MM-DD" />
      </Form>
    );

    expect(segments().map((s) => s.textContent)).toEqual(["YYYY", "MM", "DD"]);
  });
});
