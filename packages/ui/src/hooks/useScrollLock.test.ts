import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import useScrollLock from "./useScrollLock";

const scrollbarWidth = 15;

beforeEach(() => {
  document.body.style.cssText = "";
  document.documentElement.style.cssText = "";
  Object.defineProperty(window, "innerWidth", { value: 1000, configurable: true });
  Object.defineProperty(document.documentElement, "clientWidth", {
    value: 1000 - scrollbarWidth,
    configurable: true
  });
});

afterEach(() => {
  document.body.style.cssText = "";
  document.documentElement.style.cssText = "";
});

describe("useScrollLock", () => {
  it("does nothing while disabled", () => {
    renderHook(() => useScrollLock(false));

    expect(document.body.style.overflow).toBe("");
  });

  it("hides body overflow while enabled", () => {
    renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("pays the scrollbar width back as padding", () => {
    renderHook(() => useScrollLock(true));

    expect(document.body.style.paddingRight).toBe(`${scrollbarWidth}px`);
  });

  it("adds to any padding the body already had", () => {
    document.body.style.paddingRight = "10px";

    renderHook(() => useScrollLock(true));

    expect(document.body.style.paddingRight).toBe(`${10 + scrollbarWidth}px`);
  });

  it("exposes the scrollbar width as a custom property", () => {
    renderHook(() => useScrollLock(true));

    expect(document.documentElement.style.getPropertyValue("--gecko-scrollbar-width")).toBe(
      `${scrollbarWidth}px`
    );
  });

  it("restores the original styles on unmount", () => {
    document.body.style.paddingRight = "10px";
    const { unmount } = renderHook(() => useScrollLock(true));

    unmount();

    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.paddingRight).toBe("10px");
    expect(document.documentElement.style.getPropertyValue("--gecko-scrollbar-width")).toBe("");
  });

  it("restores the styles when it is turned off", () => {
    const { rerender } = renderHook(({ on }) => useScrollLock(on), {
      initialProps: { on: true }
    });

    rerender({ on: false });

    expect(document.body.style.overflow).toBe("");
  });

  it("keeps the lock while a second overlay still holds it", () => {
    const first = renderHook(() => useScrollLock(true));
    const second = renderHook(() => useScrollLock(true));

    first.unmount();
    expect(document.body.style.overflow).toBe("hidden");

    second.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("does not double the padding for stacked locks", () => {
    renderHook(() => useScrollLock(true));
    renderHook(() => useScrollLock(true));

    expect(document.body.style.paddingRight).toBe(`${scrollbarWidth}px`);
  });

  it("adds no padding when there is no scrollbar", () => {
    Object.defineProperty(document.documentElement, "clientWidth", {
      value: 1000,
      configurable: true
    });

    renderHook(() => useScrollLock(true));

    expect(document.body.style.paddingRight).toBe("");
    expect(document.documentElement.style.getPropertyValue("--gecko-scrollbar-width")).toBe("");
  });

  it("locks again after being fully released", () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    unmount();

    renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("can be toggled on after mounting disabled", () => {
    const { rerender } = renderHook(({ on }) => useScrollLock(on), {
      initialProps: { on: false }
    });

    act(() => rerender({ on: true }));

    expect(document.body.style.overflow).toBe("hidden");
  });
});
