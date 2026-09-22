import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Label } from ".";

describe("Label", () => {
  it("renders its children", () => {
    render(<Label>Username</Label>);

    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders a label element", () => {
    render(<Label htmlFor="field">Username</Label>);

    const label = screen.getByText("Username").closest("label");
    expect(label).toHaveAttribute("for", "field");
  });

  it("shows no required indicator by default", () => {
    const { container } = render(<Label>Username</Label>);

    expect(container.querySelector(".GeckoUILabel__required-indicator")).toBeNull();
  });

  it("shows a required indicator when required", () => {
    const { container } = render(<Label required>Username</Label>);

    expect(container.querySelector(".GeckoUILabel__required-indicator")).toHaveTextContent("*");
  });

  it("renders no tooltip trigger without a tooltip", () => {
    const { container } = render(<Label>Username</Label>);

    expect(container.querySelector(".GeckoUILabel__tooltip-icon")).toBeNull();
  });

  it("renders the default tooltip icon when a tooltip is given", () => {
    const { container } = render(<Label tooltip="Help text">Username</Label>);

    expect(container.querySelector(".GeckoUILabel__tooltip-icon")).toBeInTheDocument();
  });

  it("shows the tooltip content on hover", async () => {
    const { container } = render(<Label tooltip="Help text">Username</Label>);

    await userEvent.hover(container.querySelector(".GeckoUILabel__tooltip-icon")!);

    expect(await screen.findAllByText("Help text")).not.toHaveLength(0);
  });

  it("renders a custom tooltip icon instead of the default", () => {
    const { container } = render(
      <Label tooltip="Help" tooltipIcon={<span data-testid="custom-icon" />}>
        Username
      </Label>
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(container.querySelector(".GeckoUILabel__tooltip-icon")).toBeNull();
  });

  it("applies the base class and a custom class", () => {
    render(<Label className="custom">Username</Label>);

    expect(screen.getByText("Username").closest("label")).toHaveClass("GeckoUILabel", "custom");
  });

  it("passes through native label attributes", () => {
    render(<Label id="lbl">Username</Label>);

    expect(screen.getByText("Username").closest("label")).toHaveAttribute("id", "lbl");
  });
});
