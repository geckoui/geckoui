import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RHFController } from "..";
import { Form, submit } from "../testUtils";

describe("RHFController", () => {
  it("injects control from the form context", () => {
    render(
      <Form defaultValues={{ email: "a@b.com" }}>
        <RHFController name="email" render={({ field }) => <input {...field} />} />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("a@b.com");
  });

  it("throws without a FormProvider and without control", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(<RHFController name="email" render={({ field }) => <input {...field} />} />)
    ).toThrow("RHFController should be wrapped with FormProvider");

    spy.mockRestore();
  });

  it("passes the field state to the render function", async () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFController
          name="email"
          rules={{ required: "Required" }}
          render={({ field, fieldState }) => (
            <>
              <input {...field} />
              <span data-testid="error">{fieldState.error?.message}</span>
            </>
          )}
        />
      </Form>
    );

    await submit();

    await waitFor(() => expect(screen.getByTestId("error")).toHaveTextContent("Required"));
  });
});
