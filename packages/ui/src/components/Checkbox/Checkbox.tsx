import { forwardRef, useCallback, useEffect, useId, useRef } from "react";

import { CheckIcon, IndeterminateIcon } from "../../icons";
import { classNames } from "../../utils/classNames";
import type { CheckboxProps } from "./Checkbox.types";

/**
 * A customizable checkbox component with support for the indeterminate state.
 *
 * `indeterminate` mirrors the native DOM property: it is purely visual and independent
 * of `checked`, so a "select all" box with only some rows selected stays unchecked while
 * showing the dash. Clicking it still reports `checked` as usual.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [checked, setChecked] = useState(false);
 * <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
 *
 * // Select all: unchecked while only some rows are selected
 * <Checkbox
 *   checked={allSelected}
 *   indeterminate={someSelected && !allSelected}
 *   onChange={handleSelectAll}
 * />
 *
 * // With label
 * <label className="flex items-center gap-2">
 *   <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
 *   <span>I agree to the terms</span>
 * </label>
 * ```
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, disabled, className, checked, indeterminate, ...rest }, ref) => {
    const _id = useId();
    const innerRef = useRef<HTMLInputElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;

        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    // `indeterminate` is a DOM property with no matching attribute, so React cannot set
    // it from JSX. Writing it here is what makes `:indeterminate` match and what lets
    // assistive tech report the mixed state.
    //
    // Synced on every render on purpose: the browser clears the property itself when the
    // box is clicked, so a controlled checkbox that keeps `indeterminate` would silently
    // lose the dash if this only ran when the prop changed.
    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = Boolean(indeterminate);
    });

    const Icon = indeterminate ? IndeterminateIcon : CheckIcon;

    return (
      <div className="GeckoUICheckbox group">
        <input
          checked={checked}
          className={classNames("GeckoUICheckbox__input", className)}
          disabled={disabled}
          id={id ?? _id}
          ref={setRefs}
          {...rest}
          type="checkbox"
        />
        <Icon className="GeckoUICheckbox__icon" />
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
