import { fireEvent, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mount = (tag = "div") => {
  const el = document.createElement(tag);
  document.body.append(el);
  return el;
};

afterEach(() => {
  document.body.innerHTML = "";
});

const { default: useClickOutside } = await import("./useClickOutside");

describe("useClickOutside", () => {
  it("calls back on a mousedown outside the ref", () => {
    const handler = vi.fn();
    const inside = mount();
    const outside = mount();
    const ref = createRef<HTMLDivElement>();
    (ref as { current: HTMLElement | null }).current = inside;

    renderHook(() => useClickOutside(handler, [ref]));
    fireEvent.mouseDown(outside);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("stays quiet for a click inside the ref", () => {
    const handler = vi.fn();
    const inside = mount();
    const ref = createRef<HTMLDivElement>();
    (ref as { current: HTMLElement | null }).current = inside;

    renderHook(() => useClickOutside(handler, [ref]));
    fireEvent.mouseDown(inside);

    expect(handler).not.toHaveBeenCalled();
  });

  it("stays quiet for a click on a descendant of the ref", () => {
    const handler = vi.fn();
    const inside = mount();
    const child = document.createElement("span");
    inside.append(child);
    const ref = createRef<HTMLDivElement>();
    (ref as { current: HTMLElement | null }).current = inside;

    renderHook(() => useClickOutside(handler, [ref]));
    fireEvent.mouseDown(child);

    expect(handler).not.toHaveBeenCalled();
  });

  it("treats a click inside any of the refs as inside", () => {
    const handler = vi.fn();
    const first = mount();
    const second = mount();
    const refs = [first, second].map((el) => {
      const ref = createRef<HTMLDivElement>();
      (ref as { current: HTMLElement | null }).current = el;
      return ref;
    });

    renderHook(() => useClickOutside(handler, refs));
    fireEvent.mouseDown(second);

    expect(handler).not.toHaveBeenCalled();
  });

  it("also reacts to touchstart", () => {
    const handler = vi.fn();
    const inside = mount();
    const outside = mount();
    const ref = createRef<HTMLDivElement>();
    (ref as { current: HTMLElement | null }).current = inside;

    renderHook(() => useClickOutside(handler, [ref]));
    fireEvent.touchStart(outside);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("stops listening after unmount", () => {
    const handler = vi.fn();
    const inside = mount();
    const outside = mount();
    const ref = createRef<HTMLDivElement>();
    (ref as { current: HTMLElement | null }).current = inside;

    const { unmount } = renderHook(() => useClickOutside(handler, [ref]));
    unmount();
    fireEvent.mouseDown(outside);

    expect(handler).not.toHaveBeenCalled();
  });

  it("does nothing without a handler", () => {
    const inside = mount();
    const outside = mount();
    const ref = createRef<HTMLDivElement>();
    (ref as { current: HTMLElement | null }).current = inside;

    expect(() => {
      renderHook(() => useClickOutside(undefined, [ref]));
      fireEvent.mouseDown(outside);
    }).not.toThrow();
  });

  it("does nothing for an empty ref list", () => {
    const handler = vi.fn();
    const outside = mount();

    renderHook(() => useClickOutside(handler, []));
    fireEvent.mouseDown(outside);

    expect(handler).not.toHaveBeenCalled();
  });

  it("uses the latest handler after a rerender", () => {
    const first = vi.fn();
    const second = vi.fn();
    const inside = mount();
    const outside = mount();
    const ref = createRef<HTMLDivElement>();
    (ref as { current: HTMLElement | null }).current = inside;

    const { rerender } = renderHook(({ cb }) => useClickOutside(cb, [ref]), {
      initialProps: { cb: first }
    });
    rerender({ cb: second });
    fireEvent.mouseDown(outside);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("treats a null ref as outside", () => {
    const handler = vi.fn();
    const outside = mount();
    const ref = createRef<HTMLDivElement>();

    renderHook(() => useClickOutside(handler, [ref]));
    fireEvent.mouseDown(outside);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
