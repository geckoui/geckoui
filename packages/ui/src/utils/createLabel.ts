import { type ReactElement } from "react";

import isNil from "./isNil";

/**
 * Work out the text to show for a value that is not in the options list.
 *
 * Null and undefined carry no text, so they come back as they are and the caller
 * renders nothing. Everywhere else, nil entries are skipped rather than printed:
 * `{ id: null, name: "Ann" }` reads as "Ann", not as a crash on the null id.
 */
function createLabel(item: unknown) {
  if (typeof item === "function") {
    throw new Error("You cannot pass a function as an dropdown item");
  }

  if (isNil(item)) return item;

  if (Array.isArray(item)) {
    const value = item.find((e) => !isNil(e)) ?? item[0];

    if (isNil(value)) return value;

    if (typeof value === "object") {
      return createLabel(value);
    }

    return String(value);
  }

  if (typeof item === "object") {
    if ("label" in item) {
      return item.label as ReactElement;
    }

    const values = Object.values(item as Record<string, unknown>);

    if (!values.length) return String(item);

    const value = values.find((e) => !isNil(e));

    // Every property was nil, so there is nothing to print
    if (isNil(value)) return null;

    if (typeof value === "object") {
      return createLabel(value);
    }

    return String(value);
  }

  return String(item);
}

export default createLabel;
