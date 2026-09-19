import type { Placement, Strategy } from "@floating-ui/react";
import type { FC, PropsWithChildren, ReactNode } from "react";

export interface TagInputTag {
  /** The tag itself, as it sits in `value`. */
  value: string;

  /** Where it is in `value`. */
  index: number;

  /** Takes it out. */
  remove: () => void;
}

export interface TagInputProps extends PropsWithChildren {
  /** The tags, in the order they were added. */
  value: string[];

  /** Called with the new list whenever one is added or taken out. */
  onChange: (value: string[]) => void;

  /**
   * Called with whatever was turned away, so a paste that drops half its addresses can say
   * so rather than swallowing them. A tag is turned away when it is a duplicate, when
   * `max` is reached, or when `validate` says no.
   * */
  onReject?: (tags: string[]) => void;

  /**
   * Whether a tag is allowed. A tag it turns down is not added, and stays in the field so
   * it can be corrected.
   * */
  validate?: (tag: string) => boolean;

  /**
   * Keys that finish a tag, alongside the text they split a paste on.(Default: ['Enter', ','])
   * */
  separators?: string[];

  /**
   * Take the spelling from the options when what was typed matches one but for its case or
   * spacing, so `vue` becomes `Vue` and `united  state` becomes `United State`. Anything
   * that matches no option is added exactly as typed.(Default: true)
   * */
  preferOption?: boolean;

  /** How many tags there may be. */
  max?: number;

  /** Let the same tag be added twice.(Default: false) */
  allowDuplicates?: boolean;

  /** Finish the tag being typed when the field loses focus.(Default: true) */
  addOnBlur?: boolean;

  /** Draw each tag yourself. */
  renderTag?: (tag: TagInputTag) => ReactNode;

  placeholder?: string;

  /** Extra class for the placeholder text. */
  placeholderClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hasError?: boolean;
  prefix?: FC | ReactNode;
  suffix?: FC | ReactNode;
  className?: string;
  wrapperClassName?: string;
  menuClassName?: string;

  /** Where the list of options opens.(Default: 'bottom-start') */
  menuPlacement?: Placement;

  floatingStrategy?: Strategy;
}

export interface TagInputOptionProps extends PropsWithChildren {
  /** What gets added when it is picked. */
  value: string;

  /**
   * What it is matched against while typing. Falls back to `value` when the children are
   * not plain text.
   * */
  label?: string;

  /** Cannot be picked. */
  disabled?: boolean;

  className?: string;
}
