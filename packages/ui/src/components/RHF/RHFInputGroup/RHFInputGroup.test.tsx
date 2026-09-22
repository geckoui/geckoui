import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RHFInput, RHFInputGroup } from "..";
import { Form, submit } from "../testUtils";

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
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <Form defaultValues={{}}>
        <RHFInputGroup label="Email">{null}</RHFInputGroup>
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFInputGroup")).toBeNull();
    expect(spy).toHaveBeenCalledWith("[GeckoUI] RHFInputGroup must have children");
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

    expect(spy).toHaveBeenCalledWith(
      "[GeckoUI] RHFInputGroup does not contain any RHF input component"
    );
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
