import { MouseEvent, useEffect, useRef } from "react";

import { usePreventDefault } from "../../../hooks";
import { classNames } from "../../../utils/classNames";
import isEqual from "../../../utils/isEqual";
import isNil from "../../../utils/isNil";
import { isHideSelectOption } from "../Select.utils";
import { useSelect } from "../useSelect";
import type { CustomSelectOptionArgs, SelectOptionProps } from "./SelectOption.types";

/**
 * An individual selectable option within a Select dropdown component.
 *
 * Features:
 * - Automatic keyboard and mouse focus management
 * - Custom content rendering via render props
 * - Visibility control (default, always, empty, filtered-and-empty)
 * - Custom click handlers with access to selection state
 * - preventDefault support for complete custom click behavior control
 * - Auto-scrolling when focused via keyboard
 * - Support for both single and multiple selection modes
 * - Optional check icon display
 * - Disabled state support
 *
 * @example
 * ```tsx
 * // Basic option
 * <Select value={value} onChange={setValue}>
 *   <SelectOption value="react" label="React" />
 *   <SelectOption value="vue" label="Vue" />
 *   <SelectOption value="angular" label="Angular" />
 * </Select>
 *
 * // Custom content with render function
 * <Select value={value} onChange={setValue}>
 *   <SelectOption value="user1" label="John Doe">
 *     {({ selected, focused }) => (
 *       <div className={focused ? 'font-bold' : ''}>
 *         <Avatar src="/john.jpg" />
 *         <span>John Doe</span>
 *         {selected && <CheckIcon />}
 *       </div>
 *     )}
 *   </SelectOption>
 * </Select>
 *
 * // Hide check icon
 * <Select value={value} onChange={setValue}>
 *   <SelectOption value="opt1" label="Option 1" hideCheckIcon />
 *   <SelectOption value="opt2" label="Option 2" hideCheckIcon />
 * </Select>
 *
 * // Custom onClick handler (default behavior still runs)
 * <Select value={value} onChange={setValue}>
 *   <SelectOption
 *     value="custom"
 *     label="Custom Action"
 *     onClick={({ selectCurrentOption, closeMenu }) => {
 *       console.log('Custom action triggered');
 *       selectCurrentOption(); // Manually trigger selection
 *       closeMenu();
 *     }}
 *   />
 * </Select>
 *
 * // Using preventDefault to completely override default behavior
 * <Select value={value} onChange={setValue}>
 *   <SelectOption
 *     value="confirm"
 *     label="Delete Item"
 *     onClick={({ preventDefault, value, closeMenu }) => {
 *       preventDefault(); // Prevents default selection behavior
 *
 *       // Implement completely custom logic
 *       if (window.confirm('Are you sure you want to delete?')) {
 *         handleDelete(value);
 *         closeMenu();
 *       }
 *       // Note: Item is NOT selected unless you manually call selectCurrentOption
 *     }}
 *   />
 * </Select>
 *
 * // preventDefault with conditional selection
 * <Select value={value} onChange={setValue}>
 *   <SelectOption
 *     value="premium"
 *     label="Premium Feature"
 *     onClick={({ preventDefault, selectCurrentOption, value }) => {
 *       preventDefault();
 *
 *       if (userHasPremium) {
 *         selectCurrentOption(); // Allow selection for premium users
 *       } else {
 *         openUpgradeModal(); // Show upgrade prompt for free users
 *       }
 *     }}
 *   />
 * </Select>
 *
 * // preventDefault for custom async operations
 * <Select value={value} onChange={setValue}>
 *   <SelectOption
 *     value="createNew"
 *     label="+ Create New Category"
 *     onClick={async ({ preventDefault, selectCurrentOption, closeMenu }) => {
 *       preventDefault();
 *
 *       const newCategory = await openCreateDialog();
 *       if (newCategory) {
 *         await saveCategory(newCategory);
 *         selectCurrentOption(); // Select after async operation
 *         closeMenu();
 *       }
 *     }}
 *   />
 * </Select>
 *
 * // Visibility variants
 * <Select value={value} onChange={setValue}>
 *   <SelectDropdownSearch />
 *   <SelectOption value="opt1" label="Normal Option" visibility="default" />
 *   <SelectOption value="add" label="+ Add New" visibility="always" />
 *   <SelectOption value="create" label="Create New Item" visibility="empty" />
 * </Select>
 *
 * // Disabled option
 * <Select value={value} onChange={setValue}>
 *   <SelectOption value="enabled" label="Enabled Option" />
 *   <SelectOption value="disabled" label="Disabled Option" disabled />
 * </Select>
 *
 * // Custom className based on state
 * <Select value={value} onChange={setValue}>
 *   <SelectOption
 *     value="premium"
 *     label="Premium Option"
 *     className={({ selected, focused }) =>
 *       `${selected ? 'bg-blue-500' : ''} ${focused ? 'ring-2' : ''}`
 *     }
 *   />
 * </Select>
 *
 * // Multiple select with onRemove
 * <Select multiple value={values} onChange={setValues}>
 *   <SelectOption
 *     value="tag1"
 *     label="Tag 1"
 *     onRemove={({ value }) => console.log('Removing', value)}
 *   />
 * </Select>
 * ```
 */
