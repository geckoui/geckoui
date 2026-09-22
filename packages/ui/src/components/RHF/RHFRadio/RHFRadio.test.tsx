import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFRadio } from "..";
import { Form, submit } from "../testUtils";

describe("RHFRadio", () => {
  it("renders a radio with its label", () => {
    render(
      <Form defaultValues={{ size: "" }}>
        <RHFRadio name="size" value="sm" label="Small" />
      </Form>
    );

    expect(screen.getByLabelText("Small")).toBeInTheDocument();
  });

  it("throws without a value", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(
        <Form defaultValues={{ size: "" }}>
          <RHFRadio name="size" value={undefined as never} />
        </Form>
      )
    ).toThrow("RHFRadio: value cannot be undefined or null");

    spy.mockRestore();
  });

  it("checks the option matching the field value", () => {
    render(
      <Form defaultValues={{ size: "lg" }}>
        <RHFRadio name="size" value="sm" label="Small" />
        <RHFRadio name="size" value="lg" label="Large" />
      </Form>
    );

    expect(screen.getByLabelText("Small")).not.toBeChecked();
    expect(screen.getByLabelText("Large")).toBeChecked();
  });

  it("stores the picked value", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ size: "" }} onSubmit={onSubmit}>
        <RHFRadio name="size" value="sm" label="Small" />
        <RHFRadio name="size" value="lg" label="Large" />
      </Form>
    );

    await userEvent.click(screen.getByLabelText("Large"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ size: "lg" }));
  });

  it("calls onChange with the picked value", async () => {
    const onChange = vi.fn();
    render(
      <Form defaultValues={{ size: "" }}>
        <RHFRadio name="size" value="sm" label="Small" onChange={onChange} />
      </Form>
    );

    await userEvent.click(screen.getByLabelText("Small"));

    expect(onChange).toHaveBeenCalledWith("sm");
  });

  it("disables the radio", () => {
    render(
      <Form defaultValues={{ size: "" }}>
        <RHFRadio name="size" value="sm" label="Small" disabled />
      </Form>
    );

    expect(screen.getByLabelText("Small")).toBeDisabled();
  });

  it("marks the radio errored when the field fails validation", async () => {
    render(
      <Form defaultValues={{ plan: "" }}>
        <RHFRadio name="plan" value="pro" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() => expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true"));
  });

  it("is not marked errored while valid", () => {
    render(
      <Form defaultValues={{ plan: "pro" }}>
        <RHFRadio name="plan" value="pro" />
      </Form>
    );

    expect(screen.getByRole("radio")).not.toHaveAttribute("aria-invalid");
  });
});
