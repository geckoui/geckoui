import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFOTPInput } from "..";
import { Form, submit } from "../testUtils";

describe("RHFOTPInput", () => {
  it("renders one box per digit", () => {
    render(
      <Form defaultValues={{ code: "" }}>
        <RHFOTPInput name="code" length={4} />
      </Form>
    );

    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("marks the styled container as errored", async () => {
    const { container } = render(
      <Form defaultValues={{ code: "" }}>
        <RHFOTPInput name="code" length={4} rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() =>
      expect(container.querySelector(".GeckoUIRHFOTPInput")).toHaveAttribute("data-error")
    );
  });

  it("is not marked errored while valid", () => {
    const { container } = render(
      <Form defaultValues={{ code: "1234" }}>
        <RHFOTPInput name="code" length={4} />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFOTPInput")).not.toHaveAttribute("data-error");
  });

  it("stores the typed code", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ code: "" }} onSubmit={onSubmit}>
        <RHFOTPInput name="code" length={4} />
      </Form>
    );

    await userEvent.click(screen.getAllByRole("textbox")[0]);
    await userEvent.keyboard("1234");
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ code: "1234" }));
  });
});
