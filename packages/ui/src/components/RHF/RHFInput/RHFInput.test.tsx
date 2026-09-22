import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFInput } from "..";
import { Form, submit } from "../testUtils";

describe("RHFInput", () => {
  it("shows the default value", () => {
    render(
      <Form defaultValues={{ email: "a@b.com" }}>
        <RHFInput name="email" />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("a@b.com");
  });

  it("shows an empty string for an undefined value", () => {
    render(
      <Form defaultValues={{}}>
        <RHFInput name="email" />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("submits what the user typed", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ email: "" }} onSubmit={onSubmit}>
        <RHFInput name="email" />
      </Form>
    );

    await userEvent.type(screen.getByRole("textbox"), "a@b.com");
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: "a@b.com" }));
  });

  it("marks the styled container as errored", async () => {
    const { container } = render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() =>
      expect(container.querySelector(".GeckoUIRHFInput")).toHaveAttribute("data-error", "true")
    );
  });

  it("keeps data-error off the inner input", async () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() =>
      expect(document.querySelector(".GeckoUIRHFInput")).toHaveAttribute("data-error")
    );
    expect(screen.getByRole("textbox")).not.toHaveAttribute("data-error");
  });

  it("is not marked errored while valid", () => {
    const { container } = render(
      <Form defaultValues={{ email: "a@b.com" }}>
        <RHFInput name="email" />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFInput")).not.toHaveAttribute("data-error");
  });

  it("formats the displayed value with transform.input", () => {
    render(
      <Form defaultValues={{ code: "abc" }}>
        <RHFInput name="code" transform={{ input: (v: string) => v.toUpperCase() }} />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("ABC");
  });

  it("stores the value through transform.output", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ code: "" }} onSubmit={onSubmit}>
        <RHFInput name="code" transform={{ output: (v: string) => v.toLowerCase() }} />
      </Form>
    );

    await userEvent.type(screen.getByRole("textbox"), "ABC");
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ code: "abc" }));
  });

  it("calls onChange with the stored value", async () => {
    const onChange = vi.fn();
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" onChange={onChange} />
      </Form>
    );

    await userEvent.type(screen.getByRole("textbox"), "a");

    expect(onChange).toHaveBeenLastCalledWith("a");
  });

  it("calls onBlur with the current value", async () => {
    const onBlur = vi.fn();
    render(
      <Form defaultValues={{ email: "a@b.com" }}>
        <RHFInput name="email" onBlur={onBlur} />
      </Form>
    );

    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.tab();

    expect(onBlur).toHaveBeenCalledWith("a@b.com");
  });

  it("renders a prefix and a suffix", () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" prefix="@" suffix=".com" />
      </Form>
    );

    expect(screen.getByText("@")).toBeInTheDocument();
    expect(screen.getByText(".com")).toBeInTheDocument();
  });

  it("gives a suffix component access to the field state", async () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput
          name="email"
          rules={{ required: "Required" }}
          suffix={
            (({ fieldState }: { fieldState: { error?: unknown } }) =>
              fieldState.error ? <span data-testid="error-icon" /> : null) as unknown as never
          }
        />
      </Form>
    );

    await submit();

    expect(await screen.findByTestId("error-icon")).toBeInTheDocument();
  });

  it("disables the input", () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" disabled />
      </Form>
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("passes native attributes through", () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInput name="email" type="email" placeholder="you@example.com" />
      </Form>
    );

    const input = screen.getByPlaceholderText("you@example.com");
    expect(input).toHaveAttribute("type", "email");
  });
});
