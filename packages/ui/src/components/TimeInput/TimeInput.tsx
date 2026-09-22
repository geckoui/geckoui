import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import type { ChangeEvent, FC, KeyboardEvent, RefObject } from "react";
import { Fragment, useEffect, useRef, useState } from "react";

import { useClickOutside } from "../../hooks";
import { classNames } from "../../utils/classNames";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { TimeInputProps } from "./TimeInput.types";
import {
  type TimeSegment,
  from24Hour,
  hasSeconds,
  isTwelveHour,
  optionsFor,
  pad,
  parseTime,
  partsToTime,
  segmentsFor,
  stepSegment,
  to24Hour,
  toValue
} from "./TimeInput.utils";

interface Parts {
  hour: string;
  minute: string;
  second: string;
  meridiem: "AM" | "PM" | "";
}

const EMPTY: Parts = { hour: "", minute: "", second: "", meridiem: "" };

const PLACEHOLDERS: Record<TimeSegment, string> = {
  hour: "HH",
  minute: "mm",
  second: "ss",
  meridiem: "AM"
};

/** `value` split into what each segment shows, which is 12 hour when the format is. */
const partsFrom = (value: string | null | undefined, twelve: boolean): Parts => {
  const parsed = parseTime(value);

  if (!parsed) return EMPTY;

  const { hour12, meridiem } = from24Hour(parsed.hour);

  return {
    hour: pad(twelve ? hour12 : parsed.hour),
    minute: pad(parsed.minute),
    second: pad(parsed.second),
    meridiem
  };
};

/**
 * A time field that reads like the platform's own, with a list of times behind it.
 *
 * `value` is always 24 hour `HH:mm`, or `HH:mm:ss` when the format asks for seconds, so it
 * sorts and compares without being parsed. `format` decides only what is on screen.
 *
 * @example
 * ```tsx
 * <TimeInput value={time} onChange={setTime} />
 * <TimeInput value={time} onChange={setTime} format="hh:mm A" />
 * <TimeInput value={time} onChange={setTime} step={30} min="09:00" max="17:00" />
 * ```
 */
