import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BaseDateRangeInput } from ".";

const root = () => document.querySelector<HTMLElement>(".GeckoUIDateRangeInput")!;
const segments = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIDateInput__segment"));
const segmentText = () => segments().map((s) => s.textContent);
const inputs = () =>
  Array.from(document.querySelectorAll<HTMLInputElement>(".GeckoUIDateInput__hidden-input"));
const rangeSeparator = () =>
  document.querySelector<HTMLElement>(".GeckoUIDateRangeInput__range-separator");
const clearButton = () =>
  document.querySelector<HTMLButtonElement>(".GeckoUIDateInput__clear-button");

const empty = { from: null, to: null };

describe("BaseDateRangeInput", () => {
  it("renders six segments", () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} />);

    expect(segmentText()).toEqual(["DD", "MM", "YYYY", "DD", "MM", "YYYY"]);
  });

  it("orders the segments by format, start then end", () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} format="YYYY-MM-DD" />);

    expect(segmentText()).toEqual(["YYYY", "MM", "DD", "YYYY", "MM", "DD"]);
  });

  it("shows the placeholder while empty", () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} />);

    expect(screen.getByText("DD/MM/YYYY - DD/MM/YYYY")).toBeInTheDocument();
    expect(root()).toHaveAttribute("data-empty", "true");
  });

  it("shows a custom placeholder", () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} placeholder="Pick a range" />);

    expect(screen.getByText("Pick a range")).toBeInTheDocument();
  });

  it("uses a custom range separator", () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} rangeSeparator=" to " />);

    expect(rangeSeparator()).toHaveTextContent("to");
    expect(screen.getByText("DD/MM/YYYY to DD/MM/YYYY")).toBeInTheDocument();
  });

  it("fills the segments from a range value", () => {
    render(
      <BaseDateRangeInput value={{ from: "2024-01-05", to: "2024-02-10" }} onChange={() => {}} />
    );

    expect(segmentText()).toEqual(["05", "01", "2024", "10", "02", "2024"]);
  });

  it("fills only the start when there is no end", () => {
    render(<BaseDateRangeInput value={{ from: "2024-01-05", to: null }} onChange={() => {}} />);

    expect(segmentText()).toEqual(["05", "01", "2024", "DD", "MM", "YYYY"]);
  });

  it("reports the start alone while the end is incomplete", async () => {
    const onChange = vi.fn();
    render(<BaseDateRangeInput value={empty} onChange={onChange} format="YYYY-MM-DD" />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("2024");
    await userEvent.keyboard("1{ArrowRight}");
    await userEvent.keyboard("5");

    expect(onChange).toHaveBeenLastCalledWith({ from: "2024-01-05", to: null });
  });

  it("reports both ends once the range is complete", async () => {
    const onChange = vi.fn();
    render(<BaseDateRangeInput value={empty} onChange={onChange} format="YYYY-MM-DD" />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("2024");
    await userEvent.keyboard("1{ArrowRight}");
    await userEvent.keyboard("5");
    await userEvent.keyboard("2024");
    await userEvent.keyboard("2");
    await userEvent.keyboard("10");

    expect(onChange).toHaveBeenLastCalledWith({ from: "2024-01-05", to: "2024-02-10" });
  });

  it("reports null while the start is incomplete", async () => {
    const onChange = vi.fn();
    render(<BaseDateRangeInput value={empty} onChange={onChange} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("5");

    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("moves through every segment with the arrow keys", async () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} />);

    await userEvent.click(segments()[0]);
    for (let i = 1; i < 6; i++) {
      await userEvent.keyboard("{ArrowRight}");
      expect(inputs()[i]).toHaveFocus();
    }

    await userEvent.keyboard("{ArrowLeft}");
    expect(inputs()[4]).toHaveFocus();
  });

  it("crosses from the start date into the end date", async () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} />);

    await userEvent.click(segments()[2]);
    await userEvent.keyboard("{ArrowRight}");

    expect(inputs()[3]).toHaveFocus();
  });

  it("submits and blurs on Enter", async () => {
    const onSubmit = vi.fn();
    render(<BaseDateRangeInput value={empty} onChange={() => {}} onSubmit={onSubmit} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(inputs()[0]).not.toHaveFocus();
  });

  it("focuses the first segment when the container is clicked", async () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} />);

    await userEvent.click(root());

    expect(inputs()[0]).toHaveFocus();
  });

  it("clears every segment from the clear button", async () => {
    const onChange = vi.fn();
    render(
      <BaseDateRangeInput value={{ from: "2024-01-05", to: "2024-02-10" }} onChange={onChange} />
    );

    await userEvent.click(clearButton()!);

    expect(onChange).toHaveBeenCalledWith(null);
    expect(segmentText()).toEqual(["DD", "MM", "YYYY", "DD", "MM", "YYYY"]);
  });

  it("hides the clear button while empty", () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} />);

    expect(clearButton()).toBeNull();
  });

  it("hides the clear button when hideClearIcon is set", () => {
    render(
      <BaseDateRangeInput
        value={{ from: "2024-01-05", to: "2024-02-10" }}
        onChange={() => {}}
        hideClearIcon
      />
    );

    expect(clearButton()).toBeNull();
  });

  it("marks itself disabled", () => {
    render(
      <BaseDateRangeInput
        value={{ from: "2024-01-05", to: "2024-02-10" }}
        onChange={() => {}}
        disabled
      />
    );

    expect(root()).toHaveAttribute("data-state", "disabled");
    inputs().forEach((input) => expect(input).toBeDisabled());
  });

  it("marks itself read only", () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} readOnly />);

    expect(root()).toHaveAttribute("data-state", "readonly");
    inputs().forEach((input) => expect(input).toHaveAttribute("readonly"));
  });

  it("honours an explicit hasError", () => {
    render(
      <BaseDateRangeInput
        value={{ from: "2024-01-05", to: "2024-02-10" }}
        onChange={() => {}}
        hasError
      />
    );

    expect(root()).toHaveAttribute("data-error", "true");
  });

  it("renders a prefix and a suffix", () => {
    render(
      <BaseDateRangeInput
        value={empty}
        onChange={() => {}}
        prefix={<span data-testid="prefix" />}
        suffix={<span data-testid="suffix" />}
      />
    );

    expect(screen.getByTestId("prefix")).toBeInTheDocument();
    expect(screen.getByTestId("suffix")).toBeInTheDocument();
  });

  it("applies the base classes and a custom class", () => {
    render(<BaseDateRangeInput value={empty} onChange={() => {}} className="custom" />);

    expect(root()).toHaveClass("GeckoUIDateInput", "GeckoUIDateRangeInput", "custom");
  });

  it("reports the segment state as it changes", async () => {
    const onStateUpdate = vi.fn();
    render(<BaseDateRangeInput value={empty} onChange={() => {}} onStateUpdate={onStateUpdate} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("5");

    expect(onStateUpdate).toHaveBeenLastCalledWith({
      startDay: "05",
      startMonth: "",
      startYear: "",
      endDay: "",
      endMonth: "",
      endYear: ""
    });
  });
});
