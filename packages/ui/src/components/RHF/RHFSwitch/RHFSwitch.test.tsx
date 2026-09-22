import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFSwitch } from "..";
import { Form, submit } from "../testUtils";

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

  it("marks the switch errored when the field fails validation", async () => {
    render(
      <Form defaultValues={{ on: false }}>
        <RHFSwitch name="on" rules={{ required: "Required" }} />
      </Form>
    );

    await submit();

    await waitFor(() => expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true"));
  });

  it("is not marked errored while valid", () => {
    render(
      <Form defaultValues={{ on: true }}>
        <RHFSwitch name="on" />
      </Form>
    );

    expect(screen.getByRole("switch")).not.toHaveAttribute("aria-invalid");
  });
});
