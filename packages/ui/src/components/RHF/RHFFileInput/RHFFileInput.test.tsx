import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFFileInput } from ".";
import type { PickedFile } from "../../FileInput";
import { Form, submit } from "../testUtils";

const field = () => document.querySelector<HTMLElement>(".GeckoUIFileInput")!;

const picked = (name: string) =>
  Object.assign(new File(["x"], name, { type: "image/png" }), { path: "" }) as PickedFile;

describe("RHFFileInput", () => {
  it("shows what the form starts with", () => {
    render(
      <Form defaultValues={{ cv: picked("cv.pdf") }}>
        <RHFFileInput name="cv" />
      </Form>
    );

    expect(screen.getByText("cv.pdf")).toBeInTheDocument();
  });

  it("counts them when the form holds a list", () => {
    render(
      <Form defaultValues={{ docs: [picked("a.png"), picked("b.png")] }}>
        <RHFFileInput name="docs" multiple />
      </Form>
    );

    expect(screen.getByText("2 files")).toBeInTheDocument();
  });

  it("puts null back into the form when it is cleared", async () => {
    const onSubmit = vi.fn();

    render(
      <Form defaultValues={{ cv: picked("cv.pdf") }} onSubmit={onSubmit}>
        <RHFFileInput name="cv" />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    await submit();

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ cv: null }));
  });

  it("draws itself in error when the rules turn it away", async () => {
    render(
      <Form>
        <RHFFileInput name="cv" rules={{ required: "Pick a file" }} />
      </Form>
    );

    await submit();

    expect(field()).toHaveAttribute("data-error");
  });

  it("stops the form when it is required and empty", async () => {
    const onSubmit = vi.fn();

    render(
      <Form onSubmit={onSubmit}>
        <RHFFileInput name="cv" rules={{ required: "Pick a file" }} />
      </Form>
    );

    await submit();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls your own onChange alongside the form", async () => {
    const onChange = vi.fn();

    render(
      <Form defaultValues={{ cv: picked("cv.pdf") }}>
        <RHFFileInput name="cv" onChange={onChange} />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
