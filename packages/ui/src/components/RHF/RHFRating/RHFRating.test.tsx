import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { RHFRating } from ".";

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

describe("RHFRating", () => {
  it("shows the rating already in the form", () => {
    render(
      <Form defaultValues={{ score: 4 }}>
        <RHFRating name="score" />
      </Form>
    );

    expect(screen.getByRole("radio", { name: "4 of 5" })).toBeChecked();
  });

  it("starts at nothing when the form has none", () => {
    render(
      <Form>
        <RHFRating name="score" />
      </Form>
    );

    expect(
      screen.queryAllByRole("radio").filter((radio) => radio.hasAttribute("checked"))
    ).toHaveLength(0);
  });

  it("submits a number", async () => {
    const onSubmit = vi.fn();

    render(
      <Form defaultValues={{ score: 0 }} onSubmit={onSubmit}>
        <RHFRating name="score" />
      </Form>
    );

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith({ score: 1 });
  });

  it("catches an untouched rating, because nothing picked is zero", async () => {
    const onSubmit = vi.fn();

    render(
      <Form defaultValues={{ score: 0 }} onSubmit={onSubmit}>
        <RHFRating name="score" rules={{ min: { value: 1, message: "Pick a rating" } }} />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls its own onChange alongside the form's", async () => {
    const onChange = vi.fn();

    render(
      <Form defaultValues={{ score: 2 }}>
        <RHFRating name="score" onChange={onChange} />
      </Form>
    );

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    expect(onChange).toHaveBeenLastCalledWith(3);
  });
});
