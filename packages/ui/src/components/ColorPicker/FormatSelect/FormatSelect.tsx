import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { useClickOutside } from "../../../hooks";
import type { ColorFormat } from "../ColorPicker.types";

export interface FormatSelectProps {
  value: ColorFormat;
  options: ColorFormat[];
  labels: Record<ColorFormat, string>;
  disabled: boolean;
  onChange: (format: ColorFormat) => void;
}

/**
 * The format dropdown beside the value field.
 *
 * Its own small listbox rather than a floating one: the picker is often inside a popover
 * already, and this way the list is part of that popover's own subtree, so it is not
 * clipped and does not read as a click outside it.
 */
const FormatSelect = ({ value, options, labels, disabled, onChange }: FormatSelectProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(options.indexOf(value), 0));

  useClickOutside(() => setOpen(false), [rootRef]);

  useEffect(() => {
    if (!open) return;

    setActive(Math.max(options.indexOf(value), 0));
    listRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pick = (format: ColorFormat) => {
    onChange(format);
    setOpen(false);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    setOpen(true);
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const moves: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };
    const by = moves[event.key];

    if (by !== undefined) {
      event.preventDefault();
      setActive((at) => (at + by + options.length) % options.length);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActive(event.key === "Home" ? 0 : options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(options[active]);
      return;
    }

    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div
      className="GeckoUIColorPicker__format"
      ref={(node) => {
        rootRef.current = node;
      }}>
      <button
        type="button"
        className="GeckoUIColorPicker__format__trigger"
        aria-label="Colour format"
        aria-haspopup="listbox"
        aria-expanded={open}
        data-open={open || undefined}
        disabled={disabled}
        onClick={() => setOpen((was) => !was)}
        onKeyDown={handleTriggerKeyDown}>
        {labels[value]}
        <span className="GeckoUIColorPicker__format__caret" aria-hidden="true" />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-label="Colour format"
          aria-activedescendant={`gecko-color-format-${options[active]}`}
          className="GeckoUIColorPicker__format__list"
          onKeyDown={handleListKeyDown}>
          {options.map((option, index) => (
            <li
              key={option}
              id={`gecko-color-format-${option}`}
              role="option"
              aria-selected={option === value}
              data-active={index === active || undefined}
              className="GeckoUIColorPicker__format__option"
              onMouseEnter={() => setActive(index)}
              // Before blur, so the list is not closed out from under the click
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(option)}>
              {labels[option]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

FormatSelect.displayName = "FormatSelect";

export default FormatSelect;
