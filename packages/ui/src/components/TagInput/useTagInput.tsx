import { createContext, useContext } from "react";

export interface TagInputContextValue {
  /** The option the keyboard is on, by its value. */
  focused: string | null;

  setFocused: (value: string | null) => void;

  /** Adds the option as a tag and puts the focus back in the field. */
  pick: (tag: string) => void;
}

export const TagInputContext = createContext<TagInputContextValue | null>(null);

export const useTagInput = (): TagInputContextValue => {
  const context = useContext(TagInputContext);

  if (!context) {
    throw new Error("TagInput components have to be used inside a <TagInput>.");
  }

  return context;
};
