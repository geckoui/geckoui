import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { initialsFrom } from "./Avatar.utils";
import Avatar from "./Avatar/Avatar";

const root = (container: HTMLElement) => container.firstChild as HTMLElement;

describe("initialsFrom", () => {
  it.each([
    ["Ada Lovelace", "AL"],
    ["ada lovelace", "AL"],
    ["Cher", "C"],
    ["  Ada   Byron   King  ", "AK"],
    ["", ""],
    ["   ", ""]
  ])("turns %s into %s", (name, expected) => {
    expect(initialsFrom(name)).toBe(expected);
  });

  it("takes whole code points, so a name outside the basic plane is not cut in half", () => {
    expect(initialsFrom("🦎 Gecko")).toBe("🦎G");
  });
});

describe("Avatar", () => {
  describe("defaults", () => {
    it("is a medium circle in the default colour", () => {
      const { container } = render(<Avatar name="Ada Lovelace" />);

      expect(root(container)).toHaveAttribute("data-size", "md");
      expect(root(container)).toHaveAttribute("data-shape", "circle");
      expect(root(container)).toHaveAttribute("data-color", "default");
    });
  });

  describe("what it shows", () => {
    it("shows the image when there is one", () => {
      render(<Avatar name="Ada Lovelace" src="/ada.png" />);

      expect(screen.getByRole("img")).toHaveAttribute("src", "/ada.png");
    });

    it("names the image from alt, falling back to name", () => {
      const { rerender } = render(<Avatar name="Ada Lovelace" src="/ada.png" />);

      expect(screen.getByRole("img")).toHaveAttribute("alt", "Ada Lovelace");

      rerender(<Avatar name="Ada Lovelace" alt="A portrait" src="/ada.png" />);

      expect(screen.getByRole("img")).toHaveAttribute("alt", "A portrait");
    });

    it("falls back to the initials when there is no image", () => {
      render(<Avatar name="Ada Lovelace" />);

      expect(screen.getByText("AL")).toBeInTheDocument();
    });

    it("falls back to the initials when the image fails to load", async () => {
      render(<Avatar name="Ada Lovelace" src="/gone.png" />);

      screen.getByRole("img").dispatchEvent(new Event("error"));

      expect(await screen.findByText("AL")).toBeInTheDocument();
    });

    it("tries again when a new src arrives, so one dead url does not hide the next", async () => {
      const { rerender } = render(<Avatar name="Ada Lovelace" src="/gone.png" />);

      screen.getByRole("img").dispatchEvent(new Event("error"));

      expect(await screen.findByText("AL")).toBeInTheDocument();

      rerender(<Avatar name="Ada Lovelace" src="/ada.png" />);

      expect(screen.getByRole("img")).toHaveAttribute("src", "/ada.png");
    });

    it("prefers a given fallback over the initials", () => {
      render(<Avatar name="Ada Lovelace" fallback="AI" />);

      expect(screen.getByText("AI")).toBeInTheDocument();
      expect(screen.queryByText("AL")).not.toBeInTheDocument();
    });

    it("draws the person icon when there is nothing to go on", () => {
      const { container } = render(<Avatar />);

      expect(container.querySelector(".GeckoUIAvatar__fallback svg")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("labels itself when the fallback is what is on screen", () => {
      render(<Avatar name="Ada Lovelace" />);

      expect(screen.getByRole("img")).toHaveAccessibleName("Ada Lovelace");
    });

    it("hides the initials, so they are not read out as letters", () => {
      const { container } = render(<Avatar name="Ada Lovelace" />);

      expect(container.querySelector(".GeckoUIAvatar__fallback")).toHaveAttribute(
        "aria-hidden",
        "true"
      );
    });
  });

  describe("onClick", () => {
    it("becomes a button that can be reached and used by keyboard", async () => {
      const onClick = vi.fn();

      render(<Avatar name="Ada Lovelace" onClick={onClick} />);

      const button = screen.getByRole("button", { name: "Ada Lovelace" });

      expect(button).toHaveAttribute("tabindex", "0");

      await userEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);

      button.focus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");

      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it("is not a control without one", () => {
      render(<Avatar name="Ada Lovelace" />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("keeps a caller's own onKeyDown", async () => {
      const onKeyDown = vi.fn();

      render(<Avatar name="Ada" onClick={vi.fn()} onKeyDown={onKeyDown} />);

      screen.getByRole("button").focus();
      await userEvent.keyboard("{Escape}");

      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe("passthrough", () => {
    it("keeps the class name alongside its own", () => {
      const { container } = render(<Avatar className="ring-2" />);

      expect(root(container)).toHaveClass("GeckoUIAvatar", "ring-2");
    });

    it("forwards a ref to the root", () => {
      const ref = createRef<HTMLSpanElement>();

      render(<Avatar ref={ref} name="Ada" />);

      expect(ref.current).toHaveClass("GeckoUIAvatar");
    });
  });
});
