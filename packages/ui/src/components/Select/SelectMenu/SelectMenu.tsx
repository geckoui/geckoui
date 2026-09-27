import { Children, type PropsWithChildren, useEffect, useMemo } from "react";

import { classNames } from "../../../utils/classNames";
import { isSelectEmpty, isSelectTrigger } from "../Select.utils";
import { SelectDropdownSearch } from "../SelectDropdownSearch";
import { SelectEmpty } from "../SelectEmpty";
import type { SelectOptionElement } from "../SelectOption";
import { useSelect } from "../useSelect";
import type { SelectMenuProps } from "./SelectMenu.types";

const SelectMenu = ({ children, className, ...rest }: SelectMenuProps) => {
  const {
    disabled,
    open,
    filterable,
    autoFocusSearch,
    searchFocusRequest,
    menuScrollContainerRef,
    floating: { refs, floatingStyles }
  } = useSelect();

  const menuItems = useMemo(
    () => Children.toArray(children).filter((el) => !isSelectTrigger(el)),
    [children]
  );

  useEffect(() => {
    if (!searchFocusRequest) return;
    refs.floating.current
      ?.querySelector<HTMLInputElement>(".GeckoUISelectMenu__search-container input")
      ?.focus();
  }, [searchFocusRequest, refs.floating]);

  if (!open || disabled) {
    return null;
  }

  const hasDropdownSearch = filterable === true || filterable === "dropdown";

  return (
    <div
      ref={(r) => refs.setFloating(r)}
      style={floatingStyles}
      className={classNames("GeckoUISelectMenu", className)}
      data-with-search={hasDropdownSearch || undefined}
      {...rest}>
      {hasDropdownSearch && (
        <SelectDropdownSearch
          className="GeckoUISelectMenu__search-container"
          autoFocus={autoFocusSearch}
        />
      )}
      <div ref={menuScrollContainerRef} className="GeckoUISelectMenu__items">
        {menuItems}
        <Empty>{menuItems}</Empty>
      </div>
    </div>
  );
};

function Empty({ children }: PropsWithChildren) {
  const { hideDefaultEmptyUI = false } = useSelect();

  if (hideDefaultEmptyUI) return null;

  // Check user has provided <SelectEmpty /> component
  const customEmpty = (Children.toArray(children) as SelectOptionElement[]).find(isSelectEmpty);
  if (customEmpty) return null;

  // If not provided, then we will render default <SelectEmpty />
  return <SelectEmpty />;
}

SelectMenu.displayName = "SelectMenu";

export default SelectMenu;
