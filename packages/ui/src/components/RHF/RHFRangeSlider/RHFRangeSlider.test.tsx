import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFRangeSlider } from ".";
import { Form, submit } from "../testUtils";

describe("RHFRangeSlider", () => {
  it("shows the pair already in the form", () => {
    render(
      <Form defaultValues={{ price: [100, 400] }}>
        <RHFRangeSlider name="price" min={0} max={500} />
      </Form>
    );

    const [low, high] = screen.getAllByRole("slider");

    expect(low).toHaveAttribute("aria-valuenow", "100");
    expect(high).toHaveAttribute("aria-valuenow", "400");
  });

  it("opens on the whole range when the form has nothing", () => {
    render(
      <Form>
        <RHFRangeSlider name="price" min={10} max={90} />
      </Form>
    );

    const [low, high] = screen.getAllByRole("slider");

    expect(low).toHaveAttribute("aria-valuenow", "10");
    expect(high).toHaveAttribute("aria-valuenow", "90");
  });

  it("submits the pair in order", async () => {
    const onSubmit = vi.fn();

    render(
      <Form defaultValues={{ price: [100, 400] }} onSubmit={onSubmit}>
        <RHFRangeSlider name="price" min={0} max={500} step={10} />
      </Form>
    );

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await submit();

    expect(onSubmit).toHaveBeenCalledWith({ price: [110, 400] });
  });
});
