import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, type UseFormProps, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { RHFFilePicker } from ".";

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

const root = () => document.querySelector<HTMLElement>(".GeckoUIRHFFilePicker")!;
const dropzone = () => document.querySelector<HTMLElement>(".GeckoUIRHFFilePicker__upload-area")!;
const rows = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIRHFFilePicker__file-row"));

const pickedFile = (name: string, size: number, preview = `blob:${name}`) => ({
  name,
  size,
  preview
});

describe("RHFFilePicker", () => {
  it("renders the default drop area", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    expect(dropzone()).toBeInTheDocument();
    expect(screen.getByText("Drag and drop files here, or browse")).toBeInTheDocument();
  });

  it("renders a browse button for files and for folders", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    expect(screen.getByRole("button", { name: "Browse Files" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Browse Folder" })).toBeInTheDocument();
  });

  it("renders no file list while empty", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    expect(document.querySelector(".GeckoUIRHFFilePicker__file-list")).toBeNull();
  });

  it("lists the picked files with their names", () => {
    render(
      <Form defaultValues={{ files: [pickedFile("a.txt", 100), pickedFile("b.txt", 2048)] }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    expect(rows()).toHaveLength(2);
    expect(screen.getByText("a.txt")).toBeInTheDocument();
    expect(screen.getByText("b.txt")).toBeInTheDocument();
  });

  it("formats the file sizes", () => {
    render(
      <Form
        defaultValues={{
          files: [
            pickedFile("zero.txt", 0),
            pickedFile("kb.txt", 2048),
            pickedFile("mb.txt", 1572864)
          ]
        }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    expect(screen.getByText("0 B")).toBeInTheDocument();
    expect(screen.getByText("2 KB")).toBeInTheDocument();
    expect(screen.getByText("1.5 MB")).toBeInTheDocument();
  });

  it("removes a file from its remove button", async () => {
    render(
      <Form defaultValues={{ files: [pickedFile("a.txt", 100), pickedFile("b.txt", 200)] }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    await userEvent.click(
      rows()[0].querySelector<HTMLButtonElement>(".GeckoUIRHFFilePicker__file-remove")!
    );

    await waitFor(() => expect(rows()).toHaveLength(1));
    expect(screen.queryByText("a.txt")).toBeNull();
  });

  it("submits the remaining files after a removal", async () => {
    const onSubmit = vi.fn();
    render(
      <Form
        defaultValues={{ files: [pickedFile("a.txt", 100), pickedFile("b.txt", 200)] }}
        onSubmit={onSubmit}>
        <RHFFilePicker name="files" />
      </Form>
    );

    await userEvent.click(
      rows()[0].querySelector<HTMLButtonElement>(".GeckoUIRHFFilePicker__file-remove")!
    );
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const { files } = onSubmit.mock.calls[0][0] as { files: { name: string }[] };
    expect(files.map((f) => f.name)).toEqual(["b.txt"]);
  });

  it("flags dragging while a file is over the drop area", async () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    fireEvent.dragEnter(dropzone());
    await waitFor(() => expect(root()).toHaveAttribute("data-dragging", "true"));

    fireEvent.dragLeave(dropzone());
    await waitFor(() => expect(root()).not.toHaveAttribute("data-dragging"));
  });

  it("marks itself errored after a failed submit", async () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" rules={{ required: "Required" }} />
      </Form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(root()).toHaveAttribute("data-error"));
  });

  it("is not errored while valid", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    expect(root()).not.toHaveAttribute("data-error");
  });

  it("replaces the whole UI with a render prop", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" render={() => <div data-testid="custom" />} />
      </Form>
    );

    expect(screen.getByTestId("custom")).toBeInTheDocument();
    expect(document.querySelector(".GeckoUIRHFFilePicker")).toBeNull();
  });

  it("gives the render prop the field, the dropzone ref and the picker controls", () => {
    const render_ = vi.fn((_props: Record<string, unknown>) => <div data-testid="custom" />);
    render(
      <Form defaultValues={{ files: [pickedFile("a.txt", 1)] }}>
        <RHFFilePicker name="files" render={render_ as never} />
      </Form>
    );

    expect(render_.mock.calls[0][0]).toMatchObject({
      dragging: false,
      loading: false,
      field: expect.objectContaining({ name: "files" })
    });
    expect(typeof render_.mock.calls[0][0].openFilePicker).toBe("function");
  });
});

describe("RHFFilePicker disabled", () => {
  it("marks the root and the buttons", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" disabled />
      </Form>
    );

    expect(root()).toHaveAttribute("data-disabled");
    expect(screen.getByRole("button", { name: "Browse Files" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Browse Folder" })).toBeDisabled();
  });

  it("does not disable anything by default", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" />
      </Form>
    );

    expect(root()).not.toHaveAttribute("data-disabled");
    expect(screen.getByRole("button", { name: "Browse Files" })).not.toBeDisabled();
  });

  it("ignores a drop", async () => {
    const onChange = vi.fn();

    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" disabled onChange={onChange} />
      </Form>
    );

    fireEvent.drop(dropzone(), {
      dataTransfer: { items: [{ kind: "file", type: "image/png" }], types: ["Files"] }
    });

    await waitFor(() => expect(onChange).not.toHaveBeenCalled());
    expect(root()).not.toHaveAttribute("data-dragging");
  });

  it("does not take a drag over", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker name="files" disabled />
      </Form>
    );

    fireEvent.dragEnter(dropzone());

    expect(root()).not.toHaveAttribute("data-dragging");
  });

  it("cannot remove a file that is already there", () => {
    render(
      <Form defaultValues={{ files: [pickedFile("a.png", 10)] }}>
        <RHFFilePicker name="files" disabled />
      </Form>
    );

    expect(rows()).toHaveLength(1);
    expect(rows()[0].querySelector("button")).toBeDisabled();
  });

  it("hands `disabled` to a custom render", () => {
    render(
      <Form defaultValues={{ files: [] }}>
        <RHFFilePicker
          name="files"
          disabled
          render={({ disabled }) => <p>{disabled ? "off" : "on"}</p>}
        />
      </Form>
    );

    expect(screen.getByText("off")).toBeInTheDocument();
  });
});
