import { classNames } from "../../../utils/classNames";
import isEqual from "../../../utils/isEqual";
import isTextIncludes from "../../../utils/isTextIncludes";
import { Input, type InputProps } from "../../Input";
import { isHideSelectOption } from "../Select.utils";
import { useSelect } from "../useSelect";

/**
 * A search input component for filtering Select options with full keyboard navigation support.
 *
 * Features:
 * - Real-time filtering of select options as you type
 * - Keyboard navigation with Arrow Up/Down keys
 * - Enter key to select focused option
 * - Tab key support for navigation
 * - Auto-focuses first matching option during search
 * - Works seamlessly with single and multiple select modes
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Select value={value} onChange={setValue}>
 *   <SelectDropdownSearch />
 *   <SelectOption value="apple" label="Apple" />
 *   <SelectOption value="banana" label="Banana" />
 *   <SelectOption value="cherry" label="Cherry" />
 *   <SelectEmpty>No fruits found</SelectEmpty>
 * </Select>
 *
 * // Custom placeholder
 * <Select value={value} onChange={setValue}>
 *   <SelectDropdownSearch placeholder="Search countries..." />
 *   <SelectOption value="us" label="United States" />
 *   <SelectOption value="uk" label="United Kingdom" />
 *   <SelectOption value="ca" label="Canada" />
 * </Select>
 *
 * // With custom styling
 * <Select value={value} onChange={setValue}>
 *   <SelectDropdownSearch
 *     placeholder="Find your option"
 *     className="border-2 border-blue-500"
 *   />
 *   <SelectOption value="opt1" label="Option 1" />
 *   <SelectOption value="opt2" label="Option 2" />
 * </Select>
 *
 * // Multiple select with search
 * <Select multiple value={values} onChange={setValues}>
 *   <SelectDropdownSearch placeholder="Search tags..." />
 *   <SelectOption value="react" label="React" />
 *   <SelectOption value="vue" label="Vue" />
 *   <SelectOption value="angular" label="Angular" />
 * </Select>
 * ```
 */
const SelectDropdownSearch = ({
  placeholder = "Search options...",
  className,
  ...rest
}: Omit<InputProps, "value" | "onChange" | "onKeyDown">) => {
  const {
    keyword,
    setKeyword,
    options,
    isEmpty,
    focusedOption,
    setFocusedOption,
    open,
    handleChange,
    closeMenu,
    multiple,
    openMenu
  } = useSelect();

  const filteredOptions = options.filter(
    ({ label, visibility }) => !isHideSelectOption({ keyword, label, visibility, isEmpty })
  );

  const handleKeyboardInteraction = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Tab") {
      e.preventDefault();
      let currentIndex = filteredOptions.findIndex((e) => isEqual(e.value, focusedOption?.value));

      currentIndex = currentIndex === -1 ? 0 : currentIndex;

      let nextIndex = e.key === "ArrowUp" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0) {
        nextIndex = filteredOptions.length - 1;
      } else if (nextIndex >= filteredOptions.length) {
        nextIndex = 0;
      }

      const option = filteredOptions[nextIndex];
      setFocusedOption({ ...option, focusType: "keyboard" });

      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (open) {
        if (focusedOption && !isEmpty) {
          handleChange(focusedOption.value);
        }

        if (!multiple) {
          closeMenu();
          e.currentTarget.blur();
        }
      } else {
        openMenu();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(() => e.target.value);

    let focusedValue = options.find(({ label }) => isTextIncludes(label, e.target.value));

    if (!focusedValue && filteredOptions.length) {
      focusedValue = filteredOptions[0];
    }

    if (focusedValue) {
      setFocusedOption({ ...focusedValue, focusType: "keyboard" });
    }
  };

  return (
    <Input
      placeholder={placeholder}
      prefix={<div className="GeckoUISelectDropdownSearch__icon" />}
      className={classNames("GeckoUISelectDropdownSearch", className)}
      {...rest}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      value={keyword}
      onChange={handleInputChange}
      onKeyDown={handleKeyboardInteraction}
    />
  );
};

SelectDropdownSearch.displayName = "SelectDropdownSearch";

export default SelectDropdownSearch;
