import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GeckoUIProvider } from "../GeckoUIProvider";
import { overlayStore } from "../GeckoUIProvider/overlay-store";
import Dialog from "./Dialog";

beforeEach(() => {
  overlayStore.getSnapshot().forEach((entry) => overlayStore.remove(entry.id));
});

async function settle() {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

function Provider() {
  return (
    <GeckoUIProvider>
      <div>page</div>
    </GeckoUIProvider>
  );
}

describe("Dialog", () => {
  describe("declarative", () => {
    it("renders nothing when closed", () => {
      render(<Dialog open={false}>content</Dialog>);

      expect(screen.queryByText("content")).not.toBeInTheDocument();
    });

    it("renders its children when open", () => {
      render(<Dialog open>content</Dialog>);

      expect(screen.getByText("content")).toBeInTheDocument();
    });

    it("lets the parent own the open state", async () => {
      function Host() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button onClick={() => setOpen(true)}>open</button>
            <Dialog open={open} onClose={() => setOpen(false)}>
              <span>body</span>
            </Dialog>
          </>
        );
      }
      render(<Host />);

      await userEvent.click(screen.getByText("open"));
      expect(screen.getByText("body")).toBeInTheDocument();

      await settle();
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByText("body")).not.toBeInTheDocument());
    });
  });

  describe("imperative", () => {
    it("shows content and returns an id", async () => {
      render(<Provider />);
      let id = "";

      act(() => {
        id = Dialog.show({ content: () => <p>hello</p> });
      });
      await settle();

      expect(id).toBeTruthy();
      expect(screen.getByText("hello")).toBeInTheDocument();
    });

    it("passes a dismiss callback to the content", async () => {
      render(<Provider />);

      act(() => {
        Dialog.show({
          content: ({ dismiss }) => <button onClick={dismiss}>close me</button>
        });
      });
      await settle();

      await userEvent.click(screen.getByText("close me"));

      await waitFor(() => expect(screen.queryByText("close me")).not.toBeInTheDocument());
    });

    it("stacks dialogs", async () => {
      render(<Provider />);

      act(() => {
        Dialog.show({ content: () => <p>first</p> });
      });
      await settle();
      act(() => {
        Dialog.show({ content: () => <p>second</p> });
      });
      await settle();

      expect(screen.getByText("first")).toBeInTheDocument();
      expect(screen.getByText("second")).toBeInTheDocument();
    });

    it("dismisses a specific dialog by id", async () => {
      render(<Provider />);
      let first = "";

      act(() => {
        first = Dialog.show({ content: () => <p>first</p> });
      });
      await settle();
      act(() => {
        Dialog.show({ content: () => <p>second</p> });
      });
      await settle();

      act(() => Dialog.dismiss(first));

      await waitFor(() => expect(screen.queryByText("first")).not.toBeInTheDocument());
      expect(screen.getByText("second")).toBeInTheDocument();
    });

    it("dismisses the topmost dialog when given no id", async () => {
      render(<Provider />);

      act(() => {
        Dialog.show({ content: () => <p>first</p> });
      });
      await settle();
      act(() => {
        Dialog.show({ content: () => <p>second</p> });
      });
      await settle();

      act(() => Dialog.dismiss());

      await waitFor(() => expect(screen.queryByText("second")).not.toBeInTheDocument());
      expect(screen.getByText("first")).toBeInTheDocument();
    });

    it("only the topmost dialog responds to Escape", async () => {
      render(<Provider />);

      act(() => {
        Dialog.show({ content: () => <p>first</p> });
      });
      await settle();
      act(() => {
        Dialog.show({ content: () => <p>second</p> });
      });
      await settle();

      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(screen.queryByText("second")).not.toBeInTheDocument());
      expect(screen.getByText("first")).toBeInTheDocument();
    });

    it("logs an error when no provider is mounted", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      act(() => {
        Dialog.show({ content: () => <p>orphan</p> });
      });

      expect(error).toHaveBeenCalledWith(expect.stringContaining("GeckoUIProvider"));
      error.mockRestore();
    });
  });
});
