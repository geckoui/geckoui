import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BaseDateInput } from ".";

const root = () => document.querySelector<HTMLElement>(".GeckoUIDateInput")!;
const segments = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIDateInput__segment"));
const segmentText = () => segments().map((s) => s.textContent);
const inputs = () =>
  Array.from(document.querySelectorAll<HTMLInputElement>(".GeckoUIDateInput__hidden-input"));
const separators = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIDateInput__separator"));
const clearButton = () =>
  document.querySelector<HTMLButtonElement>(".GeckoUIDateInput__clear-button");

describe("BaseDateInput", () => {
  it("shows the placeholder when empty", () => {
    render(<BaseDateInput value="" onChange={() => {}} />);

    expect(screen.getByText("DD/MM/YYYY")).toBeInTheDocument();
    expect(root()).toHaveAttribute("data-empty", "true");
  });

  it("shows a custom placeholder", () => {
    render(<BaseDateInput value="" onChange={() => {}} placeholder="Pick a date" />);

    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("builds the placeholder from the format and separator", () => {
    render(<BaseDateInput value="" onChange={() => {}} format="MM/DD/YYYY" separator="-" />);

    expect(screen.getByText("MM-DD-YYYY")).toBeInTheDocument();
  });

  it("renders three segments with placeholders", () => {
    render(<BaseDateInput value="" onChange={() => {}} />);

    expect(segmentText()).toEqual(["DD", "MM", "YYYY"]);
  });

  it("orders the segments by format", () => {
    render(<BaseDateInput value="" onChange={() => {}} format="YYYY-MM-DD" />);

    expect(segmentText()).toEqual(["YYYY", "MM", "DD"]);
  });

  it("renders the separator between segments", () => {
    render(<BaseDateInput value="" onChange={() => {}} separator="." />);

    expect(separators().map((s) => s.textContent)).toEqual([".", "."]);
  });

  it("fills the segments from an ISO value", () => {
    render(<BaseDateInput value="2024-01-05" onChange={() => {}} />);

    expect(segmentText()).toEqual(["05", "01", "2024"]);
  });

  it("is not empty once it has a value", () => {
    render(<BaseDateInput value="2024-01-05" onChange={() => {}} />);

    expect(root()).not.toHaveAttribute("data-empty");
    expect(screen.queryByText("DD/MM/YYYY")).toBeNull();
  });

  it("ignores a value that is not an ISO date", () => {
    render(<BaseDateInput value="05/01/2024" onChange={() => {}} />);

    expect(segmentText()).toEqual(["DD", "MM", "YYYY"]);
  });

  // A segment only auto-advances once its sanitised digit count is full, and leading
  // zeros are stripped, so "1" for the month waits for a possible 10, 11 or 12.
  it("reports a complete date in ISO format", async () => {
    const onChange = vi.fn();
    render(<BaseDateInput value="" onChange={onChange} format="YYYY-MM-DD" />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("2024");
    await userEvent.keyboard("1{ArrowRight}");
    await userEvent.keyboard("5");

    expect(onChange).toHaveBeenLastCalledWith("2024-01-05");
  });

  it("reports null while the date is incomplete", async () => {
    const onChange = vi.fn();
    render(<BaseDateInput value="" onChange={onChange} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("05");

    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("moves to the next segment once one is full", async () => {
    render(<BaseDateInput value="" onChange={() => {}} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("05");

    expect(inputs()[1]).toHaveFocus();
  });

  it("keeps a single digit that could still start a longer number", async () => {
    render(<BaseDateInput value="" onChange={() => {}} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("1");

    expect(segmentText()[0]).toBe("01");
    expect(inputs()[0]).toHaveFocus();
  });

  it("pads a single digit that cannot start a longer number", async () => {
    render(<BaseDateInput value="" onChange={() => {}} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("5");

    expect(segmentText()[0]).toBe("05");
  });

  it("clamps a month above twelve", async () => {
    render(<BaseDateInput value="" onChange={() => {}} format="MM/DD/YYYY" />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("19");

    expect(segmentText()[0]).toBe("12");
  });

  it("clamps a day to the days in the month", async () => {
    const onChange = vi.fn();
    render(<BaseDateInput value="" onChange={onChange} format="YYYY-MM-DD" />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("2023");
    await userEvent.keyboard("2");
    await userEvent.keyboard("29");

    expect(onChange).toHaveBeenLastCalledWith("2023-02-28");
  });

  it("reports an invalid date as an error", async () => {
    render(<BaseDateInput value="" onChange={() => {}} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("05");

    expect(root()).toHaveAttribute("data-error", "true");
  });

  it("clears the error once the date is complete", async () => {
    render(<BaseDateInput value="" onChange={() => {}} format="YYYY-MM-DD" />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("2024");
    await userEvent.keyboard("1{ArrowRight}");
    await userEvent.keyboard("5");

    expect(root()).not.toHaveAttribute("data-error");
  });

  it("honours an explicit hasError", () => {
    render(<BaseDateInput value="2024-01-05" onChange={() => {}} hasError />);

    expect(root()).toHaveAttribute("data-error", "true");
  });

  it("focuses the first segment when the container is clicked", async () => {
    render(<BaseDateInput value="" onChange={() => {}} />);

    await userEvent.click(root());

    expect(inputs()[0]).toHaveFocus();
  });

  it("focuses the clicked segment", async () => {
    render(<BaseDateInput value="" onChange={() => {}} />);

    await userEvent.click(segments()[2]);

    expect(inputs()[2]).toHaveFocus();
  });

  describe("keyboard", () => {
    it("moves between segments with the arrow keys", async () => {
      render(<BaseDateInput value="" onChange={() => {}} />);

      await userEvent.click(segments()[0]);
      await userEvent.keyboard("{ArrowRight}");
      expect(inputs()[1]).toHaveFocus();

      await userEvent.keyboard("{ArrowLeft}");
      expect(inputs()[0]).toHaveFocus();
    });

    it("moves to the next segment with the slash key", async () => {
      render(<BaseDateInput value="" onChange={() => {}} />);

      await userEvent.click(segments()[0]);
      await userEvent.keyboard("/");

      expect(inputs()[1]).toHaveFocus();
    });

    it("moves between segments with Tab and Shift+Tab", async () => {
      render(<BaseDateInput value="" onChange={() => {}} />);

      await userEvent.click(segments()[0]);
      await userEvent.tab();
      expect(inputs()[1]).toHaveFocus();

      await userEvent.tab({ shift: true });
      expect(inputs()[0]).toHaveFocus();
    });

    it("stays put when tabbing past the last segment", async () => {
      render(<BaseDateInput value="" onChange={() => {}} />);

      await userEvent.click(segments()[2]);
      await userEvent.tab();

      expect(inputs()[2]).toHaveFocus();
    });

    it("submits and blurs on Enter", async () => {
      const onSubmit = vi.fn();
      render(<BaseDateInput value="" onChange={() => {}} onSubmit={onSubmit} />);

      await userEvent.click(segments()[0]);
      await userEvent.keyboard("{Enter}");

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(inputs()[0]).not.toHaveFocus();
    });
  });

  describe("clear button", () => {
    it("is hidden while empty", () => {
      render(<BaseDateInput value="" onChange={() => {}} />);

      expect(clearButton()).toBeNull();
    });

    it("shows once there is a value", () => {
      render(<BaseDateInput value="2024-01-05" onChange={() => {}} />);

      expect(clearButton()).toBeInTheDocument();
    });

    it("is hidden when hideClearIcon is set", () => {
      render(<BaseDateInput value="2024-01-05" onChange={() => {}} hideClearIcon />);

      expect(clearButton()).toBeNull();
    });

    it("clears every segment and reports null", async () => {
      const onChange = vi.fn();
      const onSubmit = vi.fn();
      render(<BaseDateInput value="2024-01-05" onChange={onChange} onSubmit={onSubmit} />);

      await userEvent.click(clearButton()!);

      expect(onChange).toHaveBeenCalledWith(null);
      expect(onSubmit).toHaveBeenCalled();
      expect(segmentText()).toEqual(["DD", "MM", "YYYY"]);
    });
  });

  describe("state", () => {
    it("marks itself enabled by default", () => {
      render(<BaseDateInput value="" onChange={() => {}} />);

      expect(root()).toHaveAttribute("data-state", "enabled");
    });

    it("marks itself disabled", () => {
      render(<BaseDateInput value="2024-01-05" onChange={() => {}} disabled />);

      expect(root()).toHaveAttribute("data-state", "disabled");
      inputs().forEach((input) => expect(input).toBeDisabled());
      expect(clearButton()).toBeNull();
    });

    it("does not focus a segment when disabled", async () => {
      render(<BaseDateInput value="" onChange={() => {}} disabled />);

      await userEvent.click(root());

      expect(inputs()[0]).not.toHaveFocus();
    });

    it("marks itself read only", () => {
      render(<BaseDateInput value="2024-01-05" onChange={() => {}} readOnly />);

      expect(root()).toHaveAttribute("data-state", "readonly");
      inputs().forEach((input) => expect(input).toHaveAttribute("readonly"));
    });

    it("marks focus when hasFocus is set", () => {
      render(<BaseDateInput value="" onChange={() => {}} hasFocus />);

      expect(root()).toHaveAttribute("data-focus", "true");
      expect(root()).not.toHaveAttribute("data-empty");
    });
  });

  describe("decoration", () => {
    it("renders a prefix and a suffix", () => {
      render(
        <BaseDateInput
          value=""
          onChange={() => {}}
          prefix={<span data-testid="prefix" />}
          suffix={<span data-testid="suffix" />}
        />
      );

      expect(screen.getByTestId("prefix")).toBeInTheDocument();
      expect(screen.getByTestId("suffix")).toBeInTheDocument();
    });

    it("renders a calendar icon by default", () => {
      render(<BaseDateInput value="" onChange={() => {}} />);

      expect(document.querySelector(".GeckoUIDateInput__calendar-icon")).toBeInTheDocument();
    });

    it("hides the calendar icon when asked", () => {
      render(<BaseDateInput value="" onChange={() => {}} hideCalendarIcon />);

      expect(document.querySelector(".GeckoUIDateInput__calendar-icon")).toBeNull();
    });

    it("renders a custom calendar icon instead", () => {
      render(
        <BaseDateInput
          value=""
          onChange={() => {}}
          renderCalendarIcon={<span data-testid="custom-icon" />}
        />
      );

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      expect(document.querySelector(".GeckoUIDateInput__calendar-icon")).toBeNull();
    });

    it("applies the base class and a custom class", () => {
      render(<BaseDateInput value="" onChange={() => {}} className="custom" />);

      expect(root()).toHaveClass("GeckoUIDateInput", "custom");
    });
  });

  it("reports the segment state as it changes", async () => {
    const onStateUpdate = vi.fn();
    render(<BaseDateInput value="" onChange={() => {}} onStateUpdate={onStateUpdate} />);

    await userEvent.click(segments()[0]);
    await userEvent.keyboard("05");

    expect(onStateUpdate).toHaveBeenLastCalledWith({ day: "05", month: "", year: "" });
  });
});
