import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFCheckbox } from "..";
import { Form, submit } from "../testUtils";

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

  it("marks the checkbox errored when the field fails validation", async () => {
    render(
      <Form defaultValues={{ terms: false }}>
        <RHFCheckbox name="terms" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() =>
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true")
    );
  });

  it("is not marked errored while valid", () => {
    render(
      <Form defaultValues={{ terms: true }}>
        <RHFCheckbox name="terms" />
      </Form>
    );

    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-invalid");
  });

  it("calls onBlur with no arguments", async () => {
    const onBlur = vi.fn();
    render(
      <Form defaultValues={{ terms: false }}>
        <RHFCheckbox name="terms" onBlur={onBlur} />
      </Form>
    );

    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.tab();

    await waitFor(() => expect(onBlur).toHaveBeenCalledWith());
  });
});
