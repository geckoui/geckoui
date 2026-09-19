import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { RHFTagInput } from ".";

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

const tags = () =>
  Array.from(document.querySelectorAll(".GeckoUITagInput__tag")).map((tag) =>
    (tag.textContent ?? "").trim()
  );

describe("RHFTagInput", () => {
  it("shows the tags already in the form", () => {
    render(
      <Form defaultValues={{ tags: ["react", "vue"] }}>
        <RHFTagInput name="tags" />
      </Form>
    );

    expect(tags()).toEqual(["react", "vue"]);
  });

  it("reads a field the form has nothing for as an empty list", () => {
    render(
      <Form>
        <RHFTagInput name="tags" />
      </Form>
    );

    expect(tags()).toEqual([]);
  });

  it("submits a string array", async () => {
    const onSubmit = vi.fn();

    render(
      <Form onSubmit={onSubmit}>
        <RHFTagInput name="tags" />
      </Form>
    );

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("react{Enter}vue{Enter}");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith({ tags: ["react", "vue"] });
  });

  it("calls its own onChange alongside the form's", async () => {
    const onChange = vi.fn();

    render(
      <Form>
        <RHFTagInput name="tags" onChange={onChange} />
      </Form>
    );

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("react{Enter}");

    expect(onChange).toHaveBeenLastCalledWith(["react"]);
  });

  it("marks the field in error when the rules turn it down", async () => {
    render(
      <Form defaultValues={{ tags: [] }}>
        <RHFTagInput name="tags" rules={{ validate: (v: string[]) => v.length > 0 || "Add one" }} />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(document.querySelector(".GeckoUITagInput")).toHaveAttribute("data-error", "true");
  });
});
