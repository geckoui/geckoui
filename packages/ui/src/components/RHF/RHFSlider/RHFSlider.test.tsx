import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { RHFSlider } from ".";

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
