import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, type UseFormProps, useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RHFDateInput, RHFDateRangeInput, RHFFileInput } from ".";

function Form({
  children,
  onSubmit,
  ...options
}: { children: ReactNode; onSubmit?: (values: unknown) => void } & UseFormProps) {
  const methods = useForm(options);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((values) => onSubmit?.(values))}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

const submit = () => userEvent.click(screen.getByRole("button", { name: "Submit" }));
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
      expect(document.querySelector(".GeckoUIDateRangeInput")).toHaveAttribute("data-error", "true")
    );
  });
});

describe("RHFFileInput", () => {
  const makeFile = (name: string) => new File(["content"], name, { type: "text/plain" });

  beforeEach(() => {
    let issued = 0;

    globalThis.URL.createObjectURL = vi.fn(() => `blob:preview-${++issued}`);
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it("renders a file input", () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;
    expect(input).toHaveAttribute("type", "file");
  });

  it("stores a single file", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <Form defaultValues={{ doc: null }} onSubmit={onSubmit}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;
    await userEvent.upload(input, makeFile("a.txt"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect((onSubmit.mock.calls[0][0] as { doc: File }).doc.name).toBe("a.txt");
  });

  it("revokes the preview of a file that has been replaced", async () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;

    await userEvent.upload(input, makeFile("a.txt"));
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    // Picking again drops the first file, whose blob would otherwise be pinned for good
    await userEvent.upload(input, makeFile("b.txt"));

    await waitFor(() => expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-1"));
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it("keeps the preview of the file it is still holding", async () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;

    await userEvent.upload(input, makeFile("a.txt"));

    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it("stores an array when multiple is set", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <Form defaultValues={{ docs: null }} onSubmit={onSubmit}>
        <RHFFileInput name="docs" multiple />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;
    await userEvent.upload(input, [makeFile("a.txt"), makeFile("b.txt")]);
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const { docs } = onSubmit.mock.calls[0][0] as { docs: File[] };
    expect(docs.map((f) => f.name)).toEqual(["a.txt", "b.txt"]);
  });

  it("attaches a preview url to each file", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" onChange={onChange} />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;
    await userEvent.upload(input, makeFile("a.txt"));

    expect(onChange.mock.calls[0][0]).toMatchObject({ preview: "blob:preview-1" });
  });

  it("renders custom content and marks the input", () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" render={() => <span data-testid="drop-zone" />} />
      </Form>
    );

    expect(screen.getByTestId("drop-zone")).toBeInTheDocument();
    expect(container.querySelector(".GeckoUIRHFFileInput__input")).toHaveAttribute("data-custom");
  });

  it("disables the input", () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" disabled />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFFileInput__input")).toBeDisabled();
  });

  it("applies the base class and a custom class", () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" className="custom" />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFFileInput")).toHaveClass("custom");
  });
});
