import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import RangeSlider from "./RangeSlider/RangeSlider";
import Slider from "./Slider/Slider";

const thumb = () => screen.getByRole("slider");
const thumbs = () => screen.getAllByRole("slider");
const root = (container: HTMLElement) => container.firstChild as HTMLElement;

/**
 * jsdom has no layout and no pointer capture, so the track is given a size to measure
 * against and the capture calls are stubbed out.
 */
const sizeTrack = (container: HTMLElement) => {
  const track = container.querySelector(".GeckoUISlider__track") as HTMLElement;

  track.getBoundingClientRect = () =>
    ({ left: 0, width: 200, top: 0, height: 6, right: 200, bottom: 6, x: 0, y: 0 }) as DOMRect;
  track.setPointerCapture = () => {};
  track.releasePointerCapture = () => {};

  return track;
};

const Range = ({
  start,
  minGap,
  onChange
}: {
  start: [number, number];
  minGap?: number;
  onChange?: (value: [number, number]) => void;
}) => {
  const [value, setValue] = useState(start);

  return (
    <RangeSlider
      value={value}
      minGap={minGap}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

const Controlled = ({ onChangeEnd }: { onChangeEnd?: (value: number) => void }) => {
  const [value, setValue] = useState(40);

  return <Slider value={value} onChange={setValue} onChangeEnd={onChangeEnd} />;
};

describe("Slider", () => {
  describe("defaults", () => {
    it("runs 0 to 100 in a medium primary", () => {
      const { container } = render(<Slider value={40} onChange={() => {}} />);

      expect(root(container)).toHaveAttribute("data-color", "primary");
      expect(root(container)).toHaveAttribute("data-size", "md");
      expect(thumb()).toHaveAttribute("aria-valuemin", "0");
      expect(thumb()).toHaveAttribute("aria-valuemax", "100");
      expect(thumb()).toHaveAttribute("aria-valuenow", "40");
    });

    it("is a slider a screen reader can read", () => {
      render(<Slider value={40} onChange={() => {}} aria-label="Volume" />);

      expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
      expect(thumb()).toHaveAttribute("aria-orientation", "horizontal");
    });
  });

  describe("the keyboard", () => {
    const press = async (keys: string) => {
      // tab rather than focus(), so React sees the event and the label can react to it
      await userEvent.tab();
      await userEvent.keyboard(keys);
    };

    it.each([
      ["{ArrowRight}", 41],
      ["{ArrowUp}", 41],
      ["{ArrowLeft}", 39],
      ["{ArrowDown}", 39],
      ["{Home}", 0],
      ["{End}", 100],
      ["{PageUp}", 50],
      ["{PageDown}", 30]
    ])("moves to %s on %s", async (keys, expected) => {
      const onChange = vi.fn();

      render(<Slider value={40} onChange={onChange} />);
      await press(keys);

      expect(onChange).toHaveBeenLastCalledWith(expected);
    });

    it("jumps ten steps with shift", async () => {
      const onChange = vi.fn();

      render(<Slider value={40} onChange={onChange} step={2} />);
      await press("{Shift>}{ArrowRight}{/Shift}");

      expect(onChange).toHaveBeenLastCalledWith(60);
    });

    it("stops at the ends rather than running past them", async () => {
      const onChange = vi.fn();
      const { rerender } = render(<Slider value={100} onChange={onChange} />);

      await press("{ArrowRight}");

      expect(onChange).not.toHaveBeenCalled();

      rerender(<Slider value={0} onChange={onChange} />);
      await press("{ArrowLeft}");

      expect(onChange).not.toHaveBeenCalled();
    });

    it("commits once per press", async () => {
      const onChangeEnd = vi.fn();

      render(<Controlled onChangeEnd={onChangeEnd} />);
      await press("{ArrowRight}");

      expect(onChangeEnd).toHaveBeenCalledTimes(1);
      expect(onChangeEnd).toHaveBeenCalledWith(41);
    });

    it("does nothing while disabled", async () => {
      const onChange = vi.fn();

      render(<Slider value={40} onChange={onChange} disabled />);

      expect(thumb()).toHaveAttribute("tabindex", "-1");

      await press("{ArrowRight}");

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("pointer", () => {
    it("jumps to where the track was pressed", async () => {
      const onChange = vi.fn();
      const { container } = render(<Slider value={40} onChange={onChange} />);
      const track = sizeTrack(container);

      await userEvent.pointer({
        target: track,
        coords: { clientX: 150, clientY: 3 },
        keys: "[MouseLeft>]"
      });

      expect(onChange).toHaveBeenLastCalledWith(75);
    });

    it("follows the pointer, and commits only when it is let go", () => {
      const onChangeEnd = vi.fn();
      const { container } = render(<Controlled onChangeEnd={onChangeEnd} />);
      const track = sizeTrack(container);

      // fireEvent rather than userEvent here: the release has to land on the same handler
      // that took the capture, and userEvent routes it by its own pointer bookkeeping
      fireEvent.pointerDown(track, { clientX: 20, pointerId: 1 });
      fireEvent.pointerMove(track, { clientX: 100, pointerId: 1 });
      fireEvent.pointerMove(track, { clientX: 180, pointerId: 1 });

      expect(thumb()).toHaveAttribute("aria-valuenow", "90");
      expect(onChangeEnd).not.toHaveBeenCalled();

      fireEvent.pointerUp(track, { clientX: 180, pointerId: 1 });

      expect(onChangeEnd).toHaveBeenCalledTimes(1);
      expect(onChangeEnd).toHaveBeenCalledWith(90);
    });

    it("ignores the track while disabled", async () => {
      const onChange = vi.fn();
      const { container } = render(<Slider value={40} onChange={onChange} disabled />);
      const track = sizeTrack(container);

      await userEvent.pointer({
        target: track,
        coords: { clientX: 150, clientY: 3 },
        keys: "[MouseLeft>]"
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("steps", () => {
    it("lands on the grid", async () => {
      const onChange = vi.fn();
      const { container } = render(<Slider value={0} onChange={onChange} step={25} />);
      const track = sizeTrack(container);

      await userEvent.pointer({
        target: track,
        coords: { clientX: 130, clientY: 3 },
        keys: "[MouseLeft>]"
      });

      expect(onChange).toHaveBeenLastCalledWith(75);
    });

    it("keeps a fractional step's precision", async () => {
      const onChange = vi.fn();

      render(<Slider value={0.2} onChange={onChange} min={0} max={1} step={0.1} />);
      await userEvent.tab();
      await userEvent.keyboard("{ArrowRight}");

      expect(onChange).toHaveBeenLastCalledWith(0.3);
    });
  });

  describe("label", () => {
    it("is hidden until the thumb is being used", async () => {
      render(<Slider value={40} onChange={() => {}} label={({ value }) => `${value}%`} />);

      expect(screen.queryByText("40%")).not.toBeInTheDocument();

      await userEvent.tab();

      expect(screen.getByText("40%")).toBeInTheDocument();
    });

    it("takes a plain node too", async () => {
      render(<Slider value={40} onChange={() => {}} label="Volume" />);

      await userEvent.tab();

      expect(screen.getByText("Volume")).toBeInTheDocument();
    });
  });

  describe("renderThumb", () => {
    it("draws it yourself, and keeps how it works", async () => {
      const onChange = vi.fn();
      const { container } = render(
        <Slider
          value={40}
          onChange={onChange}
          renderThumb={({ value, dragging }) => (
            <span data-testid="handle" data-held={dragging || undefined}>
              {value}
            </span>
          )}
        />
      );

      expect(screen.getByTestId("handle")).toHaveTextContent("40");
      // still the thing that is positioned, and still the slider a reader sees
      expect(container.querySelector(".GeckoUISlider__thumb")).toHaveAttribute("data-custom", "");
      expect(thumb()).toHaveAttribute("aria-valuenow", "40");

      await userEvent.tab();
      await userEvent.keyboard("{ArrowRight}");

      expect(onChange).toHaveBeenLastCalledWith(41);
    });

    it("says when it is being dragged", () => {
      const { container } = render(
        <Slider
          value={0}
          onChange={() => {}}
          renderThumb={({ dragging }) => (
            <span data-testid="handle" data-held={dragging || undefined} />
          )}
        />
      );
      const track = sizeTrack(container);

      expect(screen.getByTestId("handle")).not.toHaveAttribute("data-held");

      fireEvent.pointerDown(track, { clientX: 100, pointerId: 1 });

      expect(screen.getByTestId("handle")).toHaveAttribute("data-held", "true");
    });

    it("gives each end of a range its own", () => {
      render(
        <RangeSlider
          value={[20, 60]}
          onChange={() => {}}
          renderThumb={({ index, value }) => <span data-testid={`h${index}`}>{value}</span>}
        />
      );

      expect(screen.getByTestId("h0")).toHaveTextContent("20");
      expect(screen.getByTestId("h1")).toHaveTextContent("60");
    });
  });

  describe("marks", () => {
    it("draws one tick each, with labels where there are any", () => {
      const { container } = render(
        <Slider
          value={40}
          onChange={() => {}}
          marks={[{ value: 0, label: "Off" }, { value: 50 }, { value: 100, label: "Max" }]}
        />
      );

      expect(container.querySelectorAll(".GeckoUISlider__mark")).toHaveLength(3);
      expect(container.querySelectorAll(".GeckoUISlider__mark-label")).toHaveLength(2);
    });

    it("drops the ones off the ends of the track", () => {
      const { container } = render(
        <Slider
          value={40}
          onChange={() => {}}
          min={10}
          max={90}
          marks={[{ value: 0 }, { value: 50 }, { value: 100 }]}
        />
      );

      expect(container.querySelectorAll(".GeckoUISlider__mark")).toHaveLength(1);
    });
  });
});

describe("RangeSlider", () => {
  it("gives each end a thumb of its own, named", () => {
    render(<RangeSlider value={[20, 60]} onChange={() => {}} />);

    expect(thumbs()).toHaveLength(2);
    expect(screen.getByRole("slider", { name: "Minimum" })).toHaveAttribute("aria-valuenow", "20");
    expect(screen.getByRole("slider", { name: "Maximum" })).toHaveAttribute("aria-valuenow", "60");
  });

  it("reports each thumb's own room, not the whole track", () => {
    render(<RangeSlider value={[20, 60]} onChange={() => {}} />);

    // the lower thumb cannot pass the upper one, and a screen reader is told so
    expect(thumbs()[0]).toHaveAttribute("aria-valuemax", "60");
    expect(thumbs()[1]).toHaveAttribute("aria-valuemin", "20");
  });

  it("stops the thumbs at each other rather than letting them swap", async () => {
    const onChange = vi.fn();

    render(<Range start={[59, 60]} onChange={onChange} />);

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    expect(onChange).toHaveBeenLastCalledWith([60, 60]);

    onChange.mockClear();
    await userEvent.keyboard("{ArrowRight}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("holds them minGap apart", async () => {
    const onChange = vi.fn();

    render(<Range start={[20, 40]} minGap={20} onChange={onChange} />);

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    expect(onChange).not.toHaveBeenCalled();
    expect(thumbs()[0]).toHaveAttribute("aria-valuemax", "20");
  });

  it("moves the thumb nearer the press", async () => {
    const onChange = vi.fn();
    const { container } = render(<RangeSlider value={[20, 80]} onChange={onChange} />);
    const track = sizeTrack(container);

    await userEvent.pointer({
      target: track,
      coords: { clientX: 60, clientY: 3 },
      keys: "[MouseLeft>]"
    });

    expect(onChange).toHaveBeenLastCalledWith([30, 80]);
  });
});
