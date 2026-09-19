import { classNames } from "../../../utils/classNames";
import type { TagInputOptionProps } from "../TagInput.types";
import { useTagInput } from "../useTagInput";

/**
 * One suggestion in a `TagInput`.
 *
 * Declared as a child of `TagInput`, the way `SelectOption` is for `Select`. An option
 * already added drops out of the list, because the chip in the field is where it is now.
 *
 * @example
 * ```tsx
 * <TagInputOption value="react">React</TagInputOption>
 * ```
 */
const TagInputOption = ({ value, disabled = false, className, children }: TagInputOptionProps) => {
  const { focused, setFocused, pick } = useTagInput();

  return (
    <button
      type="button"
      role="option"
      aria-selected={false}
      disabled={disabled}
      data-focused={focused === value || undefined}
      className={classNames("GeckoUITagInput__option", className)}
      onMouseEnter={() => setFocused(value)}
      // Keeps the focus in the field: without this the pointer going down here blurs the
      // input first, and `addOnBlur` commits the half typed word as a tag of its own
      // before the click adds this option.
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => pick(value)}>
      {children ?? value}
    </button>
  );
};

TagInputOption.displayName = "TagInputOption";

export default TagInputOption;