const TimeInput: FC<TimeInputProps> = ({
  value = "",
  onChange,
  onSubmit,
  format = "HH:mm",
  disabledTime,
  step = 1,
  disabled = false,
  readOnly = false,
  prefix,
  suffix,
  placeholder,
  placeholderClassName,
  hideClearIcon = false,
  hideClockIcon = false,
  className,
  wrapperClassName,
  listClassName,
  listPlacement = "bottom-start",
  floatingStrategy = "absolute",
  "aria-invalid": invalid
}) => {
  const twelve = isTwelveHour(format);
  const withSeconds = hasSeconds(format);
  const segments = segmentsFor(format);

  const fieldRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLElement | null>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const meridiemRef = useRef<HTMLInputElement>(null);

  const refs: Record<TimeSegment, RefObject<HTMLInputElement | null>> = {
    hour: hourRef,
    minute: minuteRef,
    second: secondRef,
    meridiem: meridiemRef
  };

  /*
   * What is being typed, or `null` to follow `value`. Half a time sends `null` upwards
   * while it is incomplete, so reading the segments back from `value` on every keystroke
   * would wipe out what is being typed.
   */
  const [draft, setDraft] = useState<Parts | null>(null);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);

  const parts = draft ?? partsFrom(value, twelve);

  const floating = useFloating({
    placement: listPlacement,
    strategy: floatingStrategy,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen
  });

  /*
   * Closing drops the draft, so what is on screen goes back to `value`. Picking cells can
   * leave a combination the rule turns down, which sends `null` upwards; without this the
   * field would keep showing a time the caller was never given.
   */
  const close = () => {
    setOpen(false);
    setDraft(null);
  };

  useClickOutside(close, [listRef, fieldRef]);

  /*
   * Each column opens on what is already chosen, sitting at the top of its own scroller.
   * `scrollIntoView` would drag the page around to do the same thing, so the offset is set
   * directly instead.
   */
  useEffect(() => {
    if (!open) return;

    columnsRef.current?.querySelectorAll<HTMLElement>('[data-state="selected"]').forEach((cell) => {
      const column = cell.closest<HTMLElement>(".GeckoUITimeInput__column");

      if (column) column.scrollTop = cell.offsetTop - column.offsetTop;
    });
  }, [open]);

  const focusSegment = (segment: TimeSegment) => {
    refs[segment].current?.focus();
    refs[segment].current?.select();
  };

  const focusNext = (from: TimeSegment) => {
    const next = segments[segments.indexOf(from) + 1];

    if (next) focusSegment(next);
    else onSubmit?.();
  };

  const apply = (next: Parts) => {
    setDraft(next);

    const { hour: h, minute: m, second: s, meridiem: half } = next;
    const complete = h && m && (!withSeconds || s) && (!twelve || half);

    if (!complete) {
      onChange?.(null);
      return;
    }

    const hour24 = twelve ? to24Hour(parseInt(h, 10), half as "AM" | "PM") : parseInt(h, 10);
    const time = toValue(hour24, parseInt(m, 10), parseInt(s || "0", 10), withSeconds);

    // A time the rule turns down is not a value, the same as a half typed one
    onChange?.(disabledTime?.(partsToTime(next, twelve)) ? null : time);
  };

  const openList = (segment: TimeSegment = segments[0]) => {
    if (disabled || readOnly) return;

    focusSegment(segment);

    setOpen(true);
  };

  const handleNumeric = (
    segment: "hour" | "minute" | "second",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const ceiling = segment === "hour" ? (twelve ? 12 : 23) : 59;
    let digits = event.target.value.replace(/\D/g, "").slice(0, 2);

    if (!digits) {
      apply({ ...parts, [segment]: "" });
      return;
    }

    if (parseInt(digits, 10) > ceiling) digits = String(ceiling);

    // A first digit that cannot start a two digit number is the whole segment, so it is
    // padded and focus moves on rather than waiting for a second digit that cannot come.
    const decided =
      digits.length === 2 || parseInt(digits, 10) * 10 > ceiling
        ? pad(parseInt(digits, 10))
        : digits;

    apply({ ...parts, [segment]: decided });

    if (decided.length === 2) focusNext(segment);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, segment: TimeSegment) => {
    const index = segments.indexOf(segment);

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusSegment(segments[index - 1]);
      return;
    }

    if (event.key === "ArrowRight" && index < segments.length - 1) {
      event.preventDefault();
      focusSegment(segments[index + 1]);
      return;
    }

    // Up and down step the segment under the caret, the way the platform's own field does
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();

      const by = event.key === "ArrowUp" ? 1 : -1;

      if (segment === "meridiem") {
        apply({ ...parts, meridiem: parts.meridiem === "AM" ? "PM" : "AM" });
        return;
      }

      apply({ ...parts, [segment]: stepSegment(parts[segment], segment, by, twelve) });
      return;
    }

    if (segment === "meridiem") {
      const key = event.key.toLowerCase();

      if (key !== "a" && key !== "p") return;

      event.preventDefault();
      apply({ ...parts, meridiem: key === "a" ? "AM" : "PM" });
      focusNext("meridiem");
      return;
    }

    if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
      event.preventDefault();
      focusSegment(segments[index - 1]);
    }
  };

  const clear = () => {
    onChange?.(null);
    close();
  };

  const isEmpty = !parts.hour && !parts.minute && !parts.second && !parts.meridiem && !focused;
  const state = disabled ? "disabled" : readOnly ? "readonly" : "enabled";

  return (
    <div
      className={classNames("GeckoUITimeInputWrapper", wrapperClassName)}
      // Handled here rather than on the segments, so Escape also closes while the focus is
      // on a cell in the picker.
      onKeyDown={(event) => {
        if (!open || event.key !== "Escape") return;

        event.preventDefault();
        close();
      }}>
      <div
        ref={(node) => {
          fieldRef.current = node;
          floating.refs.setReference(node);
        }}
        className={classNames("GeckoUITimeInput", className)}
        data-state={state}
        aria-invalid={invalid}
        data-empty={isEmpty || undefined}
        data-focus={focused || open || undefined}
        // Anywhere in the field opens the list, the way clicking a DateInput opens its
        // calendar. The segments stop the event so a click lands on the one it was aimed at.
        onClick={() => openList()}>
        {Boolean(prefix) && (
          <div className="GeckoUITimeInput__prefix">
            <DynamicComponentRenderer component={prefix} />
          </div>
        )}

        {isEmpty && (
          <span className={classNames("GeckoUITimeInput__placeholder", placeholderClassName)}>
            {placeholder ?? format}
          </span>
        )}

        <div className="GeckoUITimeInput__segments">
          {segments.map((segment, index) => (
            <Fragment key={segment}>
              <label
                className="GeckoUITimeInput__segment"
                data-segment={segment}
                data-empty={!parts[segment] || undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  openList(segment);
                }}>
                <input
                  ref={refs[segment]}
                  type="text"
                  inputMode={segment === "meridiem" ? "text" : "numeric"}
                  className="GeckoUITimeInput__hidden-input"
                  value={parts[segment]}
                  readOnly={readOnly || segment === "meridiem"}
                  disabled={disabled}
                  maxLength={2}
                  aria-label={segment}
                  onFocus={() => setFocused(true)}
                  onBlur={(event) => {
                    // Moving between segments is not leaving the field, and the draft has
                    // to survive it.
                    if (fieldRef.current?.contains(event.relatedTarget)) return;

                    setFocused(false);
                    setDraft(null);
                  }}
                  onChange={(event) => segment !== "meridiem" && handleNumeric(segment, event)}
                  onKeyDown={(event) => handleKeyDown(event, segment)}
                />
                {parts[segment] || PLACEHOLDERS[segment]}
              </label>

              {/* AM and PM are spaced by the styles instead, since a text space collapses */}
              {index < segments.length - 1 && segments[index + 1] !== "meridiem" && (
                <span className="GeckoUITimeInput__separator">:</span>
              )}
            </Fragment>
          ))}
        </div>

        <div className="GeckoUITimeInput__icons">
          {!hideClearIcon && !isEmpty && !disabled && !readOnly && (
            <button
              type="button"
              aria-label="Clear"
              className="GeckoUITimeInput__clear-button"
              onClick={(event) => {
                event.stopPropagation();
                clear();
              }}>
              <div className="GeckoUI-icon__clear" />
            </button>
          )}

          {Boolean(suffix) && (
            <div className="GeckoUITimeInput__suffix">
              <DynamicComponentRenderer component={suffix} />
            </div>
          )}

          {!hideClockIcon && <ClockIcon />}
        </div>
      </div>

      {open && (
        <div
          ref={(node) => {
            listRef.current = node;
            floating.refs.setFloating(node);
          }}
          style={floating.floatingStyles}
          className={classNames("GeckoUITimeInput__picker", listClassName)}>
          <div ref={columnsRef} className="GeckoUITimeInput__columns">
            {segments.map((segment) => (
              <ul
                key={segment}
                className="GeckoUITimeInput__column"
                role="listbox"
                aria-label={segment}>
                {optionsFor(segment, parts, { twelve, step, order: segments, disabledTime }).map(
                  (option) => {
                    const selected = parts[segment] === option.value;

                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          disabled={option.disabled}
                          data-state={selected ? "selected" : "unselected"}
                          className="GeckoUITimeInput__cell"
                          // Kept open after a pick, the way the platform's own picker is:
                          // the other columns still have to be answered.
                          onClick={() => apply({ ...parts, [segment]: option.value })}>
                          {option.label}
                        </button>
                      </li>
                    );
                  }
                )}
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    className="GeckoUITimeInput__clock-icon">
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <path d="M12 7v5l3 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

TimeInput.displayName = "TimeInput";

export default TimeInput;
