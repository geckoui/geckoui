import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFCounterInput } from "..";
import { Form, submit } from "../testUtils";

describe("RHFCounterInput", () => {
  it("shows the default value", () => {
    render(
      <Form defaultValues={{ qty: "3" }}>
        <RHFCounterInput name="qty" />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("3");
  });

  it("increments and stores the new value", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ qty: "1" }} onSubmit={onSubmit}>
        <RHFCounterInput name="qty" />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Increment" }));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ qty: "2" }));
  });

  it("respects min and max", async () => {
    render(
      <Form defaultValues={{ qty: "1" }}>
        <RHFCounterInput name="qty" min={1} max={2} />
      </Form>
    );

    expect(screen.getByRole("button", { name: "Decrement" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByRole("button", { name: "Increment" })).toBeDisabled();
  });

  it("marks the styled container as errored", async () => {
    const { container } = render(
      <Form defaultValues={{ qty: "" }}>
        <RHFCounterInput name="qty" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() =>
      expect(container.querySelector(".GeckoUIRHFCounterInput")).toHaveAttribute("data-error")
    );
  });

  it("is not marked errored while valid", () => {
    const { container } = render(
      <Form defaultValues={{ qty: "1" }}>
        <RHFCounterInput name="qty" />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFCounterInput")).not.toHaveAttribute("data-error");
  });

  it("calls onChange with the new value", async () => {
    const onChange = vi.fn();
    render(
      <Form defaultValues={{ qty: "1" }}>
        <RHFCounterInput name="qty" onChange={onChange} />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Increment" }));

    expect(onChange).toHaveBeenCalledWith("2");
  });
});
