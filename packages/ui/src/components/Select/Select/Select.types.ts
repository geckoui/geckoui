import type { Placement, Strategy, useFloating } from "@floating-ui/react";
import type {
  Dispatch,
  JSX,
  PropsWithChildren,
  RefCallback,
  RefObject,
  SetStateAction
} from "react";

import type { SelectButtonProps } from "../SelectButton";
import type { SelectOptionConfig } from "../SelectOption/SelectOption.types";

export interface BaseSelectProps extends PropsWithChildren, SelectButtonProps {
  inputRef?: RefCallback<HTMLInputElement | null> | RefObject<HTMLInputElement | null>;
  /**
   * Placeholder that will be shown when the select is empty
   * */
  placeholder?: string;

  /**
   * Additional class name for the placeholder
   * */
  placeholderClassName?: string;

  /*
   * Additional class name for the wrapper that wraps the select button and menu
   * */
  wrapperClassName?: string;

  /**
   * Additional class name for the menu
   * */
  menuClassName?: string;

  /**
   * Select is disabled or not
   * */
  disabled?: boolean;

  /**
   * Whether to show the input for filtering the options
   * `true` or `"dropdown"`: a search box at the top of the menu
   * `"inline"`: typed straight into the button
   * Default is false
   * */
  filterable?: boolean | "inline" | "dropdown";

  /**
   * Focus the dropdown search box when the menu opens.
   * Off by default: on a phone, focusing it pops up the keyboard over the options.
   * Typing on a keyboard while the select is focused still moves into the search box.
   * Only for `filterable` / `"dropdown"`; `"inline"` always focuses, since that is where
   * you type.
   * Default is false
   * */
  autoFocusSearch?: boolean;

  /**
   * Whether to close the menu when an option is selected
   * Default is true for single select and false for multi select
   * */
  closeMenuOnSelect?: boolean;

  /**
   * Placement of the menu
   * Default is "bottom-start"
   * */
  placement?: Placement;

  /**
   * Floating strategy for the menu
   * */
  floatingStrategy?: Strategy;

  /**
   * Whether to hide the default empty UI when the select is empty
   * If you pass `SelectEmpty` as children, this will set to true
   * */
  hideDefaultEmptyUI?: boolean;

  /**
   * If true, a clear button will be shown to clear the selected value
   * Default is false
   * */
  clearable?: boolean;
}

export interface SingleSelectBaseProps<T> extends BaseSelectProps {
  /**
   * The value of the select
   * */
  value: T;

  /**
   * Disabling multiple select
   * */
  multiple?: false;
}

export interface SingleSelectProps<T> extends SingleSelectBaseProps<T> {
  clearable?: false;

  /**
   * Callback to be called when the value changes
   * */
  onChange: (value: T) => void;
}

export interface ClearableSingleSelectProps<T> extends SingleSelectBaseProps<T> {
  clearable: true;

  /**
   * Callback to be called when the value changes.
   * The clear button calls it with `null`.
   * */
  onChange: (value: T | null) => void;
}

export interface MultiSelectProps<T> extends BaseSelectProps {
  /**
   * The value of the select in array format
   * */
  value: T[];

  /**
   * Callback to be called when the value changes
   * */
  onChange: (value: T[]) => void;

  /**
   * For enabling multiple select
   * */
  multiple: true;
}

export type SelectProps<T> =
  | SingleSelectProps<T>
  | ClearableSingleSelectProps<T>
  | MultiSelectProps<T>;

export interface SelectOverload {
  <T>(props: SingleSelectProps<T>): JSX.Element;
  <T>(props: ClearableSingleSelectProps<T>): JSX.Element;
  <T>(props: MultiSelectProps<T>): JSX.Element;
  <T>(props: SelectProps<T>): JSX.Element;
  displayName: string;
}

export interface FocusedOption<T = unknown> extends SelectOptionConfig<T> {
  focusType?: "keyboard" | "mouse" | "initial";
}

export interface SelectContextProps<T>
  extends Pick<
      BaseSelectProps,
      "disabled" | "prefix" | "suffix" | "placeholder" | "closeMenuOnSelect"
    >,
    Omit<MultiSelectProps<T>, "value" | "onChange" | "multiple" | "renderDisplay"> {
  /**
   * The value of the select
   * */
  value: T | T[];

  /**
   * For checking if the select is multiple or single
   * */
  multiple?: boolean;

  /**
   * Input ref for the filter input
   * Use this to work with keyword filter in custom select
   * */
  setInputRef: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _: any
  ) => RefCallback<HTMLElement | null> | RefObject<HTMLElement | null> | undefined;

  /**
   * Ref for the input
   * */
  inputRef: RefObject<HTMLInputElement | null>;

  /**
   * For managing the open state of the menu
   * */
  open: boolean;

  /**
   * Setter for open state for the menu
   * */
  setOpen: Dispatch<SetStateAction<boolean>>;

  /**
   * Array of labels and values that are passed down as `SelectOption` to children
   * */
  options: SelectOptionConfig<T>[];

  /**
   * For filtering options that are binded to the input
   * If you use custom `SelectButton` you should bind this to the input
   * */
  keyword: string;

  /**
   * Bumped when the dropdown search box should take focus
   * */
  searchFocusRequest: number;

  /**
   * Move focus into the dropdown search box
   * */
  requestSearchFocus: () => void;

  /**
   * Setter for filter keyword
   * */
  setKeyword: Dispatch<SetStateAction<string>>;

  /**
   * For managing the floating state of the menu
   * *you rarely need to use this if you build custom select*
   * */
  floating: ReturnType<typeof useFloating>;

  /**
   * Open the select menu
   * */
  openMenu: () => void;

  /**
   * Close the select menu
   * */
  closeMenu: () => void;

  /**
   * Toggle the select menu
   * */
  toggleMenu: () => void;

  /**
   * Reusable function to check if the option is selected
   * Usage:
   * ```js
   * isSelected("optionValue")
   * ```
   * */
  isSelected: (optionValue: T) => boolean;

  /**
   * Reusable function to handle the change of the select
   * This function handle the option value base on the select type(multiple or single)
   * If multiple select, it will add or remove the value from the array
   * and if single select, it will replace the value
   *
   * Usage:
   * ```js
   * handleChange("optionValue")
   * ```
   * */
  handleChange: (optionValue: T) => void;

  /**
   * Current focused option that is selected by keyboard or mouse hover
   * */
  focusedOption: FocusedOption<T> | null;

  /**
   * Setter for focused option in case you want to update the focused option to a specific option
   * */
  setFocusedOption: Dispatch<SetStateAction<FocusedOption<T> | null>>;

  /**
   * Whether the select is empty when the filter is applied
   * */
  isEmpty: boolean;

  /**
   * Ref for the menu scroll container
   * Used internally for scrolling focused options into view
   * */
  menuScrollContainerRef: RefObject<HTMLDivElement | null>;

  /**
   * Callback to be called when the value changes
   * */
  onChange?: (value: T | T[]) => void;
}
