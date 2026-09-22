import { fireEvent, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import useEscListener from "./useEscListener";

afterEach(() => {
  document.body.innerHTML = "";
});

const pressEsc = (target: Element | Document = document) =>
  fireEvent.keyDown(target, { key: "Escape" });

describe("useEscListener", () => {
  it("calls back on Escape", () => {
    const callback = vi.fn();
    renderHook(() => useEscListener(callback));

    pressEsc();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys", () => {
    const callback = vi.fn();
    renderHook(() => useEscListener(callback));

    fireEvent.keyDown(document, { key: "Enter" });

    expect(callback).not.toHaveBeenCalled();
  });

  it("ignores Escape from an input", () => {
    const callback = vi.fn();
    renderHook(() => useEscListener(callback));
    const input = document.createElement("input");
    document.body.append(input);

    pressEsc(input);

    expect(callback).not.toHaveBeenCalled();
  });

  it("ignores Escape from a textarea", () => {
    const callback = vi.fn();
    renderHook(() => useEscListener(callback));
    const textarea = document.createElement("textarea");
    document.body.append(textarea);

    pressEsc(textarea);

    expect(callback).not.toHaveBeenCalled();
  });

  it("ignores Escape from a contenteditable element", () => {
    const callback = vi.fn();
    renderHook(() => useEscListener(callback));
    const div = document.createElement("div");
    div.contentEditable = "true";
    Object.defineProperty(div, "isContentEditable", { value: true });
    document.body.append(div);

    pressEsc(div);

    expect(callback).not.toHaveBeenCalled();
  });

  it("stops listening after unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useEscListener(callback));

    unmount();
    pressEsc();

    expect(callback).not.toHaveBeenCalled();
  });

  it("does nothing without a callback", () => {
    expect(() => {
      renderHook(() => useEscListener(undefined));
      pressEsc();
    }).not.toThrow();
  });

  it("uses the latest callback after a rerender", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useEscListener(cb), {
      initialProps: { cb: first }
    });

    rerender({ cb: second });
    pressEsc();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
