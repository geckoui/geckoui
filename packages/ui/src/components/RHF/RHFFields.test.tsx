import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm, type UseFormProps } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import {
  RHFCheckbox,
  RHFCounterInput,
  RHFCurrencyInput,
  RHFNumberInput,
  RHFOTPInput,
  RHFRadio,
  RHFSelect,
  RHFSwitch,
  RHFTextarea
} from ".";
import { SelectOption } from "../Select";

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

describe("RHFCheckbox", () => {
  it("renders a checkbox with its label", () => {
    render(
      <Form defaultValues={{ agree: false }}>
        <RHFCheckbox name="agree" label="I agree" />
      </Form>
    );

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("I agree")).toBeInTheDocument();
  });

  it("reflects a boolean default value", () => {
    render(
      <Form defaultValues={{ agree: true }}>
        <RHFCheckbox name="agree" />
      </Form>
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles a boolean field", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ agree: false }} onSubmit={onSubmit}>
        <RHFCheckbox name="agree" />
      </Form>
    );

    await userEvent.click(screen.getByRole("checkbox"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ agree: true }));
  });

  it("collects values into an array when a value is given", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ picks: [] }} onSubmit={onSubmit}>
        <RHFCheckbox name="picks" value="a" label="A" />
        <RHFCheckbox name="picks" value="b" label="B" />
      </Form>
    );

    await userEvent.click(screen.getByLabelText("A"));
    await userEvent.click(screen.getByLabelText("B"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ picks: ["a", "b"] }));
  });

  it("removes a value when unticked", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ picks: ["a"] }} onSubmit={onSubmit}>
        <RHFCheckbox name="picks" value="a" label="A" />
      </Form>
    );

    expect(screen.getByLabelText("A")).toBeChecked();

    await userEvent.click(screen.getByLabelText("A"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ picks: [] }));
  });

  it("stores a single value instead of an array with single", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ pick: null }} onSubmit={onSubmit}>
        <RHFCheckbox name="pick" value="a" single label="A" />
      </Form>
    );

    await userEvent.click(screen.getByLabelText("A"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ pick: "a" }));
  });

  it("falls back to uncheckedValue when a single box is untiked", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ pick: "a" }} onSubmit={onSubmit}>
        <RHFCheckbox name="pick" value="a" uncheckedValue="none" single label="A" />
      </Form>
    );

    await userEvent.click(screen.getByLabelText("A"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ pick: "none" }));
  });

  it("calls onChange with the new value", async () => {
    const onChange = vi.fn();
    render(
      <Form defaultValues={{ agree: false }}>
        <RHFCheckbox name="agree" onChange={onChange} />
      </Form>
    );

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("shows the indeterminate state", () => {
    render(
      <Form defaultValues={{ agree: false }}>
        <RHFCheckbox name="agree" indeterminate />
      </Form>
    );

    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
  });

  it("takes indeterminate from a function of the render props", () => {
    render(
      <Form defaultValues={{ agree: false }}>
        <RHFCheckbox name="agree" indeterminate={({ field }) => field.value === false} />
      </Form>
    );

    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
  });

  it("disables the checkbox", () => {
    render(
      <Form defaultValues={{ agree: false }}>
        <RHFCheckbox name="agree" disabled />
      </Form>
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});

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
});

describe("RHFSwitch", () => {
  it("renders a switch", () => {
    render(
      <Form defaultValues={{ on: false }}>
        <RHFSwitch name="on" />
      </Form>
    );

    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("reflects a boolean default value", () => {
    render(
      <Form defaultValues={{ on: true }}>
        <RHFSwitch name="on" />
      </Form>
    );

    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("toggles a boolean field", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ on: false }} onSubmit={onSubmit}>
        <RHFSwitch name="on" />
      </Form>
    );

    await userEvent.click(screen.getByRole("switch"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ on: true }));
  });

  it("stores a custom value when switched on", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ plan: "free" }} onSubmit={onSubmit}>
        <RHFSwitch name="plan" value="pro" uncheckedValue="free" />
      </Form>
    );

    await userEvent.click(screen.getByRole("switch"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ plan: "pro" }));
  });

  it("stores the unchecked value when switched off", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ plan: "pro" }} onSubmit={onSubmit}>
        <RHFSwitch name="plan" value="pro" uncheckedValue="free" />
      </Form>
    );

    expect(screen.getByRole("switch")).toBeChecked();

    await userEvent.click(screen.getByRole("switch"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ plan: "free" }));
  });

  it("calls onChange with the new value", async () => {
    const onChange = vi.fn();
    render(
      <Form defaultValues={{ on: false }}>
        <RHFSwitch name="on" onChange={onChange} />
      </Form>
    );

    await userEvent.click(screen.getByRole("switch"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("disables the switch", () => {
    render(
      <Form defaultValues={{ on: false }}>
        <RHFSwitch name="on" disabled />
      </Form>
    );

    expect(screen.getByRole("switch")).toBeDisabled();
  });
});

describe("RHFTextarea", () => {
  it("shows the default value", () => {
    render(
      <Form defaultValues={{ bio: "hello" }}>
        <RHFTextarea name="bio" />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveValue("hello");
  });

  it("submits what the user typed", async () => {
    const onSubmit = vi.fn();
    render(
      <Form defaultValues={{ bio: "" }} onSubmit={onSubmit}>
        <RHFTextarea name="bio" />
      </Form>
    );

    await userEvent.type(screen.getByRole("textbox"), "hi");
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ bio: "hi" }));
  });

  it("marks the textarea as errored", async () => {
    render(
      <Form defaultValues={{ bio: "" }}>
        <RHFTextarea name="bio" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() => expect(screen.getByRole("textbox")).toHaveAttribute("data-error"));
  });

  it("does not mark a disabled textarea as errored", async () => {
    render(
      <Form defaultValues={{ bio: "" }}>
        <RHFTextarea name="bio" rules={{ required: "Required" }} disabled />
      </Form>
    );

    await submit();

    expect(screen.getByRole("textbox")).not.toHaveAttribute("data-error");
  });

  it("applies the base class and a custom class", () => {
    render(
      <Form defaultValues={{ bio: "" }}>
        <RHFTextarea name="bio" className="custom" />
      </Form>
    );

    expect(screen.getByRole("textbox")).toHaveClass("GeckoUIRHFTextarea", "custom");
  });
});

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

