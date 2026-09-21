import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import ColorPicker from "./ColorPicker";

const saturation = () => screen.getByRole("slider", { name: "Saturation and brightness" });
const hue = () => screen.getByRole("slider", { name: "Hue" });
const opacity = () => screen.getByRole("slider", { name: "Opacity" });
const field = () => screen.getByRole("textbox", { name: "Colour value" });
const formatTrigger = () => screen.getByRole("button", { name: "Colour format" });

/**
 * jsdom has no layout and no pointer capture, so the surface is given a size to measure
 * against and the capture calls are stubbed out.
 */
const sizeSurface = (container: HTMLElement, selector: string, width = 200, height = 160) => {
  const surface = container.querySelector(selector) as HTMLElement;

  surface.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width, height, right: width, bottom: height, x: 0, y: 0 }) as DOMRect;
  surface.setPointerCapture = () => {};
  surface.releasePointerCapture = () => {};
  surface.hasPointerCapture = () => true;

  return surface;
};

describe("ColorPicker", () => {
  describe("markup", () => {
    it("draws the square, the hue and the opacity", () => {
      render(<ColorPicker defaultValue="#3b82f6" />);

      expect(saturation()).toBeInTheDocument();
      expect(hue()).toBeInTheDocument();
      expect(opacity()).toBeInTheDocument();
    });

    it("shows the value in the field", () => {
      render(<ColorPicker defaultValue="#3b82f6" />);

      expect(field()).toHaveValue("#3b82f6");
    });

    it("drops the field with showInput={false}", () => {
      render(<ColorPicker defaultValue="#3b82f6" showInput={false} />);

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("reports where the square's handle sits", () => {
      render(<ColorPicker defaultValue="#3b82f6" />);

      expect(saturation()).toHaveAttribute("aria-valuenow", "76");
      expect(saturation()).toHaveAttribute("aria-valuetext", "saturation 76%, brightness 96%");
    });
  });

  describe("the keyboard", () => {
    it("moves saturation with the arrows", async () => {
      const onChange = vi.fn();

      render(<ColorPicker defaultValue="#808080" onChange={onChange} />);

      saturation().focus();
      await userEvent.keyboard("{ArrowRight}");

      expect(onChange).toHaveBeenCalled();
      expect(Number(saturation().getAttribute("aria-valuenow"))).toBeGreaterThan(0);
    });

    it("takes ten steps at a time with shift", async () => {
      render(<ColorPicker defaultValue="#808080" />);

      saturation().focus();
      await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");

      expect(saturation()).toHaveAttribute("aria-valuenow", "10");
    });

    it("stops at the ends rather than wrapping", async () => {
      render(<ColorPicker defaultValue="#808080" />);

      saturation().focus();
      await userEvent.keyboard("{Home}");

      expect(saturation()).toHaveAttribute("aria-valuenow", "0");

      await userEvent.keyboard("{ArrowLeft}");

      expect(saturation()).toHaveAttribute("aria-valuenow", "0");
    });

    it("moves the hue with the arrows", async () => {
      render(<ColorPicker defaultValue="#ff0000" />);

      hue().focus();
      await userEvent.keyboard("{ArrowRight}");

      expect(hue()).toHaveAttribute("aria-valuenow", "1");
    });

    it("calls onChangeComplete on a key, which needs no release", async () => {
      const onChangeComplete = vi.fn();

      render(<ColorPicker defaultValue="#808080" onChangeComplete={onChangeComplete} />);

      hue().focus();
      await userEvent.keyboard("{ArrowRight}");

      expect(onChangeComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("dragging", () => {
    it("fires onChange while moving and onChangeComplete once on release", () => {
      const onChange = vi.fn();
      const onChangeComplete = vi.fn();

      const { container } = render(
        <ColorPicker
          defaultValue="#ff0000"
          onChange={onChange}
          onChangeComplete={onChangeComplete}
        />
      );

      const square = sizeSurface(container, ".GeckoUIColorPicker__saturation");

      fireEvent.pointerDown(square, { clientX: 100, clientY: 80, pointerId: 1 });
      fireEvent.pointerMove(square, { clientX: 150, clientY: 40, pointerId: 1 });

      expect(onChange).toHaveBeenCalled();
      expect(onChangeComplete).not.toHaveBeenCalled();

      fireEvent.pointerUp(square, { clientX: 150, clientY: 40, pointerId: 1 });

      expect(onChangeComplete).toHaveBeenCalledTimes(1);
    });

    it("reads the square as saturation across and brightness down", () => {
      const { container } = render(<ColorPicker defaultValue="#ff0000" />);
      const square = sizeSurface(container, ".GeckoUIColorPicker__saturation");

      // half way across, a quarter of the way down
      fireEvent.pointerDown(square, { clientX: 100, clientY: 40, pointerId: 1 });

      expect(saturation()).toHaveAttribute("aria-valuenow", "50");
      expect(saturation()).toHaveAttribute("aria-valuetext", "saturation 50%, brightness 75%");
    });

    it("does not move while disabled", () => {
      const onChange = vi.fn();

      const { container } = render(
        <ColorPicker defaultValue="#ff0000" disabled onChange={onChange} />
      );

      const square = sizeSurface(container, ".GeckoUIColorPicker__saturation");

      fireEvent.pointerDown(square, { clientX: 100, clientY: 40, pointerId: 1 });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("the value field", () => {
    it("takes what was typed on Enter", async () => {
      const onChange = vi.fn();

      render(<ColorPicker defaultValue="#ff0000" onChange={onChange} />);

      await userEvent.clear(field());
      await userEvent.type(field(), "#00ff00{Enter}");

      expect(onChange).toHaveBeenLastCalledWith("#00ff00");
    });

    it("takes it on blur too", async () => {
      const onChange = vi.fn();

      render(<ColorPicker defaultValue="#ff0000" onChange={onChange} />);

      await userEvent.clear(field());
      await userEvent.type(field(), "rgb(0, 0, 255)");
      fireEvent.blur(field());

      expect(onChange).toHaveBeenLastCalledWith("#0000ff");
    });

    it("puts back what was there when the text means nothing", async () => {
      const onChange = vi.fn();

      render(<ColorPicker defaultValue="#ff0000" onChange={onChange} />);

      await userEvent.clear(field());
      await userEvent.type(field(), "nonsense{Enter}");

      expect(onChange).not.toHaveBeenCalled();
      expect(field()).toHaveValue("#ff0000");
    });

    it("leaves the typing alone until it is committed", async () => {
      const onChange = vi.fn();

      render(<ColorPicker defaultValue="#ff0000" onChange={onChange} />);

      await userEvent.clear(field());
      await userEvent.type(field(), "#00f");

      expect(field()).toHaveValue("#00f");
      expect(onChange).not.toHaveBeenCalled();
    });

    it("abandons the typing on Escape", async () => {
      render(<ColorPicker defaultValue="#ff0000" />);

      await userEvent.clear(field());
      await userEvent.type(field(), "#00ff00{Escape}");

      expect(field()).toHaveValue("#ff0000");
    });
  });

  describe("the format dropdown", () => {
    it("offers hex, rgb and hsl by default", async () => {
      render(<ColorPicker defaultValue="#3b82f6" />);

      await userEvent.click(formatTrigger());

      expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
        "HEX",
        "RGB",
        "HSL"
      ]);
    });

    it("rewrites the value in the format that was picked", async () => {
      const onChange = vi.fn();

      render(<ColorPicker defaultValue="#3b82f6" onChange={onChange} />);

      await userEvent.click(formatTrigger());
      await userEvent.click(screen.getByRole("option", { name: "RGB" }));

      expect(field()).toHaveValue("rgb(59, 130, 246)");
      expect(onChange).toHaveBeenLastCalledWith("rgb(59, 130, 246)");
    });

    it("starts on the first format given", () => {
      render(<ColorPicker defaultValue="#3b82f6" formats={["hsl", "hex"]} />);

      expect(field()).toHaveValue("hsl(217, 91%, 60%)");
    });

    it("drops the dropdown when only one format is offered", () => {
      render(<ColorPicker defaultValue="#3b82f6" formats={["hex"]} />);

      expect(screen.queryByRole("button", { name: "Colour format" })).not.toBeInTheDocument();
    });

    it("moves through the list with the keyboard", async () => {
      render(<ColorPicker defaultValue="#3b82f6" />);

      formatTrigger().focus();
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowDown}{Enter}");

      expect(field()).toHaveValue("rgb(59, 130, 246)");
    });

    it("closes on Escape without changing anything", async () => {
      render(<ColorPicker defaultValue="#3b82f6" />);

      await userEvent.click(formatTrigger());
      await userEvent.keyboard("{Escape}");

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(field()).toHaveValue("#3b82f6");
    });
  });

  describe("alpha", () => {
    it("stays out of the value while the colour is solid", () => {
      render(<ColorPicker defaultValue="#3b82f6" />);

      expect(field()).toHaveValue("#3b82f6");
    });

    it("joins the value once there is any", async () => {
      const onChange = vi.fn();

      render(<ColorPicker defaultValue="#3b82f6" onChange={onChange} />);

      opacity().focus();
      await userEvent.keyboard("{Home}");

      expect(onChange).toHaveBeenLastCalledWith("#3b82f600");
    });

    it("keeps the alpha it was given", () => {
      render(<ColorPicker defaultValue="rgba(59, 130, 246, 0.5)" />);

      expect(field()).toHaveValue("#3b82f680");
      expect(opacity()).toHaveAttribute("aria-valuenow", "0.5");
    });
  });

  describe("swatches", () => {
    it("shows nothing when none were given", () => {
      render(<ColorPicker defaultValue="#ff0000" />);

      expect(screen.queryByRole("group", { name: "Preset colours" })).not.toBeInTheDocument();
    });

    it("picks one", async () => {
      const onChange = vi.fn();
      const onChangeComplete = vi.fn();

      render(
        <ColorPicker
          defaultValue="#ff0000"
          swatches={["#00ff00", "#0000ff"]}
          onChange={onChange}
          onChangeComplete={onChangeComplete}
        />
      );

      await userEvent.click(screen.getByRole("button", { name: "#0000ff" }));

      expect(onChange).toHaveBeenLastCalledWith("#0000ff");
      expect(onChangeComplete).toHaveBeenLastCalledWith("#0000ff");
    });

    it("marks the one that is on", () => {
      render(<ColorPicker defaultValue="#00ff00" swatches={["#00ff00", "#0000ff"]} />);

      expect(screen.getByRole("button", { name: "#00ff00" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.getByRole("button", { name: "#0000ff" })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });
  });

  describe("the eyedropper", () => {
    it("is absent where the browser has no API for it", () => {
      render(<ColorPicker defaultValue="#ff0000" eyeDropper />);

      expect(
        screen.queryByRole("button", { name: "Pick a colour from the screen" })
      ).not.toBeInTheDocument();
    });

    it("is absent when it was not asked for", () => {
      vi.stubGlobal(
        "EyeDropper",
        class {
          open = async () => ({ sRGBHex: "#00ff00" });
        }
      );

      render(<ColorPicker defaultValue="#ff0000" />);

      expect(
        screen.queryByRole("button", { name: "Pick a colour from the screen" })
      ).not.toBeInTheDocument();

      vi.unstubAllGlobals();
    });

    it("takes the colour it read", async () => {
      const onChange = vi.fn();

      vi.stubGlobal(
        "EyeDropper",
        class {
          open = async () => ({ sRGBHex: "#00ff00" });
        }
      );

      render(<ColorPicker defaultValue="#ff0000" eyeDropper onChange={onChange} />);

      await userEvent.click(screen.getByRole("button", { name: "Pick a colour from the screen" }));

      expect(onChange).toHaveBeenLastCalledWith("#00ff00");

      vi.unstubAllGlobals();
    });
  });

  describe("controlled", () => {
    const Controlled = () => {
      const [color, setColor] = useState("#ff0000");

      return (
        <>
          <button type="button" onClick={() => setColor("#0000ff")}>
            Make it blue
          </button>
          <ColorPicker value={color} onChange={setColor} />
        </>
      );
    };

    it("follows the value it is given", async () => {
      render(<Controlled />);

      expect(field()).toHaveValue("#ff0000");

      await userEvent.click(screen.getByRole("button", { name: "Make it blue" }));

      expect(field()).toHaveValue("#0000ff");
    });

    it("keeps the hue you are on while dragging through the greys", async () => {
      render(<Controlled />);

      saturation().focus();
      await userEvent.keyboard("{Home}");

      // Every grey parses back to hue 0, which would drag the hue slider home with it
      expect(hue()).toHaveAttribute("aria-valuenow", "0");

      hue().focus();
      await userEvent.keyboard("{ArrowRight}{ArrowRight}");

      expect(hue()).toHaveAttribute("aria-valuenow", "2");
    });
  });

  describe("the render hatches", () => {
    it("draws your own handle inside the one that moves", () => {
      render(
        <ColorPicker
          defaultValue="#ff0000"
          renderSaturation={({ color }) => <span data-testid="mine">{color}</span>}
        />
      );

      expect(screen.getByTestId("mine")).toHaveTextContent("#ff0000");
      expect(saturation()).toHaveAttribute("data-custom");
      expect(saturation()).toContainElement(screen.getByTestId("mine"));
    });

    it("keeps the keyboard on the handle it drew", async () => {
      render(
        <ColorPicker defaultValue="#808080" renderHueThumb={() => <span data-testid="hue" />} />
      );

      hue().focus();
      await userEvent.keyboard("{ArrowRight}");

      expect(hue()).toHaveAttribute("aria-valuenow", "1");
    });
  });

  it("puts what is left of the props on the container", () => {
    const { container } = render(<ColorPicker defaultValue="#ff0000" data-testid="panel" />);

    expect(container.firstChild).toHaveAttribute("data-testid", "panel");
  });
});
