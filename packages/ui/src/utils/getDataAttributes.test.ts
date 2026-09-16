import { describe, expect, it } from "vitest";

import { getDataAttributes } from "./getDataAttributes";

describe("getDataAttributes", () => {
  it("keeps only data- prefixed keys", () => {
    expect(
      getDataAttributes({ "data-id": "1", className: "x", "data-state": "open", onClick: () => {} })
    ).toEqual({ "data-id": "1", "data-state": "open" });
  });

  it("returns an empty object when there are no data attributes", () => {
    expect(getDataAttributes({ className: "x" })).toEqual({});
  });

  it("returns an empty object for empty props", () => {
    expect(getDataAttributes({})).toEqual({});
  });

  it("keeps the original values, including falsy ones", () => {
    expect(getDataAttributes({ "data-count": 0, "data-open": false })).toEqual({
      "data-count": 0,
      "data-open": false
    });
  });

  it("does not match keys that merely contain data-", () => {
    expect(getDataAttributes({ "aria-data-x": "1" })).toEqual({});
  });
});
