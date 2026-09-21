import type { KeyboardEvent, PointerEvent } from "react";
import { useId, useRef, useState } from "react";

import { classNames } from "../../utils/classNames";
import type { RatingProps } from "./Rating.types";
import { fillOf, ratingAt, stepsFor } from "./Rating.utils";

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  </svg>
);

/**
 * A rating, picked or shown.
 *
 * Built as a radio group, because a rating is a one of many choice: the arrow keys move
 * between the values, it is announced as a group, and it posts in a plain form.
 *
 * @example
 * ```tsx
 * <Rating value={rating} onChange={setRating} />
 * <Rating value={rating} onChange={setRating} precision={0.5} />
 * <Rating value={4.3} readOnly />
 * <Rating value={rating} onChange={setRating} icon={<HeartIcon />} color="error" />
 * ```
 */
const Rating = ({
  value,
  onChange,
  max = 5,
  precision = 1,
  clearable = true,
  readOnly = false,
  disabled = false,
  icon,
  emptyIcon,
  getLabel,
  name,
  color = "warning",
  size = "md",
  className,
  "aria-label": ariaLabel
}: RatingProps) => {
  const generated = useId();
  const iconsRef = useRef<(HTMLElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const interactive = !readOnly && !disabled;
  const group = name ?? `GeckoUIRating-${generated}`;
  const steps = stepsFor(max, precision);

  // What is drawn: whatever the pointer is over while it is over one, the value otherwise.
  const shown = hovered ?? value;

  const label = (at: number) => getLabel?.(at) ?? `${at} of ${max}`;

  const set = (next: number) => {
    if (!interactive) return;

    onChange?.(clearable && next === value ? 0 : next);
  };

  const handlePointer = (event: PointerEvent<HTMLElement>, index: number) => {
    if (!interactive) return;

    const box = iconsRef.current[index]?.getBoundingClientRect();

    if (box) setHovered(ratingAt(event.clientX, box, index, precision));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;

    const at = steps.indexOf(value);

    const next = {
      ArrowRight: steps[Math.min(at + 1, steps.length - 1)],
      ArrowUp: steps[Math.min(at + 1, steps.length - 1)],
      ArrowLeft: at <= 0 ? 0 : steps[at - 1],
      ArrowDown: at <= 0 ? 0 : steps[at - 1],
      Home: 0,
      End: steps[steps.length - 1]
    }[event.key];

    if (next === undefined) return;

    event.preventDefault();
    onChange?.(next);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      className={classNames("GeckoUIRating", className)}
      data-color={color}
      data-size={size}
      data-readonly={readOnly || undefined}
      data-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      onPointerLeave={() => setHovered(null)}>
      {Array.from({ length: max }, (_, index) => {
        const fill = fillOf(shown, index);

        return (
          <span
            key={index}
            ref={(node) => {
              iconsRef.current[index] = node;
            }}
            className="GeckoUIRating__icon"
            data-filled={fill === 1 || undefined}
            onPointerMove={(event) => handlePointer(event, index)}
            onClick={(event) => {
              const box = iconsRef.current[index]?.getBoundingClientRect();

              if (box) set(ratingAt(event.clientX, box, index, precision));
            }}>
            <span className="GeckoUIRating__icon__empty">{emptyIcon ?? icon ?? <StarIcon />}</span>

            {/*
             * The filled copy is clipped to however much of this one is earned, so a
             * fraction shows as a fraction rather than being rounded to a whole.
             */}
            <span
              className="GeckoUIRating__icon__fill"
              // Rounded, or a value like 4.3 leaves `width: 29.999999999999982%` in the DOM
              style={{ width: `${Number((fill * 100).toFixed(2))}%` }}
              aria-hidden="true">
              {icon ?? <StarIcon />}
            </span>
          </span>
        );
      })}

      {/*
       * The radios carry the semantics and the keyboard; the icons above are what is seen.
       * Kept out of sight rather than left out, so the group is a real one of many choice
       * and posts in a plain form.
       */}
      <span className="GeckoUIRating__inputs">
        {steps.map((step) => (
          <input
            key={step}
            type="radio"
            name={group}
            value={step}
            checked={value === step}
            disabled={disabled || readOnly}
            aria-label={label(step)}
            tabIndex={value === step || (!value && step === steps[0]) ? 0 : -1}
            onChange={() => set(step)}
          />
        ))}
      </span>
    </div>
  );
};

Rating.displayName = "Rating";

export default Rating;
