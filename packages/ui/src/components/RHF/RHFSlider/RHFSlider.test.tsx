import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { RHFSlider } from ".";
import { RHFRangeSlider } from "../RHFRangeSlider";

const Form = ({
  children,
  onSubmit,
  defaultValues = {}
}: {
  children: ReactNode;
  onSubmit?: (values: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}) => {
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((values) => onSubmit?.(values))}>
        {children}
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  );
};

describe("RHFSlider", () => {
  it("shows the value already in the form", () => {
    render(
      <Form defaultValues={{ volume: 70 }}>
        <RHFSlider name="volume" />
      </Form>
    );

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "70");
  });

  it("starts at min when the form has nothing, so the thumb is never off the track", () => {
    render(
      <Form>
        <RHFSlider name="volume" min={20} />
      </Form>
    );

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "20");
  });

  it("takes a defaultValue over min", () => {
    render(
      <Form>
        <RHFSlider name="volume" defaultValue={65} />
      </Form>
    );

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "65");
  });

  it("submits a number", async () => {
    const onSubmit = vi.fn();

    render(
      <Form defaultValues={{ volume: 40 }} onSubmit={onSubmit}>
        <RHFSlider name="volume" />
      </Form>
    );

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith({ volume: 41 });
  });

  it("calls its own onChange alongside the form's", async () => {
    const onChange = vi.fn();

    render(
      <Form defaultValues={{ volume: 40 }}>
        <RHFSlider name="volume" onChange={onChange} />
      </Form>
    );

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    expect(onChange).toHaveBeenLastCalledWith(41);
  });
});

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
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith({ price: [110, 400] });
  });
});
