import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Textarea } from ".";

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea placeholder="Notes" />);

    expect(screen.getByPlaceholderText("Notes")).toBeInTheDocument();
  });

  it("types into the textarea", async () => {
    const onChange = vi.fn();
    render(<Textarea placeholder="Notes" onChange={onChange} />);

    await userEvent.type(screen.getByPlaceholderText("Notes"), "hi");

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByPlaceholderText("Notes")).toHaveValue("hi");
  });

  it("forwards the ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Notes" />);

    expect(ref.current).toBe(screen.getByPlaceholderText("Notes"));
  });

  it("applies the base class and a custom class", () => {
    render(<Textarea className="custom" placeholder="Notes" />);

    expect(screen.getByPlaceholderText("Notes")).toHaveClass("GeckoUITextarea", "custom");
  });

  it("supports a controlled value", () => {
    render(<Textarea value="fixed" onChange={() => {}} placeholder="Notes" />);

    expect(screen.getByPlaceholderText("Notes")).toHaveValue("fixed");
  });

  it("disables the textarea", () => {
    render(<Textarea disabled placeholder="Notes" />);

    expect(screen.getByPlaceholderText("Notes")).toBeDisabled();
  });

  it("passes through native attributes", () => {
    render(<Textarea name="bio" maxLength={20} readOnly placeholder="Notes" />);

    const el = screen.getByPlaceholderText("Notes");
    expect(el).toHaveAttribute("name", "bio");
    expect(el).toHaveAttribute("maxLength", "20");
    expect(el).toHaveAttribute("readonly");
  });

  it("calls onBlur when focus leaves", async () => {
    const onBlur = vi.fn();
    render(<Textarea onBlur={onBlur} placeholder="Notes" />);

    await userEvent.click(screen.getByPlaceholderText("Notes"));
    await userEvent.tab();

    expect(onBlur).toHaveBeenCalled();
  });
});

/**
 * jsdom reports no layout, so the two things the sizing reads — the computed box and
 * `scrollHeight` — are stood up by hand. What is under test is the arithmetic between them.
 */
describe("Textarea autoResize", () => {
  const LINE = 20;
  const PADDING = 6;
  const BORDER = 1;

  const stubLayout = (scrollHeight: number, boxSizing = "border-box") => {
    const real = window.getComputedStyle;

    vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element) =>
      el instanceof HTMLTextAreaElement
        ? ({
            lineHeight: `${LINE}px`,
            fontSize: "16px",
            paddingTop: `${PADDING / 2}px`,
            paddingBottom: `${PADDING / 2}px`,
            borderTopWidth: `${BORDER}px`,
            borderBottomWidth: `${BORDER}px`,
            boxSizing
          } as unknown as CSSStyleDeclaration)
        : real(el)
    );

    Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
      configurable: true,
      get: () => scrollHeight
    });
  };

  afterEach(() => vi.restoreAllMocks());

  const field = () => screen.getByPlaceholderText("Notes") as HTMLTextAreaElement;

  it("leaves the height alone without autoResize", () => {
    stubLayout(400);

    render(<Textarea placeholder="Notes" />);

    expect(field().style.height).toBe("");
  });

  it("grows to what the content needs", () => {
    stubLayout(146); // more than two rows, fewer than ten

    render(<Textarea autoResize rows={2} maxRows={10} placeholder="Notes" />);

    // 146 content + 2 border, since the box is border-box and scrollHeight omits borders
    expect(field().style.height).toBe("148px");
  });

  it("never goes below rows", () => {
    stubLayout(10); // less than one row

    render(<Textarea autoResize rows={3} placeholder="Notes" />);

    // 3 rows x 20 + 6 padding = 66, + 2 border
    expect(field().style.height).toBe("68px");
  });

  it("stops at maxRows and scrolls from there", () => {
    stubLayout(1000);

    render(<Textarea autoResize rows={2} maxRows={4} placeholder="Notes" />);

    // 4 rows x 20 + 6 padding = 86, + 2 border
    expect(field().style.height).toBe("88px");
    expect(field().style.overflowY).toBe("auto");
  });

  it("hides the scrollbar while it still fits", () => {
    stubLayout(66);

    render(<Textarea autoResize rows={2} maxRows={10} placeholder="Notes" />);

    expect(field().style.overflowY).toBe("hidden");
  });

  it("takes the padding off again for a content-box", () => {
    stubLayout(146, "content-box");

    render(<Textarea autoResize rows={2} maxRows={10} placeholder="Notes" />);

    // content-box measures the content alone, so the padding scrollHeight counted comes off
    expect(field().style.height).toBe("140px");
  });

  it("grows an uncontrolled field as it is typed into", () => {
    stubLayout(46);

    render(<Textarea autoResize rows={2} maxRows={10} placeholder="Notes" />);

    expect(field().style.height).toBe("48px");

    stubLayout(146);
    fireEvent.input(field(), { target: { value: "several\nlines\nof\ntext" } });

    expect(field().style.height).toBe("148px");
  });

  it("grows a controlled field when its value changes", () => {
    stubLayout(46);

    const { rerender } = render(
      <Textarea autoResize rows={2} maxRows={10} value="one" onChange={() => {}} placeholder="Notes" />
    );

    expect(field().style.height).toBe("48px");

    stubLayout(146);
    rerender(
      <Textarea
        autoResize
        rows={2}
        maxRows={10}
        value={"several\nlines"}
        onChange={() => {}}
        placeholder="Notes"
      />
    );

    expect(field().style.height).toBe("148px");
  });

  it("still calls an onInput of your own", () => {
    stubLayout(46);

    const onInput = vi.fn();

    render(<Textarea autoResize onInput={onInput} placeholder="Notes" />);

    fireEvent.input(field(), { target: { value: "x" } });

    expect(onInput).toHaveBeenCalled();
  });

  it("clears what it wrote when autoResize is turned off", () => {
    stubLayout(146);

    const { rerender } = render(<Textarea autoResize rows={2} placeholder="Notes" />);

    expect(field().style.height).not.toBe("");

    rerender(<Textarea rows={2} placeholder="Notes" />);

    expect(field().style.height).toBe("");
    expect(field().style.overflowY).toBe("");
  });

  it("falls back to the font size when lineHeight is the keyword normal", () => {
    const real = window.getComputedStyle;

    vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element) =>
      el instanceof HTMLTextAreaElement
        ? ({
            lineHeight: "normal",
            fontSize: "10px",
            paddingTop: "0px",
            paddingBottom: "0px",
            borderTopWidth: "0px",
            borderBottomWidth: "0px",
            boxSizing: "border-box"
          } as unknown as CSSStyleDeclaration)
        : real(el)
    );

    Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
      configurable: true,
      get: () => 1
    });

    render(<Textarea autoResize rows={2} placeholder="Notes" />);

    // 2 rows x (10 x 1.2) = 24
    expect(field().style.height).toBe("24px");
  });
});