describe("RHFSelect", () => {
  it("renders a select with the stored value", () => {
    const { container } = render(
      <Form defaultValues={{ fruit: "apple" }}>
        <RHFSelect name="fruit">
          <SelectOption value="apple" label="Apple" />
          <SelectOption value="banana" label="Banana" />
        </RHFSelect>
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFSelectButton")).toHaveTextContent("Apple");
  });

  it("stores the picked option", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <Form defaultValues={{ fruit: undefined }} onSubmit={onSubmit}>
        <RHFSelect name="fruit">
          <SelectOption value="apple" label="Apple" />
          <SelectOption value="banana" label="Banana" />
        </RHFSelect>
      </Form>
    );

    await userEvent.click(container.querySelector(".GeckoUIRHFSelectButton")!);
    await userEvent.click(screen.getByText("Banana"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ fruit: "banana" }));
  });

  it("applies the wrapper class", () => {
    const { container } = render(
      <Form defaultValues={{ fruit: undefined }}>
        <RHFSelect name="fruit">
          <SelectOption value="apple" label="Apple" />
        </RHFSelect>
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFSelect")).toBeInTheDocument();
  });

  it("marks the styled trigger as errored", async () => {
    const { container } = render(
      <Form defaultValues={{ fruit: undefined }}>
        <RHFSelect name="fruit" rules={{ required: "Required" }}>
          <SelectOption value="apple" label="Apple" />
        </RHFSelect>
      </Form>
    );

    await submit();

    await waitFor(() =>
      expect(container.querySelector(".GeckoUIRHFSelectButton")).toHaveAttribute("data-error")
    );
  });
});
