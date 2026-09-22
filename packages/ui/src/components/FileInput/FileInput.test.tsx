import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import FileInput from "./FileInput";
import type { PickedFile, PreviewFile } from "./FileInput.types";

const field = () => document.querySelector<HTMLElement>(".GeckoUIFileInput")!;

const picked = (name: string) =>
  Object.assign(new File(["x"], name, { type: "image/png" }), { path: "" }) as PickedFile;

const previewed = (name: string) =>
  Object.assign(picked(name), { preview: `blob:${name}` }) as PreviewFile;

describe("FileInput", () => {
  describe("what it shows", () => {
    it("shows the single placeholder while empty", () => {
      render(<FileInput />);

      expect(screen.getByText("Choose a file")).toBeInTheDocument();
      expect(field()).toHaveAttribute("data-empty");
    });

    it("shows the plural placeholder when multiple", () => {
      render(<FileInput multiple />);

      expect(screen.getByText("Choose files")).toBeInTheDocument();
    });

    it("takes a placeholder of your own", () => {
      render(<FileInput placeholder="Attach your CV" />);

      expect(screen.getByText("Attach your CV")).toBeInTheDocument();
    });

    it("shows the file's name when one is held", () => {
      render(<FileInput value={picked("invoice.pdf")} />);

      expect(screen.getByText("invoice.pdf")).toBeInTheDocument();
      expect(field()).not.toHaveAttribute("data-empty");
    });

    it("counts them when several are held, the way a native input does", () => {
      render(<FileInput multiple value={[picked("a.png"), picked("b.png")]} />);

      expect(screen.getByText("2 files")).toBeInTheDocument();
    });

    it("says one file rather than 1 files", () => {
      render(<FileInput multiple value={[picked("a.png")]} />);

      expect(screen.getByText("1 file")).toBeInTheDocument();
    });
  });

  describe("clearing", () => {
    it("empties a single field", async () => {
      const onChange = vi.fn();

      render(<FileInput value={picked("a.png")} onChange={onChange} />);

      await userEvent.click(screen.getByRole("button", { name: "Clear" }));

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("empties a multiple field to an array, not to null", async () => {
      const onChange = vi.fn();

      render(<FileInput multiple value={[picked("a.png")]} onChange={onChange} />);

      await userEvent.click(screen.getByRole("button", { name: "Clear" }));

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it("has nothing to clear while empty", () => {
      render(<FileInput />);

      expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    });

    it("drops the clear button on request", () => {
      render(<FileInput hideClearIcon value={picked("a.png")} />);

      expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    });

    it("does not offer it while read only", () => {
      render(<FileInput readOnly value={picked("a.png")} />);

      expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    });
  });

  describe("state", () => {
    it.each([
      ["enabled", {}],
      ["disabled", { disabled: true }],
      ["readonly", { readOnly: true }]
    ])("reports %s", (expected, props) => {
      render(<FileInput {...props} />);

      expect(field()).toHaveAttribute("data-state", expected);
    });

    it("marks an error", () => {
      render(<FileInput hasError />);

      expect(field()).toHaveAttribute("data-error");
    });

    it("cannot be reached or used while disabled", () => {
      render(<FileInput disabled />);

      expect(screen.getByRole("button", { name: "Choose a file" })).toBeDisabled();
      expect(field()).toHaveAttribute("aria-disabled", "true");
    });

    it("keeps the trigger and the clear button as siblings, never nested", () => {
      render(<FileInput value={picked("a.png")} />);

      const trigger = screen.getByRole("button", { name: "a.png" });
      const clear = screen.getByRole("button", { name: "Clear" });

      expect(trigger).not.toContainElement(clear);
      expect(clear).not.toContainElement(trigger);
    });

    it("says it is read only rather than disappearing", () => {
      render(<FileInput readOnly />);

      expect(field()).toHaveAttribute("aria-readonly", "true");
    });
  });

  describe("dragging", () => {
    it("marks the field while a file is over it", () => {
      render(<FileInput />);

      fireEvent.dragEnter(field());
      expect(field()).toHaveAttribute("data-dragging");

      fireEvent.dragLeave(field());
      expect(field()).not.toHaveAttribute("data-dragging");
    });

    it("does not take a drag while disabled", () => {
      render(<FileInput disabled />);

      fireEvent.dragEnter(field());

      expect(field()).not.toHaveAttribute("data-dragging");
    });

    it("does not take a drag while read only", () => {
      render(<FileInput readOnly />);

      fireEvent.dragEnter(field());

      expect(field()).not.toHaveAttribute("data-dragging");
    });

    it("ignores an empty drop", async () => {
      const onChange = vi.fn();

      render(<FileInput onChange={onChange} />);

      fireEvent.drop(field(), { dataTransfer: { items: [] } });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("render", () => {
    it("draws inside the field, which keeps the drop target", () => {
      render(
        <FileInput
          multiple
          value={[picked("a.png")]}
          render={({ files }) => <span data-testid="mine">{files.length} held</span>}
        />
      );

      expect(screen.getByTestId("mine")).toHaveTextContent("1 held");
      expect(field()).toHaveAttribute("data-custom");
      expect(field()).toContainElement(screen.getByTestId("mine"));
    });

    it("hands over the drag state", () => {
      render(<FileInput render={({ dragging }) => <span>{dragging ? "over" : "away"}</span>} />);

      expect(screen.getByText("away")).toBeInTheDocument();

      fireEvent.dragEnter(field());

      expect(screen.getByText("over")).toBeInTheDocument();
    });

    it("can empty the field", async () => {
      const onChange = vi.fn();

      render(
        <FileInput
          value={picked("a.png")}
          onChange={onChange}
          render={({ clear }) => (
            <button type="button" onClick={clear}>
              Reset
            </button>
          )}
        />
      );

      await userEvent.click(screen.getByRole("button", { name: "Reset" }));

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("can drop one file from the list", async () => {
      const a = picked("a.png");
      const b = picked("b.png");
      const onChange = vi.fn();

      render(
        <FileInput
          multiple
          value={[a, b]}
          onChange={onChange}
          render={({ files, remove }) => (
            <>
              {files.map((file) => (
                <button key={file.name} type="button" onClick={() => remove(file)}>
                  drop {file.name}
                </button>
              ))}
            </>
          )}
        />
      );

      await userEvent.click(screen.getByRole("button", { name: "drop a.png" }));

      expect(onChange).toHaveBeenCalledWith([b]);
    });
  });

  describe("what reaches the DOM", () => {
    it("keeps its own props off the element", () => {
      render(<FileInput multiple append unique max={3} preview accept="image/*" />);

      const attributes = Array.from(field().attributes).map((a) => a.name);

      // These are the component's, not the div's. React warns loudly if they get through.
      expect(attributes).not.toContain("append");
      expect(attributes).not.toContain("unique");
      expect(attributes).not.toContain("max");
      expect(attributes).not.toContain("multiple");
      expect(attributes).not.toContain("preview");
      expect(attributes).not.toContain("accept");
    });

    it("warns about nothing it renders", () => {
      const warn = vi.spyOn(console, "error").mockImplementation(() => undefined);

      render(
        <FileInput
          multiple
          append
          unique
          preview
          max={2}
          value={[previewed("a.png")]}
          data-testid="field"
        />
      );

      expect(warn).not.toHaveBeenCalled();

      warn.mockRestore();
    });

    it("still passes a data attribute through", () => {
      render(<FileInput data-testid="field" />);

      expect(screen.getByTestId("field")).toBe(field());
    });
  });

  it("opens the dialog from the keyboard", async () => {
    render(<FileInput />);

    await userEvent.tab();

    expect(screen.getByRole("button", { name: "Choose a file" })).toHaveFocus();
  });

  it("holds its own value when it is not given one", () => {
    const Controlled = () => {
      const [file, setFile] = useState<PickedFile | null>(null);

      return (
        <>
          <button type="button" onClick={() => setFile(picked("set.png"))}>
            Set
          </button>
          <FileInput value={file} onChange={setFile} />
        </>
      );
    };

    render(<Controlled />);

    fireEvent.click(screen.getByRole("button", { name: "Set" }));

    expect(screen.getByText("set.png")).toBeInTheDocument();
  });
});
