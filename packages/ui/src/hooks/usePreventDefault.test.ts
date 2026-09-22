import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import usePreventDefault from "./usePreventDefault";

describe("usePreventDefault", () => {
  it("runs the attached function by default", async () => {
    const { result } = renderHook(() => usePreventDefault());
    const fn = vi.fn();

    await result.current.attachPreventDefault(fn);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("skips the attached function after preventDefault", async () => {
    const { result } = renderHook(() => usePreventDefault());
    const fn = vi.fn();

    result.current.preventDefault();
    await result.current.attachPreventDefault(fn);

    expect(fn).not.toHaveBeenCalled();
  });

  it("only skips once", async () => {
    const { result } = renderHook(() => usePreventDefault());
    const fn = vi.fn();

    result.current.preventDefault();
    await result.current.attachPreventDefault(fn);
    await result.current.attachPreventDefault(fn);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("awaits an async attached function", async () => {
    const { result } = renderHook(() => usePreventDefault());
    const order: string[] = [];

    await result.current.attachPreventDefault(async () => {
      await Promise.resolve();
      order.push("fn");
    });
    order.push("after");

    expect(order).toEqual(["fn", "after"]);
  });

  it("keeps the flag across rerenders until it is used", async () => {
    const { result, rerender } = renderHook(() => usePreventDefault());
    const fn = vi.fn();

    result.current.preventDefault();
    rerender();
    await result.current.attachPreventDefault(fn);

    expect(fn).not.toHaveBeenCalled();
  });
});
