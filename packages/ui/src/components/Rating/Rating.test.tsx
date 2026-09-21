import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Rating from "./Rating";

const root = (container: HTMLElement) => container.firstChild as HTMLElement;
const icons = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(".GeckoUIRating__icon"));
const fills = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(".GeckoUIRating__icon__fill")).map(
    (fill) => fill.style.width
  );

/** jsdom has no layout, so each icon is given one to measure a pointer against. */
const sizeIcons = (container: HTMLElement) =>
  icons(container).forEach((icon, index) => {
    icon.getBoundingClientRect = () =>
      ({ left: index * 20, width: 20, top: 0, height: 20 }) as DOMRect;
  });

describe("Rating", () => {
  describe("defaults", () => {
    it("is five whole icons", () => {
      const { container } = render(<Rating value={0} />);

      expect(icons(container)).toHaveLength(5);
      expect(screen.getAllByRole("radio")).toHaveLength(5);
    });

    it("is a radio group, because a rating is a one of many choice", () => {
      render(<Rating value={3} aria-label="Score" />);

      expect(screen.getByRole("radiogroup", { name: "Score" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "3 of 5" })).toBeChecked();
    });

    it("names each one, or lets you name them", () => {
      const { rerender } = render(<Rating value={0} />);

      expect(screen.getByRole("radio", { name: "2 of 5" })).toBeInTheDocument();

      rerender(<Rating value={0} getLabel={(at) => `${at} stars`} />);

      expect(screen.getByRole("radio", { name: "2 stars" })).toBeInTheDocument();
    });
  });

  describe("what is drawn", () => {
    it("fills up to the value", () => {
      const { container } = render(<Rating value={3} />);

      expect(fills(container)).toEqual(["100%", "100%", "100%", "0%", "0%"]);
    });

    it("draws a fraction exactly, whether it can be picked or not", () => {
      const { container, rerender } = render(<Rating value={4.3} />);

      expect(fills(container)).toEqual(["100%", "100%", "100%", "100%", "30%"]);

      // readOnly only takes the interaction away; it never changes the drawing
      rerender(<Rating value={4.3} readOnly />);

      expect(fills(container)[4]).toBe("30%");
    });

    it("follows the pointer, and goes back when it leaves", async () => {
      const { container } = render(<Rating value={1} />);

      sizeIcons(container);
      fireEvent.pointerMove(icons(container)[3], { clientX: 70 });

      expect(fills(container)).toEqual(["100%", "100%", "100%", "100%", "0%"]);

      fireEvent.pointerLeave(root(container));

      expect(fills(container)).toEqual(["100%", "0%", "0%", "0%", "0%"]);
    });
  });

  describe("picking", () => {
    it("takes the whole icon that was clicked", async () => {
      const onChange = vi.fn();
      const { container } = render(<Rating value={0} onChange={onChange} />);

      sizeIcons(container);
      await userEvent.click(icons(container)[2]);

      expect(onChange).toHaveBeenCalledWith(3);
    });

    it("splits an icon by the precision", async () => {
      const onChange = vi.fn();
      const { container } = render(<Rating value={0} onChange={onChange} precision={0.5} />);

      sizeIcons(container);
      fireEvent.click(icons(container)[2], { clientX: 42 });

      expect(onChange).toHaveBeenCalledWith(2.5);
    });

    it("puts it back to nothing when the same one is picked again", async () => {
      const onChange = vi.fn();
      const { container } = render(<Rating value={3} onChange={onChange} />);

      sizeIcons(container);
      await userEvent.click(icons(container)[2]);

      expect(onChange).toHaveBeenCalledWith(0);
    });

    it("keeps it when clearing is turned off", async () => {
      const onChange = vi.fn();
      const { container } = render(<Rating value={3} onChange={onChange} clearable={false} />);

      sizeIcons(container);
      await userEvent.click(icons(container)[2]);

      expect(onChange).toHaveBeenCalledWith(3);
    });

    it.each(["readOnly", "disabled"] as const)("picks nothing while %s", async (state) => {
      const onChange = vi.fn();
      const { container } = render(
        <Rating
          value={3}
          onChange={onChange}
          readOnly={state === "readOnly"}
          disabled={state === "disabled"}
        />
      );

      sizeIcons(container);
      await userEvent.click(icons(container)[4]);
      fireEvent.pointerMove(icons(container)[4], { clientX: 90 });

      expect(onChange).not.toHaveBeenCalled();
      // and the pointer does not raise anyone's hopes either
      expect(fills(container)).toEqual(["100%", "100%", "100%", "0%", "0%"]);
    });
  });

  describe("the keyboard", () => {
    const press = async (keys: string) => {
      await userEvent.tab();
      await userEvent.keyboard(keys);
    };

    it.each([
      ["{ArrowRight}", 4],
      ["{ArrowUp}", 4],
      ["{ArrowLeft}", 2],
      ["{ArrowDown}", 2],
      ["{Home}", 0],
      ["{End}", 5]
    ])("moves on %s", async (keys, expected) => {
      const onChange = vi.fn();

      render(<Rating value={3} onChange={onChange} />);
      await press(keys);

      expect(onChange).toHaveBeenLastCalledWith(expected);
    });

    it("steps by the precision", async () => {
      const onChange = vi.fn();

      render(<Rating value={3} onChange={onChange} precision={0.5} />);
      await press("{ArrowRight}");

      expect(onChange).toHaveBeenLastCalledWith(3.5);
    });

    it("goes back to nothing from the first one", async () => {
      const onChange = vi.fn();

      render(<Rating value={1} onChange={onChange} />);
      await press("{ArrowLeft}");

      expect(onChange).toHaveBeenLastCalledWith(0);
    });

    it("stops at the top", async () => {
      const onChange = vi.fn();

      render(<Rating value={5} onChange={onChange} />);
      await press("{ArrowRight}");

      expect(onChange).toHaveBeenLastCalledWith(5);
    });
  });

  describe("axes", () => {
    it("draws as many as it is asked for", () => {
      const { container } = render(<Rating value={7} max={10} />);

      expect(icons(container)).toHaveLength(10);
      expect(screen.getAllByRole("radio")).toHaveLength(10);
    });

    it.each(["default", "primary", "success", "error", "warning", "info"] as const)(
      "exposes color %s",
      (color) => {
        const { container } = render(<Rating value={3} color={color} />);

        expect(root(container)).toHaveAttribute("data-color", color);
      }
    );

    it.each(["sm", "md", "lg"] as const)("exposes size %s", (size) => {
      const { container } = render(<Rating value={3} size={size} />);

      expect(root(container)).toHaveAttribute("data-size", size);
    });
  });

  describe("icons", () => {
    it("uses the one it is given for both halves of each", () => {
      const { container } = render(<Rating value={3} icon={<i data-testid="heart" />} />);

      expect(container.querySelectorAll("[data-testid='heart']")).toHaveLength(10);
    });

    it("takes a different one for the empty part", () => {
      const { container } = render(
        <Rating
          value={3}
          icon={<i data-testid="solid" />}
          emptyIcon={<i data-testid="outline" />}
        />
      );

      expect(container.querySelectorAll("[data-testid='solid']")).toHaveLength(5);
      expect(container.querySelectorAll("[data-testid='outline']")).toHaveLength(5);
    });
  });

  it("ties its radios together, so two on a page do not fight", () => {
    render(
      <>
        <Rating value={1} name="first" />
        <Rating value={2} name="second" />
      </>
    );

    const names = screen.getAllByRole("radio").map((radio) => radio.getAttribute("name"));

    expect(new Set(names)).toEqual(new Set(["first", "second"]));
  });

  it("makes a name up when it is not given one", () => {
    const { container } = render(
      <>
        <Rating value={1} />
        <Rating value={2} />
      </>
    );

    const names = Array.from(container.querySelectorAll("input")).map((input) => input.name);

    expect(new Set(names).size).toBe(2);
  });
});
