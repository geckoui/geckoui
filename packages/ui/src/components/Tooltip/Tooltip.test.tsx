import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from ".";

describe("Tooltip", () => {
  it("renders the trigger", () => {
    render(<Tooltip content="Help">Hover me</Tooltip>);

    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("keeps the tooltip hidden until hovered", () => {
    render(<Tooltip content="Help">Hover me</Tooltip>);

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows the tooltip on hover", async () => {
    render(
      <Tooltip content="Help" delayDuration={0}>
        Hover me
      </Tooltip>
    );

    await userEvent.hover(screen.getByText("Hover me"));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Help");
  });

  it("hides the tooltip when the pointer leaves", async () => {
    render(
      <Tooltip content="Help" delayDuration={0}>
        Hover me
      </Tooltip>
    );

    await userEvent.hover(screen.getByText("Hover me"));
    await screen.findByRole("tooltip");
    await userEvent.unhover(screen.getByText("Hover me"));

    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });

  it("shows the tooltip on focus and hides it on blur", async () => {
    render(
      <Tooltip content="Help" delayDuration={0} triggerAsChild>
        <button type="button">Hover me</button>
      </Tooltip>
    );

    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await userEvent.tab();
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });

  it("renders the children directly when there is no content", () => {
    const { container } = render(<Tooltip>Hover me</Tooltip>);

    expect(container.querySelector(".GeckoUITooltip__trigger")).toBeNull();
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("wraps the children in a span trigger by default", () => {
    render(<Tooltip content="Help">Hover me</Tooltip>);

    expect(screen.getByText("Hover me").tagName).toBe("SPAN");
    expect(screen.getByText("Hover me")).toHaveClass("GeckoUITooltip__trigger");
  });

  it("uses the child as the trigger with triggerAsChild", () => {
    render(
      <Tooltip content="Help" triggerAsChild>
        <button type="button">Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button", { name: "Hover me" });
    expect(trigger.parentElement).not.toHaveClass("GeckoUITooltip__trigger");
  });

  it("merges triggerClassName onto the child trigger", () => {
    render(
      <Tooltip content="Help" triggerAsChild triggerClassName="custom-trigger">
        <button type="button" className="mine">
          Hover me
        </button>
      </Tooltip>
    );

    expect(screen.getByRole("button")).toHaveClass("mine", "custom-trigger");
  });

  it("applies a custom class to the tooltip", async () => {
    render(
      <Tooltip content="Help" delayDuration={0} className="custom">
        Hover me
      </Tooltip>
    );

    await userEvent.hover(screen.getByText("Hover me"));

    expect(await screen.findByRole("tooltip")).toHaveClass("GeckoUITooltip", "custom");
  });

  it("applies the background colour to the tooltip", async () => {
    render(
      <Tooltip content="Help" delayDuration={0} backgroundColor="rgb(255, 0, 0)">
        Hover me
      </Tooltip>
    );

    await userEvent.hover(screen.getByText("Hover me"));

    expect(await screen.findByRole("tooltip")).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
  });

  it("renders a component as content", async () => {
    render(
      <Tooltip content={() => <b data-testid="rich">Rich</b>} delayDuration={0}>
        Hover me
      </Tooltip>
    );

    await userEvent.hover(screen.getByText("Hover me"));

    expect(await screen.findByTestId("rich")).toBeInTheDocument();
  });

  it("renders the tooltip in a portal, outside the trigger", async () => {
    const { container } = render(
      <Tooltip content="Help" delayDuration={0}>
        Hover me
      </Tooltip>
    );

    await userEvent.hover(screen.getByText("Hover me"));
    const tooltip = await screen.findByRole("tooltip");

    expect(container.contains(tooltip)).toBe(false);
  });

  describe("delay", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("waits for the delay before showing", async () => {
      render(<Tooltip content="Help">Hover me</Tooltip>);

      fireEvent.mouseEnter(screen.getByText("Hover me"));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(699);
      });
      expect(screen.queryByRole("tooltip")).toBeNull();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("cancels the pending tooltip when the pointer leaves early", async () => {
      render(<Tooltip content="Help">Hover me</Tooltip>);

      fireEvent.mouseEnter(screen.getByText("Hover me"));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });
      fireEvent.mouseLeave(screen.getByText("Hover me"));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      expect(screen.queryByRole("tooltip")).toBeNull();
    });

    it("honours a custom delay", async () => {
      render(
        <Tooltip content="Help" delayDuration={200}>
          Hover me
        </Tooltip>
      );

      fireEvent.mouseEnter(screen.getByText("Hover me"));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(199);
      });
      expect(screen.queryByRole("tooltip")).toBeNull();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });
});
