import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { RHFTimeInput } from ".";

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

const field = () => document.querySelector(".GeckoUITimeInput") as HTMLElement;

describe("RHFTimeInput", () => {
  it("shows the value already in the form", () => {
    render(
      <Form defaultValues={{ startsAt: "09:30" }}>
        <RHFTimeInput name="startsAt" />
      </Form>
    );

    expect(within(field()).getByLabelText("hour")).toHaveValue("09");
    expect(within(field()).getByLabelText("minute")).toHaveValue("30");
  });

  it("submits the 24 hour time, whatever the clock on screen says", async () => {
    const onSubmit = vi.fn();

    render(
      <Form onSubmit={onSubmit}>
        <RHFTimeInput name="startsAt" format="hh:mm A" />
      </Form>
    );

    await userEvent.click(within(field()).getByLabelText("hour"));
    await userEvent.keyboard("0430");
    await userEvent.keyboard("p");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith({ startsAt: "16:30" });
  });

  it("calls its own onChange alongside the form's", async () => {
    const onChange = vi.fn();

    render(
      <Form>
        <RHFTimeInput name="startsAt" onChange={onChange} />
      </Form>
    );

    await userEvent.click(within(field()).getByLabelText("hour"));
    await userEvent.keyboard("0930");

    expect(onChange).toHaveBeenLastCalledWith("09:30");
  });

  it("marks the field in error when the rules turn it down", async () => {
    render(
      <Form>
        <RHFTimeInput name="startsAt" rules={{ required: "Pick a time" }} />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(field()).toHaveAttribute("aria-invalid", "true");
  });
});
