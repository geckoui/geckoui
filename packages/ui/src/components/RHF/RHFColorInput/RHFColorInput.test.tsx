import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import RHFColorInput from "./RHFColorInput";

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

const field = () => document.querySelector(".GeckoUIColorInput") as HTMLButtonElement;

describe("RHFColorInput", () => {
  it("shows what the form starts with", () => {
    render(
      <Form defaultValues={{ brand: "#3b82f6" }}>
        <RHFColorInput name="brand" />
      </Form>
    );

    expect(screen.getByText("#3b82f6")).toBeInTheDocument();
  });

  it("puts what was picked into the form", async () => {
    const onSubmit = vi.fn();

    render(
      <Form defaultValues={{ brand: "#ff0000" }} onSubmit={onSubmit}>
        <RHFColorInput name="brand" swatches={["#0000ff"]} />
      </Form>
    );

    await userEvent.click(field());
    await userEvent.click(screen.getByRole("button", { name: "#0000ff" }));
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ brand: "#0000ff" }));
  });

  it("calls your own onChange alongside the form", async () => {
    const onChange = vi.fn();

    render(
      <Form defaultValues={{ brand: "#ff0000" }}>
        <RHFColorInput name="brand" swatches={["#0000ff"]} onChange={onChange} />
      </Form>
    );

    await userEvent.click(field());
    await userEvent.click(screen.getByRole("button", { name: "#0000ff" }));

    expect(onChange).toHaveBeenLastCalledWith("#0000ff");
  });

  it("holds nothing rather than a colour nobody chose", async () => {
    const onSubmit = vi.fn();

    render(
      <Form onSubmit={onSubmit}>
        <RHFColorInput name="brand" />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    // Untouched and with no default, the field is undefined, the way any RHF field is
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ brand: undefined }));
  });

  it("shows the placeholder rather than a colour nobody chose", () => {
    render(
      <Form>
        <RHFColorInput name="brand" placeholder="Pick a colour" />
      </Form>
    );

    expect(screen.getByText("Pick a colour")).toBeInTheDocument();
  });

  it("draws itself in error when the rules turn it away", async () => {
    render(
      <Form>
        <RHFColorInput name="brand" rules={{ required: "Pick a colour" }} />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(field()).toHaveAttribute("aria-invalid", "true");
  });

  it("stops the form when it is required and empty", async () => {
    const onSubmit = vi.fn();

    render(
      <Form onSubmit={onSubmit}>
        <RHFColorInput name="brand" rules={{ required: "Pick a colour" }} />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
