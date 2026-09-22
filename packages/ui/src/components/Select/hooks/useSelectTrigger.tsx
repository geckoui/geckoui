import { useEffect, useMemo } from "react";

import createLabel, { isBlankLabel } from "../../../utils/createLabel";
import { devWarn } from "../../../utils/devWarn";
import isEqual from "../../../utils/isEqual";
import isNil from "../../../utils/isNil";
import isTextIncludes from "../../../utils/isTextIncludes";
import { isHideSelectOption } from "../Select.utils";
import { useSelect } from "../useSelect";

export const useSelectTrigger = <T,>() => {
  const {
    value,
    options,
    keyword,
    focusedOption,
    setFocusedOption,
    setKeyword,
    openMenu,
    closeMenu,
    open,
    multiple,
    isEmpty,
    handleChange
  } = useSelect<T>();

  const filteredOptions = options.filter(
    ({ label, visibility }) => !isHideSelectOption({ keyword, label, visibility, isEmpty })
  );

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

  const handleKeyboardInteraction = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
      closeMenu();
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Tab") {
      e.preventDefault();
      let currentIndex = filteredOptions.findIndex((e) => isEqual(e.value, focusedOption?.value));

      currentIndex = currentIndex === -1 ? 0 : currentIndex;

      let isDown = e.key === "ArrowDown" || e.key === "Tab";

      if (e.key === "Tab" && e.shiftKey) {
        isDown = false;
      }

      let nextIndex = isDown ? currentIndex + 1 : currentIndex - 1;

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

      return;
    }

    if (e.key === "Backspace" && !keyword && multiple && Array.isArray(value) && value.length > 0) {
      handleChange(value.at(-1) as T);
    }
  };

  const matchesAnOption = options.some((opt) => isEqual(opt.value, value));

  useEffect(() => {
    if (multiple || matchesAnOption || isNil(value) || value === "") return;

    devWarn(
      "Select was given a value that matches no SelectOption, so the label was worked out " +
        "from the value itself. Add an option for it, or give the value a `label` key."
    );
  }, [multiple, matchesAnOption, value]);

  const hasValue = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) && !!value?.length;
    }

    // An option owns the value, so its label is what the trigger shows
    if (matchesAnOption) return true;

    // Otherwise the trigger shows text worked out from the value. If that comes out
    // blank there is nothing worth showing, so fall through to the placeholder rather
    // than render an empty box.
    return !isBlankLabel(createLabel(value));
  }, [matchesAnOption, multiple, value]);

  return {
    hasValue,
    filteredOptions,
    handleInputChange,
    handleKeyboardInteraction
  };
};
