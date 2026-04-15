import { Children, useId, useMemo } from "react";

import { usePreventDefault } from "../../../hooks";
import { classNames } from "../../../utils/classNames";
import createLabel from "../../../utils/createLabel";
import isEqual from "../../../utils/isEqual";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import { isSelectTrigger } from "../Select.utils";
import { useSelectTrigger } from "../hooks/useSelectTrigger";
import { useSelect } from "../useSelect";
import type { SelectButtonProps } from "./SelectButton.types";
import { sortMultiSelectValue } from "./SelectButton.utils";

/**
 * Internal default `SelectButton` component used to render the trigger button
 * if `SelectTrigger` is not provided.
 * */
function SelectButton({ prefix, suffix, className }: SelectButtonProps) {
  const {
    disabled,
    inputRef,
    setInputRef,
    value,
    keyword,
    filterable: _filterable,
    openMenu,
    closeMenu,
    open,
    multiple,
    placeholder,
    placeholderClassName,
    children,
    handleChange,
    onChange,
    clearable
  } = useSelect();

  const id = useId();

  const { hasValue, handleInputChange, handleKeyboardInteraction } = useSelectTrigger();

  const trigger = useMemo(() => Children.toArray(children).find(isSelectTrigger), [children]);

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;

    if (multiple) {
      onChange?.([]);
      return;
    }

    handleChange(undefined);
  };

  if (trigger) {
    return trigger;
  }

  const filterable = _filterable === true || _filterable === "inline";

  return (
    <div
      className={classNames("GeckoUISelectButton", className)}
      data-state={disabled ? "disabled" : "enabled"}
      {...(!filterable && { "data-readonly": "" })}
      onClick={() => {
        if (open && !keyword) {
          closeMenu();
          return;
        }

        openMenu();
        inputRef?.current?.focus();
      }}
      aria-disabled={disabled}>
      <DynamicComponentRenderer component={prefix} />

      <div className="GeckoUISelectButton__content">
        {hasValue ? (
          <SelectButtonContent />
        ) : (
          <span
            className={classNames("GeckoUISelectButton__value", placeholderClassName)}
            data-placeholder=""
            {...(keyword && filterable && { "data-hidden": "" })}>
            {placeholder ?? "Select Item"}
          </span>
        )}

        <div
          className="GeckoUISelectButton__search"
          {...(((!open && hasValue) || !filterable) && { "data-focusonly": "" })}
          {...(multiple &&
            Array.isArray(value) &&
            !!value?.length && { "data-multi-selected": "" })}
          data-keyword={filterable ? keyword : ""}>
          <input
            id={id}
            ref={(r) => {
              setInputRef(r);
            }}
            value={filterable ? keyword : ""}
            disabled={disabled}
            className="GeckoUISelectButton__search__input"
            {...(((open && !hasValue) || (!multiple && hasValue)) && { "data-initial": "" })}
            {...(!filterable && { "data-readonly": "" })}
            onKeyDown={handleKeyboardInteraction}
            onFocusCapture={openMenu}
            onChange={
              filterable
                ? handleInputChange
                : // To prevent the react warning about uncontrolled input
                  () => null
            }
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="GeckoUISelectButton__icons">
        {hasValue && !disabled && clearable && (
          <button
            className="GeckoUISelectButton__clear-button"
            type="button"
            onClick={handleClear}
            data-disabled={disabled || undefined}>
            <div className="GeckoUI-icon__clear" />
          </button>
        )}

        <DynamicComponentRenderer
          component={
            suffix ?? (
              <span className="GeckoUI-icon__arrow-right GeckoUISelectTrigger__arrow-right-icon" />
            )
          }
        />
      </div>
    </div>
  );
}

function SelectButtonContent() {
  const {
    value,
    options,
    keyword,
    open,
    multiple,
    filterable: _filterable,
    handleChange,
    closeMenu,
    disabled
  } = useSelect();

  const filterable = _filterable === true || _filterable === "inline";

  const { preventDefault, attachPreventDefault } = usePreventDefault();

  if (multiple && Array.isArray(value) && !!value?.length) {
    const selectedOptions = sortMultiSelectValue(value, options).map((o) => {
      const { props, value, label } = o;
      const selectCurrentOption = () => handleChange(value);

      const remove = () => {
        // eslint-disable-next-line react/prop-types
        props?.onRemove?.({
          preventDefault,
          selectCurrentOption,
          value,
          focused: false,
          selected: true,
          closeMenu,
          filteredKeyword: keyword
        });

        attachPreventDefault(selectCurrentOption);
      };

      return { value, label, remove };
    });

    return selectedOptions.map((option) => {
      const { remove, value, label } = option;

      return (
        <div
          key={JSON.stringify({ value, label })}
          className="GeckoUISelectButton__multiselected-chip"
          data-disabled={disabled || undefined}>
          <span>{option.label}</span>

          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove();
              }}
              disabled={disabled}
              className="GeckoUISelectButton__multiselected-chip__clear-button"
              data-disabled={disabled || undefined}>
              <span className="GeckoUISelectButton__multiselected-chip__clear-button__icon" />
            </button>
          )}
        </div>
      );
    });
  }

  if (open && keyword && filterable) {
    return null;
  }

  const selectedOptionLabel =
    value !== undefined
      ? (options.find((option) => isEqual(option.value, value))?.label ?? createLabel(value))
      : null;

  // To display like ghost text when filterable is true
  if (open && selectedOptionLabel && filterable) {
    return (
      <span className="GeckoUISelectButton__value" data-placeholder="">
        {selectedOptionLabel}
      </span>
    );
  }

  return (
    <span className="GeckoUISelectButton__value" data-selected="">
      {selectedOptionLabel}
    </span>
  );
}

SelectButton.displayName = "SelectButton";

export default SelectButton;
