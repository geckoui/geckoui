import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFTextarea } from "..";
import { Form, submit } from "../testUtils";

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

    await waitFor(() =>
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
    );
  });

  it("does not mark a disabled textarea as errored", async () => {
    render(
      <Form defaultValues={{ bio: "" }}>
        <RHFTextarea name="bio" rules={{ required: "Required" }} disabled />
      </Form>
    );

    await submit();

    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid", "true");
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
