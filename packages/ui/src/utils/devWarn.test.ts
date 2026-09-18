import { afterEach, describe, expect, it, vi } from "vitest";

// The test runs in node; declared locally to avoid pulling in @types/node
declare const process: { env: Record<string, string | undefined> };

const ORIGINAL_ENV = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = ORIGINAL_ENV;
  vi.resetModules();
  vi.restoreAllMocks();
});

const load = async () => (await import("./devWarn")).devWarn;

describe("devWarn", () => {
  it("warns outside production", async () => {
    process.env.NODE_ENV = "development";
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    (await load())("something is off");

    expect(spy).toHaveBeenCalledWith("[GeckoUI] something is off");
  });

  it("stays quiet in production", async () => {
    process.env.NODE_ENV = "production";
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    (await load())("something is off");

    expect(spy).not.toHaveBeenCalled();
  });

  it("still warns where there is no process at all", async () => {
    const globals = globalThis as Record<string, unknown>;
    const saved = globals.process;
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      vi.resetModules();
      // simulating a browser, where there is no process global at all
      delete globals.process;

      const devWarn = (await import("./devWarn")).devWarn;
      devWarn("something is off");

      expect(spy).toHaveBeenCalledWith("[GeckoUI] something is off");
    } finally {
      globals.process = saved;
    }
  });
});