const SelectOption = <T,>({ children, ...props }: SelectOptionProps<T>) => {
  const {
    value,
    label,
    hideCheckIcon,
    className,
    onClick,
    visibility = "default",
    onRemove,
    disabled,
    ...rest
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { preventDefault, attachPreventDefault } = usePreventDefault();

  const {
    closeMenuOnSelect,
    multiple,
    focusedOption,
    setFocusedOption,
    keyword: filteredKeyword,
    setKeyword,
    handleChange,
    closeMenu,
    isSelected,
    inputRef,
    isEmpty,
    menuScrollContainerRef
  } = useSelect<T>();

  const selected = isSelected(value);

  const focused = !isNil(focusedOption) && isEqual(focusedOption?.value, value);

  useEffect(() => {
    if (!ref.current || !menuScrollContainerRef.current) return;

    if (focusedOption?.focusType !== "mouse" && focused) {
      const scrollContainer = menuScrollContainerRef.current;
      const optionRect = ref.current.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      const isAbove = optionRect.top < containerRect.top;
      const isBelow = optionRect.bottom > containerRect.bottom;

      if (isAbove || isBelow) {
        const optionTop = ref.current.offsetTop;
        const containerHeight = scrollContainer.clientHeight;
        const optionHeight = ref.current.clientHeight;

        scrollContainer.scrollTo({
          top: optionTop - containerHeight / 2 + optionHeight / 2,
          behavior: "smooth"
        });
      }
    }
  }, [focusedOption?.focusType, focused, menuScrollContainerRef]);

  if (isHideSelectOption({ keyword: filteredKeyword, label, visibility, isEmpty })) {
    return null;
  }

  const selectCurrentOption = () => {
    handleChange(value);

    if (closeMenuOnSelect) {
      closeMenu();
      return;
    }

    if (!multiple) return;

    const tempOption = { value, label };
    const tempKeyword = filteredKeyword;

    if (inputRef.current) {
      inputRef.current?.focus();
    }

    setFocusedOption({ ...tempOption, focusType: "mouse", props });
    setKeyword(tempKeyword);
  };

  const customSelectArgs: CustomSelectOptionArgs<T> = {
    preventDefault,
    value,
    selected,
    focused,
    selectCurrentOption,
    closeMenu,
    filteredKeyword
  };

  const handleOnClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (selected && multiple) {
      onRemove?.(customSelectArgs);
    } else {
      onClick?.(customSelectArgs);
    }

    attachPreventDefault(selectCurrentOption);
  };

  const Content = () => {
    if (!children) {
      return label;
    }

    if (typeof children === "function") {
      return children(customSelectArgs);
    }

    return children;
  };

  return (
    <div
      tabIndex={-1}
      ref={ref}
      className={classNames(
        "GeckoUISelectOption",
        typeof className === "function" ? className({ value, selected, focused }) : className
      )}
      data-state={selected ? "selected" : "unselected"}
      data-focused={focused || undefined}
      data-disabled={disabled || undefined}
      {...rest}
      onMouseMove={() => {
        if (focusedOption?.value !== value) {
          setFocusedOption({ value, label, focusType: "mouse", props });
        }
      }}
      onClick={disabled ? undefined : handleOnClick}>
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Content />
      {!!selected && !hideCheckIcon && (
        <div className="GeckoUI-icon__check GeckoUISelectOption__check-icon" />
      )}
    </div>
  );
};

SelectOption.displayName = "SelectOption";

export default SelectOption;
