import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFNumberInput } from "..";
import { Form, submit } from "../testUtils";

describe("RHFNumberInput", () => {
  it("keeps digits and drops letters", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ qty: "" }} onSubmit={onSubmit}>
        <RHFNumberInput name="qty" />
      </Form>
    );

    await userEvent.type(screen.getByRole("textbox"), "12a3");
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ qty: "123" }));
  });

  it("uses a decimal input mode", () => {
    render(
      <Form defaultValues={{ qty: "" }}>
        <RHFNumberInput name="qty" />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("inputMode", "decimal");
  });

  it("limits the fraction digits", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ qty: "" }} onSubmit={onSubmit}>
        <RHFNumberInput name="qty" maxFractionDigits={2} />
      </Form>
    );

    await userEvent.type(screen.getByRole("textbox"), "1.23456");
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ qty: "1.23" }));
  });

  it("drops the minus sign when positiveOnly", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ qty: "" }} onSubmit={onSubmit}>
        <RHFNumberInput name="qty" positiveOnly />
      </Form>
    );

    await userEvent.type(screen.getByRole("textbox"), "-5");
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ qty: "5" }));
  });

  it("applies the base class", () => {
    const { container } = render(
      <Form defaultValues={{ qty: "" }}>
        <RHFNumberInput name="qty" />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFNumberInput")).toBeInTheDocument();
  });
});
