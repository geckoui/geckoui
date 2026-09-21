import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import Step from "./Step/Step";
import Stepper from "./Stepper/Stepper";

const STEPS = ["cart", "delivery", "payment", "done"];

const trail = (props: Record<string, unknown> = {}) => (
  <Stepper {...(props as { value: string })}>
    {STEPS.map((step) => (
      <Step key={step} value={step}>
        {step}
      </Step>
    ))}
  </Stepper>
);

const statuses = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(".GeckoUIStepper__step")).map((step) =>
    step.getAttribute("data-status")
  );

const Controlled = ({
  start = "payment",
  ...rest
}: { start?: string } & Record<string, unknown>) => {
  const [value, setValue] = useState(start);

  return (
    <Stepper value={value} onChange={setValue} {...rest}>
      {STEPS.map((step) => (
        <Step key={step} value={step}>
          {step}
        </Step>
      ))}
    </Stepper>
  );
};

describe("Stepper", () => {
  describe("markup", () => {
    it("is a named nav around an ordered list", () => {
      const { container } = render(trail({ value: "cart" }));

      expect(screen.getByRole("navigation", { name: "Progress" }).tagName).toBe("NAV");
      expect(container.querySelector("ol")).toBeInTheDocument();
    });

    it("takes a name of its own", () => {
      render(trail({ value: "cart", "aria-label": "Checkout" }));

      expect(screen.getByRole("navigation", { name: "Checkout" })).toBeInTheDocument();
    });

    it("marks where you are for a screen reader", () => {
      render(trail({ value: "payment" }));

      expect(screen.getByText("payment").closest("button")).toHaveAttribute("aria-current", "step");
    });
  });

  describe("where each step stands", () => {
    it("reads it from where it sits", () => {
      const { container } = render(trail({ value: "payment" }));

      expect(statuses(container)).toEqual(["complete", "complete", "current", "upcoming"]);
    });

    it("leaves everything ahead when no step answers to the value", () => {
      const { container } = render(trail({ value: "nowhere" }));

      expect(statuses(container)).toEqual(["upcoming", "upcoming", "upcoming", "upcoming"]);
    });

    it("lets a step say otherwise, so one already passed can still show an error", () => {
      const { container } = render(
        <Stepper value="done">
          <Step value="cart">Cart</Step>
          <Step value="delivery" status="error">
            Delivery
          </Step>
          <Step value="payment">Payment</Step>
          <Step value="done">Done</Step>
        </Stepper>
      );

      expect(statuses(container)).toEqual(["complete", "error", "complete", "current"]);
    });

    it("numbers the steps from one, and ticks the ones behind", () => {
      const { container } = render(trail({ value: "payment" }));
      const markers = container.querySelectorAll(".GeckoUIStepper__marker");

      // the first two are done, so they carry a tick rather than their number
      expect(markers[0].querySelector("svg")).toBeInTheDocument();
      expect(markers[2]).toHaveTextContent("3");
      expect(markers[3]).toHaveTextContent("4");
    });

    it("takes an icon over either", () => {
      render(
        <Stepper value="cart">
          <Step value="cart" icon={<i data-testid="mine" />}>
            Cart
          </Step>
        </Stepper>
      );

      expect(screen.getByTestId("mine")).toBeInTheDocument();
    });
  });

  describe("picking a step", () => {
    it("goes back to one already done", async () => {
      const onChange = vi.fn();

      render(
        <Stepper value="payment" onChange={onChange}>
          {STEPS.map((step) => (
            <Step key={step} value={step}>
              {step}
            </Step>
          ))}
        </Stepper>
      );

      await userEvent.click(screen.getByText("cart"));

      expect(onChange).toHaveBeenCalledWith("cart");
    });

    it("will not skip ahead", async () => {
      const onChange = vi.fn();

      render(
        <Stepper value="cart" onChange={onChange}>
          {STEPS.map((step) => (
            <Step key={step} value={step}>
              {step}
            </Step>
          ))}
        </Stepper>
      );

      const ahead = screen.getByText("done").closest("button") as HTMLElement;

      expect(ahead).toBeDisabled();

      await userEvent.click(ahead);

      expect(onChange).not.toHaveBeenCalled();
    });

    it("skips ahead once the steps need no order", async () => {
      render(<Controlled start="cart" linear={false} />);

      await userEvent.click(screen.getByText("done"));

      expect(screen.getByText("done").closest("button")).toHaveAttribute("aria-current", "step");
    });

    it("does not go back to itself", () => {
      render(<Controlled start="payment" />);

      expect(screen.getByText("payment").closest("button")).toBeDisabled();
    });

    it("is something to read without an onChange", () => {
      const { container } = render(trail({ value: "payment" }));

      container.querySelectorAll("button").forEach((button) => {
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("tabindex", "-1");
      });
    });

    it("leaves a disabled step alone even when it is behind you", async () => {
      const onChange = vi.fn();

      render(
        <Stepper value="payment" onChange={onChange}>
          <Step value="cart" disabled>
            cart
          </Step>
          <Step value="payment">payment</Step>
        </Stepper>
      );

      await userEvent.click(screen.getByText("cart"));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("keeps a caller's own onClick", async () => {
      const onClick = vi.fn();

      render(
        <Stepper value="payment" onChange={() => {}}>
          <Step value="cart" onClick={onClick}>
            cart
          </Step>
          <Step value="payment">payment</Step>
        </Stepper>
      );

      await userEvent.click(screen.getByText("cart"));

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("axes", () => {
    it.each(["horizontal", "vertical"] as const)("exposes orientation %s", (orientation) => {
      const { container } = render(trail({ value: "cart", orientation }));

      expect(container.firstChild).toHaveAttribute("data-orientation", orientation);
    });

    it("runs across by default", () => {
      const { container } = render(trail({ value: "cart" }));

      expect(container.firstChild).toHaveAttribute("data-orientation", "horizontal");
    });

    it.each(["sm", "md", "lg"] as const)("exposes size %s", (size) => {
      const { container } = render(trail({ value: "cart", size }));

      expect(container.firstChild).toHaveAttribute("data-size", size);
    });
  });

  it("shows a description under the name", () => {
    render(
      <Stepper value="cart">
        <Step value="cart" description="3 items">
          Cart
        </Step>
      </Stepper>
    );

    expect(screen.getByText("3 items")).toBeInTheDocument();
  });

  it("will not be used outside a Stepper", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Step value="lonely">Lonely</Step>)).toThrow(
      "Step has to be used inside a <Stepper>."
    );

    quiet.mockRestore();
  });
});
