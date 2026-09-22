import { Children, type ReactElement, type ReactNode, isValidElement } from "react";

import type { TagInputOptionProps } from "./TagInput.types";

/** The text a `TagInputOption` is matched against while typing. */
export const labelOf = (props: TagInputOptionProps): string => {
  if (props.label) return props.label;

  return typeof props.children === "string" ? props.children : props.value;
};

/**
 * The options declared as children, in order.
 *
 * Read by display name rather than by identity, so an option still counts when the bundler
 * has handed back a different copy of the module.
 */
export const optionsFrom = (children: ReactNode): ReactElement<TagInputOptionProps>[] =>
  Children.toArray(children).filter(
    (child): child is ReactElement<TagInputOptionProps> =>
      isValidElement(child) &&
      (child.type as { displayName?: string })?.displayName === "TagInputOption"
  );

/**
 * What two tags are compared by when looking for the one already on the list.
 *
 * Case and stray spacing are what people get wrong when typing a name they can see, so
 * `united  state` and `United State` are the same thing here. Nothing else is folded: a
 * different word is a different tag.
 */
export const looseKey = (text: string): string => text.trim().replace(/\s+/g, " ").toLowerCase();

/** Splits a pasted string on every separator, so one paste can make many tags. */
export const splitOnSeparators = (text: string, separators: string[]): string[] => {
  const marks = separators.filter((separator) => separator.length === 1);
  const pattern = new RegExp(`[${marks.map((m) => `\\${m}`).join("")}\\n\\r]+`);

  return (marks.length ? text.split(pattern) : text.split(/[\n\r]+/))
    .map((part) => part.trim())
    .filter(Boolean);
};
