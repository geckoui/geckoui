import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm, type UseFormProps } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { RHFController, RHFError, RHFInput, RHFInputGroup } from ".";

function Form({
  children,
  onSubmit,
  ...options
}: { children: ReactNode; onSubmit?: (values: unknown) => void } & UseFormProps) {
  const methods = useForm(options);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((values) => onSubmit?.(values))}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

const submit = () => userEvent.click(screen.getByRole("button", { name: "Submit" }));

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
        <RHFError name="email" render={({ error }) => <b data-testid="custom">{error?.message}</b>} />
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

describe("RHFInputGroup", () => {
  it("renders the label and its children", () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInputGroup label="Email">
          <RHFInput name="email" />
        </RHFInputGroup>
      </Form>
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders no label element when there is no label", () => {
    const { container } = render(
      <Form defaultValues={{ email: "" }}>
        <RHFInputGroup>
          <RHFInput name="email" />
        </RHFInputGroup>
      </Form>
    );

    expect(container.querySelector(".GeckoUILabel")).toBeNull();
  });

  it("marks the label required", () => {
    const { container } = render(
      <Form defaultValues={{ email: "" }}>
        <RHFInputGroup label="Email" required>
          <RHFInput name="email" />
        </RHFInputGroup>
      </Form>
    );

    expect(container.querySelector(".GeckoUILabel__required-indicator")).toBeInTheDocument();
  });

  it("finds the field name and shows its error", async () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInputGroup label="Email">
          <RHFInput name="email" rules={{ required: "Email is required" }} />
        </RHFInputGroup>
      </Form>
    );

    await submit();

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("finds a nested input", async () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInputGroup label="Email">
          <div>
            <RHFInput name="email" rules={{ required: "Email is required" }} />
          </div>
        </RHFInputGroup>
      </Form>
    );

    await submit();

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("uses the first input when there are several", async () => {
    render(
      <Form defaultValues={{ code: "", phone: "" }}>
        <RHFInputGroup label="Phone">
          <div>
            <RHFInput name="code" rules={{ required: "Code is required" }} />
            <RHFInput name="phone" rules={{ required: "Phone is required" }} />
          </div>
        </RHFInputGroup>
      </Form>
    );

    await submit();

    expect(await screen.findByText("Code is required")).toBeInTheDocument();
    expect(screen.queryByText("Phone is required")).toBeNull();
  });

  it("links the label to the input when an id is given", () => {
    render(
      <Form defaultValues={{ email: "" }}>
        <RHFInputGroup label="Email">
          <RHFInput name="email" id="email-field" />
        </RHFInputGroup>
      </Form>
    );

    expect(screen.getByText("Email").closest("label")).toHaveAttribute("for", "email-field");
  });

  it("warns and renders nothing without children", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(
      <Form defaultValues={{}}>
        <RHFInputGroup label="Email">{null}</RHFInputGroup>
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFInputGroup")).toBeNull();
    expect(spy).toHaveBeenCalledWith("RHFInputGroup must have children");
    spy.mockRestore();
  });

  it("warns when it finds no RHF input", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Form defaultValues={{}}>
        <RHFInputGroup label="Email">
          <input />
        </RHFInputGroup>
      </Form>
    );

    expect(spy).toHaveBeenCalledWith("RHFInputGroup not containing any `RHF` input component");
    spy.mockRestore();
  });

  it("applies the base class and a custom class", () => {
    const { container } = render(
      <Form defaultValues={{ email: "" }}>
        <RHFInputGroup label="Email" className="custom">
          <RHFInput name="email" />
        </RHFInputGroup>
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFInputGroup")).toHaveClass("custom");
  });
});

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
            ((({ fieldState }: { fieldState: { error?: unknown } }) =>
              fieldState.error ? <span data-testid="error-icon" /> : null) as unknown) as never
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
