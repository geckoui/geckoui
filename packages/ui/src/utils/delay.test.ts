import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import delay from "./delay";

describe("delay", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("stays pending before the time is up", async () => {
    const settled = vi.fn();
    delay(100).then(settled);

    await vi.advanceTimersByTimeAsync(99);

    expect(settled).not.toHaveBeenCalled();
  });

  it("resolves once the time has passed", async () => {
    const settled = vi.fn();
    delay(100).then(settled);

    await vi.advanceTimersByTimeAsync(100);

    expect(settled).toHaveBeenCalled();
  });

  it("resolves on the next tick for zero", async () => {
    const settled = vi.fn();
    delay(0).then(settled);

    await vi.advanceTimersByTimeAsync(0);

    expect(settled).toHaveBeenCalled();
  });
});
