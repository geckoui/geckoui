import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFCurrencyInput } from "..";
import { Form, submit } from "../testUtils";

describe("RHFCurrencyInput", () => {
  it("shows the stored number with thousands separators", () => {
    render(
      <Form defaultValues={{ price: "1234567" }}>
        <RHFCurrencyInput name="price" />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("1,234,567");
  });

  it("stores the raw number without separators", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ price: "" }} onSubmit={onSubmit}>
        <RHFCurrencyInput name="price" />
      </Form>
    );

    await userEvent.type(screen.getByRole("textbox"), "1234");
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ price: "1234" }));
  });

  it("renders the currency symbol and code", () => {
    render(
      <Form defaultValues={{ price: "" }}>
        <RHFCurrencyInput name="price" currency={{ symbol: "$", code: "USD" }} />
      </Form>
    );

    expect(screen.getByText("$")).toHaveClass("GeckoUIRHFCurrencyInput__currency-symbol");
    expect(screen.getByText("USD")).toHaveClass("GeckoUIRHFCurrencyInput__currency-code");
  });

  it("renders neither when no currency is given", () => {
    const { container } = render(
      <Form defaultValues={{ price: "" }}>
        <RHFCurrencyInput name="price" />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFCurrencyInput__currency-symbol")).toBeNull();
    expect(container.querySelector(".GeckoUIRHFCurrencyInput__currency-code")).toBeNull();
  });
});
