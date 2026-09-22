import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Menu, MenuItem, MenuTrigger, useMenu } from ".";

const openPanel = () => screen.queryByRole("menu");

describe("Menu", () => {
  it("renders a default button with the label", () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
  });

  it("falls back to Menu when no label is given", () => {
    render(
      <Menu>
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });

  it("keeps the panel closed at first", () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    expect(openPanel()).toBeNull();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the panel on click", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));

    expect(openPanel()).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  });

  it("closes the panel on a second click", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button"));

    expect(openPanel()).toBeNull();
  });

  it("does not open when disabled", async () => {
    render(
      <Menu label="Actions" disabled>
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    expect(screen.getByRole("button")).toBeDisabled();

    await userEvent.click(screen.getByRole("button"));

    expect(openPanel()).toBeNull();
  });

  it("closes when clicking outside", async () => {
    render(
      <div>
        <button type="button">Outside</button>
        <Menu label="Actions">
          <MenuItem>Edit</MenuItem>
        </Menu>
      </div>
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(openPanel()).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Outside" }));

    await waitFor(() => expect(openPanel()).toBeNull());
  });

  it("runs the item handler and closes the menu on click", async () => {
    const onClick = vi.fn();
    render(
      <Menu label="Actions">
        <MenuItem onClick={onClick}>Edit</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(openPanel()).toBeNull();
  });

  it("ignores clicks on a disabled item", async () => {
    const onClick = vi.fn();
    render(
      <Menu label="Actions">
        <MenuItem disabled onClick={onClick}>
          Edit
        </MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(onClick).not.toHaveBeenCalled();
    expect(openPanel()).toBeInTheDocument();
  });

  it("marks a disabled item and takes it out of the tab order", async () => {
    render(
      <Menu label="Actions">
        <MenuItem disabled>Edit</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));

    const item = screen.getByRole("menuitem", { name: "Edit" });
    expect(item).toHaveAttribute("data-disabled", "true");
    expect(item).toHaveAttribute("tabIndex", "-1");
  });

  it("activates an item with Enter", async () => {
    const onClick = vi.fn();
    render(
      <Menu label="Actions">
        <MenuItem onClick={onClick}>Edit</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    screen.getByRole("menuitem", { name: "Edit" }).focus();
    await userEvent.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("activates an item with Space", async () => {
    const onClick = vi.fn();
    render(
      <Menu label="Actions">
        <MenuItem onClick={onClick}>Edit</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    screen.getByRole("menuitem", { name: "Edit" }).focus();
    await userEvent.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("moves through items with the arrow keys", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("wraps from the last item back to the first", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Copy</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");

    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("wraps from the first item back to the last", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Copy</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{ArrowDown}{ArrowUp}");

    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();
  });

  it("skips disabled items when arrowing", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
        <MenuItem disabled>Copy</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");

    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
  });

  it("closes on Escape", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{Escape}");

    expect(openPanel()).toBeNull();
  });

  it("closes on Tab", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{Tab}");

    expect(openPanel()).toBeNull();
  });

  it("opens the panel with ArrowDown from the button", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Copy</MenuItem>
      </Menu>
    );

    screen.getByRole("button").focus();
    await userEvent.keyboard("{ArrowDown}");

    expect(openPanel()).toBeInTheDocument();
  });

  it("focuses the first item with ArrowDown while the panel is already open", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Copy</MenuItem>
      </Menu>
    );

    await userEvent.click(screen.getByRole("button"));
    screen.getByRole("button").focus();
    await userEvent.keyboard("{ArrowDown}");

    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
  });

  it("focuses the first item when opening with ArrowDown", async () => {
    render(
      <Menu label="Actions">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Copy</MenuItem>
      </Menu>
    );

    screen.getByRole("button").focus();
    await userEvent.keyboard("{ArrowDown}");

    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
  });

  it("skips a disabled first item when opening with ArrowDown", async () => {
    render(
      <Menu label="Actions">
        <MenuItem disabled>Edit</MenuItem>
        <MenuItem>Copy</MenuItem>
      </Menu>
    );

    screen.getByRole("button").focus();
    await userEvent.keyboard("{ArrowDown}");

    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus());
  });

  it("applies the custom classes", async () => {
    const { container } = render(
      <Menu label="Actions" className="wrap" buttonClassName="btn" menuClassName="panel">
        <MenuItem className="item">Edit</MenuItem>
      </Menu>
    );

    expect(container.querySelector(".GeckoUIMenu")).toHaveClass("wrap");
    expect(screen.getByRole("button")).toHaveClass("GeckoUIMenu__button", "btn");

    await userEvent.click(screen.getByRole("button"));

    expect(openPanel()).toHaveClass("GeckoUIMenu__items", "panel");
    expect(screen.getByRole("menuitem")).toHaveClass("GeckoUIMenu__item", "item");
  });

  describe("MenuTrigger", () => {
    it("replaces the default button", async () => {
      render(
        <Menu label="Actions">
          <MenuTrigger>
            {({ toggleMenu }) => (
              <button type="button" onClick={toggleMenu}>
                Custom
              </button>
            )}
          </MenuTrigger>
          <MenuItem>Edit</MenuItem>
        </Menu>
      );

      expect(screen.queryByRole("button", { name: "Actions" })).toBeNull();

      await userEvent.click(screen.getByRole("button", { name: "Custom" }));

      expect(openPanel()).toBeInTheDocument();
    });

    it("exposes open, openMenu and closeMenu", async () => {
      render(
        <Menu label="Actions">
          <MenuTrigger>
            {({ open, openMenu, closeMenu }) => (
              <button type="button" onClick={open ? closeMenu : openMenu}>
                {open ? "Close" : "Open"}
              </button>
            )}
          </MenuTrigger>
          <MenuItem>Edit</MenuItem>
        </Menu>
      );

      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      expect(openPanel()).toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: "Close" }));
      expect(openPanel()).toBeNull();
    });

    it("reports the disabled state", () => {
      render(
        <Menu label="Actions" disabled>
          <MenuTrigger>
            {({ disabled }) => <span>{disabled ? "disabled" : "enabled"}</span>}
          </MenuTrigger>
          <MenuItem>Edit</MenuItem>
        </Menu>
      );

      expect(screen.getByText("disabled")).toBeInTheDocument();
    });
  });

  describe("useMenu", () => {
    it("throws when used outside a Menu", () => {
      const Outside = () => {
        useMenu();
        return null;
      };
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<Outside />)).toThrow("useMenu must be used within a Menu");

      spy.mockRestore();
    });
  });
});
