import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../components/Button";
import { Dialog } from "../components/Dialog";
import { Drawer } from "../components/Drawer";
import { Menu, MenuItem } from "../components/Menu";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";
import { Select, SelectOption } from "../components/Select";
import { useLayer } from "./layerStack";

const drawerBackdrop = () => document.querySelector<HTMLElement>(".GeckoUIDrawer__backdrop")!;
const popoverContent = () => document.querySelector(".GeckoUIPopover__content");
const selectMenu = () => document.querySelector(".GeckoUISelectMenu");

async function settle() {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

function PickerInDrawer({ onClose }: { onClose: () => void }) {
  return (
    <Drawer open onClose={onClose}>
      <Popover>
        <PopoverTrigger>
          <Button>Pick a color</Button>
        </PopoverTrigger>
        <PopoverContent>Colors</PopoverContent>
      </Popover>
    </Drawer>
  );
}

describe("layer stack", () => {
  it("puts the overlay that opened last on top", () => {
    const first = renderHook(({ open }) => useLayer(open), { initialProps: { open: true } });
    const second = renderHook(({ open }) => useLayer(open), { initialProps: { open: true } });

    expect(first.result.current()).toBe(false);
    expect(second.result.current()).toBe(true);

    second.rerender({ open: false });

    expect(first.result.current()).toBe(true);
    first.unmount();
    second.unmount();
  });

  describe("an outside click closes only the topmost overlay", () => {
    it("closes a popover inside a drawer, then the drawer", async () => {
      const onClose = vi.fn();
      render(<PickerInDrawer onClose={onClose} />);
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Pick a color" }));
      expect(popoverContent()).not.toBeNull();

      await userEvent.click(drawerBackdrop());

      expect(popoverContent()).toBeNull();
      expect(onClose).not.toHaveBeenCalled();

      await userEvent.click(drawerBackdrop());

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes a select menu inside a drawer, then the drawer", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose}>
          <Select value={undefined} onChange={() => {}}>
            <SelectOption value="apple" label="Apple" />
          </Select>
        </Drawer>
      );
      await settle();
      await userEvent.click(document.querySelector<HTMLElement>(".GeckoUISelectButton")!);
      expect(selectMenu()).not.toBeNull();

      await userEvent.click(drawerBackdrop());

      expect(selectMenu()).toBeNull();
      expect(onClose).not.toHaveBeenCalled();

      await userEvent.click(drawerBackdrop());

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes a popover inside a dialog, then the dialog", async () => {
      const onClose = vi.fn();
      render(
        <Dialog open onClose={onClose}>
          <Popover>
            <PopoverTrigger>
              <Button>Pick a color</Button>
            </PopoverTrigger>
            <PopoverContent>Colors</PopoverContent>
          </Popover>
        </Dialog>
      );
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Pick a color" }));
      const backdrop = document.querySelector<HTMLElement>(".GeckoUIDialog__backdrop")!;

      await userEvent.click(backdrop);

      expect(popoverContent()).toBeNull();
      expect(onClose).not.toHaveBeenCalled();

      await userEvent.click(backdrop);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("still lets a click inside the drawer close the popover", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose}>
          <Popover>
            <PopoverTrigger>
              <Button>Pick a color</Button>
            </PopoverTrigger>
            <PopoverContent>Colors</PopoverContent>
          </Popover>
          <p>Elsewhere in the drawer</p>
        </Drawer>
      );
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Pick a color" }));

      await userEvent.click(screen.getByText("Elsewhere in the drawer"));

      expect(popoverContent()).toBeNull();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("Escape closes only the topmost overlay", () => {
    it("closes a menu inside a drawer, then the drawer", async () => {
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose}>
          <Menu label="Actions">
            <MenuItem>Edit</MenuItem>
          </Menu>
        </Drawer>
      );
      await settle();
      await userEvent.click(screen.getByRole("button", { name: "Actions" }));
      expect(screen.queryByRole("menu")).not.toBeNull();

      await userEvent.keyboard("{Escape}");

      expect(screen.queryByRole("menu")).toBeNull();
      expect(onClose).not.toHaveBeenCalled();

      await userEvent.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
