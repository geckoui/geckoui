import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RHFError, RHFInput } from "..";
import { Form, submit } from "../testUtils";

describe("RHFError", () => {
  it("renders nothing while the field is valid", () => {
    const { container } = render(
      <Form defaultValues={{ email: "" }}>
        <RHFError name="email" />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFError")).toBeNull();
  });

  it("shows the validation message after a failed submit", async () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" rules={{ required: "Email is required" }} />
        <RHFError name="email" />
      </Form>
    );

    await submit();

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("applies the base class and a custom class", async () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" rules={{ required: "Email is required" }} />
        <RHFError name="email" className="custom" />
      </Form>
    );

    await submit();

    expect(await screen.findByText("Email is required")).toHaveClass(
      "GeckoUIInputError",
      "GeckoUIRHFError",
      "custom"
    );
  });

  it("renders a custom error node", async () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" rules={{ required: "Email is required" }} />
        <RHFError
          name="email"
          render={({ error }) => <b data-testid="custom">{error?.message}</b>}
        />
      </Form>
    );

    await submit();

    expect(await screen.findByTestId("custom")).toHaveTextContent("Email is required");
  });

  it("clears once the field becomes valid", async () => {
    render(
      <Form defaultValues={{ email: "" }} mode="onChange">
        <RHFInput name="email" rules={{ required: "Email is required" }} />
        <RHFError name="email" />
      </Form>
    );

    await submit();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();

    await userEvent.type(screen.getByRole("textbox"), "a@b.com");

    await waitFor(() => expect(screen.queryByText("Email is required")).toBeNull());
  });
});
