import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { useRef, useState } from "react";

import { useClickOutside } from "../../../hooks";
import { classNames } from "../../../utils/classNames";
import isTextIncludes from "../../../utils/isTextIncludes";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import type { TagInputProps } from "../TagInput.types";
import { labelOf, looseKey, optionsFrom, splitOnSeparators } from "../TagInput.utils";
import { TagInputContext } from "../useTagInput";

/**
 * A field that turns what you type into tags, with a list of the ones you already have to
 * hand.
 *
 * Options are declared as children, the way they are for `Select`, and filter as you type.
 * Anything that is not an option can still be typed in, which is what separates this from
 * a multi `Select`.
 *
 * @example
 * ```tsx
 * <TagInput value={tags} onChange={setTags} placeholder="Add a tag">
 *   <TagInputOption value="react">React</TagInputOption>
 *   <TagInputOption value="vue">Vue</TagInputOption>
 * </TagInput>
 * ```
 *
 * @example
 * Emails, where a tag has to look like one:
 *
 * ```tsx
 * <TagInput
 *   value={emails}
 *   onChange={setEmails}
 *   validate={(tag) => tag.includes("@")}
 *   onReject={(tags) => toast.error(`${tags.length} were not addresses`)}
 * />
 * ```
 */
const TagInput = ({
  value,
  onChange,
  onReject,
  validate,
  separators = ["Enter", ","],
  preferOption = true,
  max,
  allowDuplicates = false,
  addOnBlur = true,
  renderTag,
  placeholder,
  placeholderClassName,
  disabled = false,
  readOnly = false,
  prefix,
  suffix,
  className,
  wrapperClassName,
  menuClassName,
  menuPlacement = "bottom-start",
  floatingStrategy = "absolute",
  children,
  "aria-invalid": invalid
}: TagInputProps) => {
  const fieldRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [keyword, setKeyword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const floating = useFloating({
    placement: menuPlacement,
    strategy: floatingStrategy,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen
  });

  useClickOutside(() => setOpen(false), [menuRef, fieldRef]);

  const declared = optionsFrom(children);

  const isSelected = (tag: string) => value.includes(tag);

  /**
   * The option a typed tag was reaching for, matched loosely.
   *
   * Taking the option's own spelling keeps one tag where there would otherwise be two, and
   * saves the caller matching `vue` against `Vue` everywhere downstream.
   */
  const canonical = (tag: string): string => {
    if (!preferOption) return tag;

    const key = looseKey(tag);
    const option = declared.find(
      (current) => looseKey(current.props.value) === key || looseKey(labelOf(current.props)) === key
    );

    return option?.props.value ?? tag;
  };

  /*
   * Options already taken drop out of the list rather than sitting there greyed out. The
   * chip in the field is where they are now, and its own × is how they come back.
   */
  const matching = declared.filter(
    (option) => !isSelected(option.props.value) && isTextIncludes(labelOf(option.props), keyword)
  );

  /**
   * Adds what it can and reports what it could not, so a paste that drops half its
   * addresses says so rather than swallowing them.
   */
  const addTags = (incoming: string[]) => {
    const accepted: string[] = [];
    const rejected: string[] = [];
    let noRoom = false;

    incoming
      .map((tag) => canonical(tag.trim()))
      .filter(Boolean)
      .forEach((tag) => {
        const already = [...value, ...accepted];

        if (!allowDuplicates && already.includes(tag)) return rejected.push(tag);

        if (max !== undefined && already.length >= max) {
          noRoom = true;

          return rejected.push(tag);
        }

        if (validate && !validate(tag)) return rejected.push(tag);

        accepted.push(tag);
      });

    if (accepted.length) onChange([...value, ...accepted]);
    if (rejected.length) onReject?.(rejected);

    return { accepted, rejected, noRoom };
  };

  const removeAt = (index: number) => {
    if (disabled || readOnly) return;

    onChange(value.filter((_, at) => at !== index));
  };

  /**
   * Keeps the text when it was turned away, so a typo can be corrected rather than retyped.
   *
   * Not when the field is full, though: no amount of correcting makes room, so leaving it
   * there only strands it.
   */
  const commitKeyword = () => {
    if (!keyword.trim()) return;

    const { accepted, noRoom } = addTags([keyword]);

    if (accepted.length || noRoom) {
      setKeyword("");
      setFocused(null);
    }
  };

  const pickOption = (tag: string) => {
    addTags([tag]);
    setKeyword("");
    setFocused(null);
    inputRef.current?.focus();
  };

  const moveFocus = (by: number) => {
    if (!matching.length) return;

    const values = matching.map((option) => option.props.value);
    const from = focused ? values.indexOf(focused) : -1;
    const next = (((from + by) % values.length) + values.length) % values.length;

    setFocused(values[next]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      moveFocus(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Backspace" && !keyword && value.length) {
      event.preventDefault();
      removeAt(value.length - 1);
      return;
    }

    if (!separators.includes(event.key)) return;

    event.preventDefault();

    // The option under the keyboard wins, so Enter on a highlighted option adds that
    // rather than the half typed text that filtered down to it.
    if (focused && matching.some((option) => option.props.value === focused)) {
      pickOption(focused);
      return;
    }

    commitKeyword();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");
    const parts = splitOnSeparators(text, separators);

    if (parts.length < 2) return;

    // Only taken over when the paste actually holds more than one tag, so pasting a single
    // word still behaves like typing it.
    event.preventDefault();
    addTags(parts);
    setKeyword("");
  };

  const full = max !== undefined && value.length >= max;
  const state = disabled ? "disabled" : readOnly ? "readonly" : "enabled";

  return (
    <TagInputContext.Provider
      value={{
        focused,
        setFocused,
        pick: pickOption
      }}>
      <div className={classNames("GeckoUITagInputWrapper", wrapperClassName)}>
        <div
          ref={(node) => {
            fieldRef.current = node;
            floating.refs.setReference(node);
          }}
          className={classNames("GeckoUITagInput", className)}
          data-state={state}
          data-empty={(!value.length && !keyword) || undefined}
          data-full={full || undefined}
          onClick={() => !disabled && !readOnly && inputRef.current?.focus()}>
          {Boolean(prefix) && (
            <div className="GeckoUITagInput__prefix">
              <DynamicComponentRenderer component={prefix} />
            </div>
          )}

          <div className="GeckoUITagInput__tags">
            {/*
             * Drawn as text of its own rather than the input's `placeholder`. The field
             * is only as wide as what is typed, so a native placeholder would be clipped
             * to a couple of pixels.
             */}
            {!value.length && (
              <span
                className={classNames("GeckoUITagInput__placeholder", placeholderClassName)}
                data-hidden={keyword ? "" : undefined}>
                {placeholder}
              </span>
            )}

            {value.map((tag, index) =>
              renderTag ? (
                <span key={`${tag}-${index}`}>
                  {renderTag({ value: tag, index, remove: () => removeAt(index) })}
                </span>
              ) : (
                <span key={`${tag}-${index}`} className="GeckoUITagInput__tag">
                  {tag}

                  {!disabled && !readOnly && (
                    <button
                      type="button"
                      aria-label={`Remove ${tag}`}
                      className="GeckoUITagInput__tag__remove"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeAt(index);
                      }}>
                      <div className="GeckoUI-icon__clear" />
                    </button>
                  )}
                </span>
              )
            )}

            {/*
             * The wrapper's `::after` mirrors what is typed, so the field is only ever as
             * wide as its own text. A fixed minimum width would push the input onto a new
             * line while there was still room beside the last tag.
             */}
            <div className="GeckoUITagInput__field" data-keyword={keyword}>
              <input
                ref={inputRef}
                type="text"
                className="GeckoUITagInput__input"
                value={keyword}
                // Out of flow while the placeholder has the row, so the caret sits at the
                // start of the text rather than after it. Back in flow once there is a tag
                // to sit beside.
                data-initial={!value.length || undefined}
                disabled={disabled}
                readOnly={readOnly}
                aria-invalid={invalid}
                role="combobox"
                aria-expanded={open}
                aria-autocomplete="list"
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setFocused(null);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={(event) => {
                  if (!addOnBlur) return;
                  // Moving into the menu is not leaving the field. The options hold the
                  // focus themselves, so this only catches the cases where they cannot.
                  if (menuRef.current?.contains(event.relatedTarget)) return;

                  commitKeyword();
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />
            </div>
          </div>

          {Boolean(suffix) && (
            <div className="GeckoUITagInput__suffix">
              <DynamicComponentRenderer component={suffix} />
            </div>
          )}
        </div>

        {/*
         * No empty state: when nothing matches there is nothing to say, because whatever
         * was typed can simply be added. The menu stays away instead.
         */}
        {open && !disabled && !readOnly && !full && !!matching.length && (
          <div
            ref={(node) => {
              menuRef.current = node;
              floating.refs.setFloating(node);
            }}
            style={floating.floatingStyles}
            className={classNames("GeckoUITagInput__menu", menuClassName)}
            role="listbox">
            {matching}
          </div>
        )}
      </div>
    </TagInputContext.Provider>
  );
};

TagInput.displayName = "TagInput";

export default TagInput;
