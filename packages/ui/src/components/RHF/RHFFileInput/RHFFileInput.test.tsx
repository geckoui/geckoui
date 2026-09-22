import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RHFFileInput } from "..";
import { Form, submit } from "../testUtils";

describe("RHFFileInput", () => {
  const makeFile = (name: string) => new File(["content"], name, { type: "text/plain" });

  beforeEach(() => {
    let issued = 0;

    globalThis.URL.createObjectURL = vi.fn(() => `blob:preview-${++issued}`);
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it("renders a file input", () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;
    expect(input).toHaveAttribute("type", "file");
  });

  it("stores a single file", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <Form defaultValues={{ doc: null }} onSubmit={onSubmit}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;
    await userEvent.upload(input, makeFile("a.txt"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect((onSubmit.mock.calls[0][0] as { doc: File }).doc.name).toBe("a.txt");
  });

  it("revokes the preview of a file that has been replaced", async () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;

    await userEvent.upload(input, makeFile("a.txt"));
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    // Picking again drops the first file, whose blob would otherwise be pinned for good
    await userEvent.upload(input, makeFile("b.txt"));

    await waitFor(() => expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-1"));
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it("keeps the preview of the file it is still holding", async () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;

    await userEvent.upload(input, makeFile("a.txt"));

    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it("revokes what it is still holding when it unmounts", async () => {
    const { container, unmount } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;

    await userEvent.upload(input, makeFile("a.txt"));
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    unmount();

    expect(URL.revokeObjectURL).toHaveBeenCalledExactlyOnceWith("blob:preview-1");
  });

  it("stores an array when multiple is set", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <Form defaultValues={{ docs: null }} onSubmit={onSubmit}>
        <RHFFileInput name="docs" multiple />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;
    await userEvent.upload(input, [makeFile("a.txt"), makeFile("b.txt")]);
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const { docs } = onSubmit.mock.calls[0][0] as { docs: File[] };
    expect(docs.map((f) => f.name)).toEqual(["a.txt", "b.txt"]);
  });

  it("attaches a preview url to each file", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" onChange={onChange} />
      </Form>
    );

    const input = container.querySelector<HTMLInputElement>(".GeckoUIRHFFileInput__input")!;
    await userEvent.upload(input, makeFile("a.txt"));

    expect(onChange.mock.calls[0][0]).toMatchObject({ preview: "blob:preview-1" });
  });

  it("renders custom content and marks the input", () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" render={() => <span data-testid="drop-zone" />} />
      </Form>
    );

    expect(screen.getByTestId("drop-zone")).toBeInTheDocument();
    expect(container.querySelector(".GeckoUIRHFFileInput__input")).toHaveAttribute("data-custom");
  });

  it("disables the input", () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" disabled />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFFileInput__input")).toBeDisabled();
  });

  it("applies the base class and a custom class", () => {
    const { container } = render(
      <Form defaultValues={{ doc: null }}>
        <RHFFileInput name="doc" className="custom" />
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFFileInput")).toHaveClass("custom");
  });
});
