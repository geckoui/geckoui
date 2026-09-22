import { describe, expect, it } from "vitest";

import { isAsyncFn } from "./isAsyncFn";

describe("isAsyncFn", () => {
  it("detects an async function declaration", () => {
    async function work() {}
    expect(isAsyncFn(work)).toBe(true);
  });

  it("detects an async arrow function", () => {
    expect(isAsyncFn(async () => {})).toBe(true);
  });

  it("rejects a plain function that returns a promise", () => {
    // ConfirmDialog keys its loading state off this, so the distinction is load bearing:
    // a promise returning function that is not declared async gets no spinner
    expect(isAsyncFn(() => Promise.resolve())).toBe(false);
  });

  it("rejects a plain function", () => {
    expect(isAsyncFn(() => {})).toBe(false);
  });

  it("rejects non-functions", () => {
    expect(isAsyncFn(undefined)).toBe(false);
    expect(isAsyncFn(null)).toBe(false);
    expect(isAsyncFn("async")).toBe(false);
    expect(isAsyncFn({})).toBe(false);
  });

  it("does not invoke the function it is given", () => {
    let called = false;
    const spy = async () => {
      called = true;
    };

    isAsyncFn(spy);

    expect(called).toBe(false);
  });
});
