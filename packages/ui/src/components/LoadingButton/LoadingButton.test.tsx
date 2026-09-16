import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LoadingButton } from ".";

const spinner = () => document.querySelector(".GeckoUISpinnerIcon");

describe("LoadingButton", () => {
  it("renders a button with its children", () => {
    render(<LoadingButton>Save</LoadingButton>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("shows no spinner when not loading", () => {
    render(<LoadingButton>Save</LoadingButton>);

    expect(spinner()).toBeNull();
    expect(screen.getByRole("button")).not.toHaveAttribute("data-loading");
  });

  it("shows a spinner while loading", () => {
    render(<LoadingButton loading>Save</LoadingButton>);

    expect(spinner()).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("data-loading", "true");
  });

  it("disables the button while loading", () => {
    render(<LoadingButton loading>Save</LoadingButton>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("stays disabled when disabled but not loading", () => {
    render(<LoadingButton disabled>Save</LoadingButton>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire onClick while loading", async () => {
    const onClick = vi.fn();
    render(
      <LoadingButton loading onClick={onClick}>
        Save
      </LoadingButton>
    );

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick when idle", async () => {
    const onClick = vi.fn();
    render(<LoadingButton onClick={onClick}>Save</LoadingButton>);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("swaps the label for loadingText while loading", () => {
    render(
      <LoadingButton loading loadingText="Saving...">
        Save
      </LoadingButton>
    );

    expect(screen.getByRole("button")).toHaveTextContent("Saving...");
    expect(screen.queryByText("Save")).toBeNull();
  });

  it("ignores loadingText when not loading", () => {
    render(<LoadingButton loadingText="Saving...">Save</LoadingButton>);

    expect(screen.getByRole("button")).toHaveTextContent("Save");
  });

  it("keeps the original label without loadingText", () => {
    render(<LoadingButton loading>Save</LoadingButton>);

    expect(screen.getByRole("button")).toHaveTextContent("Save");
  });

  it("puts the spinner before the label by default", () => {
    render(<LoadingButton loading>Save</LoadingButton>);

    const button = screen.getByRole("button");
    expect(button.firstElementChild).toHaveClass("GeckoUISpinnerIcon");
  });

  it("puts the spinner after the label with spinnerPosition end", () => {
    render(
      <LoadingButton loading spinnerPosition="end">
        Save
      </LoadingButton>
    );

    const button = screen.getByRole("button");
    expect(button.lastElementChild).toHaveClass("GeckoUISpinnerIcon");
  });

  it("renders exactly one spinner", () => {
    render(
      <LoadingButton loading spinnerPosition="end">
        Save
      </LoadingButton>
    );

    expect(document.querySelectorAll(".GeckoUISpinnerIcon")).toHaveLength(1);
  });

  it("keeps non string children as they are while loading", () => {
    render(
      <LoadingButton loading>
        <span data-testid="node">Save</span>
      </LoadingButton>
    );

    expect(screen.getByTestId("node")).toBeInTheDocument();
  });

  it("defaults to the filled variant", () => {
    render(<LoadingButton>Save</LoadingButton>);

    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "filled");
  });

  it("passes variant, color and size through to Button", () => {
    render(
      <LoadingButton variant="outlined" color="danger" size="lg">
        Save
      </LoadingButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "outlined");
    expect(button).toHaveAttribute("data-color", "danger");
    expect(button).toHaveAttribute("data-size", "lg");
  });

  it("applies the base class and a custom class", () => {
    render(<LoadingButton className="custom">Save</LoadingButton>);

    expect(screen.getByRole("button")).toHaveClass("GeckoUILoadingButton", "custom");
  });

  it("passes native button attributes through", () => {
    render(<LoadingButton type="submit">Save</LoadingButton>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
