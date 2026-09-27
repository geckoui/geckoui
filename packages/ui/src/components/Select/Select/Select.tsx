import { autoUpdate, flip, offset, size, useFloating } from "@floating-ui/react";
import type { RefObject } from "react";
import { Children, useMemo, useRef, useState } from "react";

import { useClickOutside } from "../../../hooks";
import { classNames } from "../../../utils/classNames";
import isEqual from "../../../utils/isEqual";
import isTextIncludes from "../../../utils/isTextIncludes";
import { findSelectOptions } from "../Select.utils";
import { SelectButton } from "../SelectButton";
import { SelectMenu } from "../SelectMenu";
import type { SelectOptionConfig } from "../SelectOption/SelectOption.types";
import { SelectContext } from "../useSelect";
import type { FocusedOption, SelectOverload, SelectProps } from "./Select.types";

/**
 * A customizable select dropdown component with support for single and multiple selections.
 *
 * Features include:
 * - Single or multiple selection modes
 * - Keyboard navigation and search
 * - Custom positioning with floating-ui
 * - Click-outside to close
 * - Customizable trigger and menu components
 *
 * @example
 * ```tsx
 * // Basic single select
 * <Select value={selectedValue} onChange={setSelectedValue}>
 *   <SelectOption value="option1" label="Option 1" />
 *   <SelectOption value="option2" label="Option 2" />
 * </Select>
 *
 * // Multiple select
 * <Select
 *   multiple
 *   value={selectedValues}
 *   onChange={setSelectedValues}
 * >
 *   <SelectOption value="opt1" label="Option 1" />
 *   <SelectOption value="opt2" label="Option 2" />
 *   <SelectOption value="opt3" label="Option 3" />
 * </Select>
 *
 * // With custom placement
 * <Select
 *   value={value}
 *   onChange={setValue}
 *   placement="top-start"
 * >
 *   <SelectOption value="a" label="Choice A" />
 *   <SelectOption value="b" label="Choice B" />
 * </Select>
 * ```
 */
const Select: SelectOverload = <T,>(props: SelectProps<T>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    disabled,
    inputRef: customInputRef,
    value,
    wrapperClassName,
    menuClassName,
    children,
    multiple,
    onChange,
    closeMenuOnSelect = !multiple,
    placement = "bottom-start",
    floatingStrategy,
    clearable = false,
    ...rest
  } = props;

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [focusedOption, setFocusedOption] = useState<FocusedOption<T> | null>(null);

  const floating = useFloating({
    placement,
    strategy: floatingStrategy,
    middleware: [
      flip({ padding: 6 }),
      offset({ mainAxis: 6 }),
      size({
        padding: 6,
        apply({ rects, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            width: "max-content",
            minWidth: `${rects.reference.width}px`,
            maxWidth: `${availableWidth}px`
          });
        }
      })
    ],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen
  });

  const { refs } = floating;

  const options = useMemo(
    () =>
      (Children.toArray(children)
        .map(findSelectOptions)
        .filter(Boolean)
        .flat() as SelectOptionConfig<T>[]) ?? [],
    [children]
  );

  const isEmpty = !options.find((e) => isTextIncludes(e.label, keyword));

  function setInputRef(ref: HTMLInputElement) {
    if (typeof customInputRef === "function") {
      customInputRef(ref);
    }

    inputRef.current = ref;
    return customInputRef;
  }

  function openMenu() {
    if (disabled || open) return;

    const option = options.filter((e) => isEqual(e.value, value))?.[0] ?? options[0];
    setFocusedOption({ ...option, focusType: "initial" });
    setOpen(true);
    setKeyword("");
  }

  function closeMenu() {
    setOpen(false);
    setKeyword("");
  }

  function toggleMenu() {
    setOpen((prev) => !prev);
  }

  const isSelected = (optionValue: T) => {
    if (!multiple) {
      return isEqual(optionValue, value);
    }

    return Array.isArray(value) && value.some((e) => isEqual(e, optionValue));
  };

  const handleChange = (optionValue: T) => {
    if (!onChange) return;

    if (!multiple) {
      onChange(optionValue);
      return;
    }

    const prevValue = Array.isArray(value) ? value : [];

    if (isSelected(optionValue)) {
      onChange(prevValue.filter((e) => !isEqual(e, optionValue)));
    } else {
      onChange([...prevValue, optionValue]);
    }
  };

  useClickOutside(
    () => {
      closeMenu();
    },
    [refs.reference as unknown as RefObject<HTMLElement>],
    open
  );

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        keyword,
        setKeyword,
        floating,
        openMenu,
        closeMenu,
        focusedOption,
        setFocusedOption,
        options,
        isSelected,
        handleChange,
        setInputRef,
        inputRef,
        value,
        disabled,
        multiple,
        closeMenuOnSelect,
        isEmpty,
        children,
        toggleMenu,
        menuScrollContainerRef,
        onChange,
        clearable,
        ...rest
      }}>
      <div
        className={classNames("GeckoUISelect", wrapperClassName)}
        ref={(r) => refs.setReference(r)}>
        <SelectButton {...props} />
        <SelectMenu className={menuClassName}>{children}</SelectMenu>
      </div>
    </SelectContext.Provider>
  );
};

Select.displayName = "Select";

export default Select;
