import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GeckoUIProvider } from "../GeckoUIProvider";
import { overlayStore } from "../GeckoUIProvider/overlay-store";
import { ConfirmDialog } from ".";

function setup() {
  return render(
    <GeckoUIProvider>
      <div>page</div>
    </GeckoUIProvider>
  );
}

async function settle() {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

// the overlay store is a module singleton and dialogs portal to document.body,
// so unmounting the React tree is not enough to clear them between tests
beforeEach(() => {
  overlayStore.getSnapshot().forEach((entry) => overlayStore.remove(entry.id));
});

describe("ConfirmDialog", () => {
  it("shows the title and content", async () => {
    setup();

    act(() => {
      ConfirmDialog.show({ title: "Delete file?", content: "This cannot be undone." });
    });
    await settle();

    expect(screen.getByText("Delete file?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("uses default button labels", async () => {
    setup();

    act(() => {
      ConfirmDialog.show({ title: "x" });
    });
    await settle();

    expect(screen.getByRole("button", { name: "Ok" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("uses custom button labels", async () => {
    setup();

    act(() => {
      ConfirmDialog.show({
        title: "x",
        confirmButtonLabel: "Yes, delete",
        cancelButtonLabel: "Keep it"
      });
    });
    await settle();

    expect(screen.getByRole("button", { name: "Yes, delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep it" })).toBeInTheDocument();
  });

  it("returns an id", async () => {
    setup();
    let id = "";

    act(() => {
      id = ConfirmDialog.show({ title: "x" });
    });
    await settle();

    expect(id).toBeTruthy();
  });

  describe("confirm", () => {
    it("calls onConfirm", async () => {
      setup();
      const onConfirm = vi.fn();

      act(() => {
        ConfirmDialog.show({ title: "x", onConfirm });
      });
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Ok" }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("closes afterwards", async () => {
      setup();

      act(() => {
        ConfirmDialog.show({ title: "Delete file?" });
      });
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Ok" }));

      await waitFor(() => expect(screen.queryByText("Delete file?")).not.toBeInTheDocument());
    });

    it("stays open when the callback calls preventDefault", async () => {
      setup();

      act(() => {
        ConfirmDialog.show({
          title: "Delete file?",
          onConfirm: ({ preventDefault }) => preventDefault()
        });
      });
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Ok" }));

      await act(async () => {
        await new Promise((r) => setTimeout(r, 400));
      });
      expect(screen.getByText("Delete file?")).toBeInTheDocument();
    });

    it("waits for an async callback before closing", async () => {
      setup();
      let release: () => void = () => {};
      const onConfirm = async () => {
        await new Promise<void>((r) => (release = r));
      };

      act(() => {
        ConfirmDialog.show({ title: "Delete file?", onConfirm });
      });
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Ok" }));

      expect(screen.getByText("Delete file?")).toBeInTheDocument();

      await act(async () => {
        release();
      });
      await waitFor(() => expect(screen.queryByText("Delete file?")).not.toBeInTheDocument());
    });
  });

  describe("cancel", () => {
    it("calls onCancel", async () => {
      setup();
      const onCancel = vi.fn();

      act(() => {
        ConfirmDialog.show({ title: "x", onCancel });
      });
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("waits for an async callback before closing", async () => {
      // onCancel was not awaited, so its loading state never appeared and a
      // preventDefault inside it came too late
      setup();
      let release: () => void = () => {};
      const onCancel = async () => {
        await new Promise<void>((r) => (release = r));
      };

      act(() => {
        ConfirmDialog.show({ title: "Delete file?", onCancel });
      });
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      expect(screen.getByText("Delete file?")).toBeInTheDocument();

      await act(async () => {
        release();
      });
      await waitFor(() => expect(screen.queryByText("Delete file?")).not.toBeInTheDocument());
    });

    it("stays open when the async callback calls preventDefault", async () => {
      setup();

      act(() => {
        ConfirmDialog.show({
          title: "Delete file?",
          onCancel: async ({ preventDefault }) => {
            await Promise.resolve();
            preventDefault();
          }
        });
      });
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

      await act(async () => {
        await new Promise((r) => setTimeout(r, 400));
      });
      expect(screen.getByText("Delete file?")).toBeInTheDocument();
    });
  });
});
