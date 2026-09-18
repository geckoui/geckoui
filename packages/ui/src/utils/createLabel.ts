import { type ReactNode } from "react";

import isNil from "./isNil";

/**
 * Whether a label would render as nothing: nil, or a string of only whitespace.
 * The caller shows its placeholder instead of an empty box.
 */
export function isBlankLabel(value: unknown): boolean {
  if (isNil(value)) return true;

  return typeof value === "string" && value.trim() === "";
}

function labelFor(value: unknown): ReactNode {
  return typeof value === "object" ? createLabel(value) : String(value);
}

/**
 * The first entry that is not nil. Nil entries are skipped rather than printed, so
 * `{ id: null, name: "Ann" }` reads as "Ann" instead of stopping at the null id.
 * An empty string counts, because it is a value the caller chose to store.
 */
function firstNonNil(values: unknown[]): ReactNode {
  for (const value of values) {
    if (isNil(value)) continue;

    const label = labelFor(value);

    if (!isNil(label)) return label;
  }

  return null;
}

/**
 * Work out the text to show for a value that is not in the options list.
 *
 * Nil comes back as it is, and a value with nothing left to print comes back null,
 * so the caller can fall through to the placeholder.
 */
function createLabel(item: unknown): ReactNode {
  if (typeof item === "function") {
    throw new Error("You cannot pass a function as an dropdown item");
  }

  if (isNil(item)) return item;

  if (Array.isArray(item)) {
    return firstNonNil(item);
  }

  if (typeof item === "object") {
    if ("label" in item) {
      return item.label as ReactNode;
    }

    const values = Object.values(item as Record<string, unknown>);

    // No enumerable properties, so fall back to the object's own text. That is worth
    // something for a Date or anything with a custom toString, and worth nothing when
    // it is the default "[object Object]".
    if (!values.length) {
      const text = String(item);

      return text === "[object Object]" ? null : text;
    }

    return firstNonNil(values);
  }

  return String(item);
}

export default createLabel;
