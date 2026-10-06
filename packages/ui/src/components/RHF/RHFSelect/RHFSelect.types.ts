import type { JSX } from "react";

import type { MultiSelectProps, SingleSelectBaseProps } from "../../Select";
import type { RHFBaseProps } from "../RHF.types";

interface RHFSingleSelectProps<T> extends Omit<SingleSelectBaseProps<T>, "value">, RHFBaseProps {
  clearable?: false;
  onChange?: (value: T) => void;
}

interface RHFClearableSingleSelectProps<T>
  extends Omit<SingleSelectBaseProps<T>, "value">,
    RHFBaseProps {
  clearable: true;
  /** The clear button calls it with `null`. */
  onChange?: (value: T | null) => void;
}
interface RHFMultiSelectProps<T>
  extends Omit<MultiSelectProps<T>, "value" | "onChange">,
    RHFBaseProps {
  onChange?: (value: T[]) => void;
}

export type RHFSelectProps<T> =
  | RHFSingleSelectProps<T>
  | RHFClearableSingleSelectProps<T>
  | RHFMultiSelectProps<T>;

export interface RHFSelectOverload {
  displayName: string;
  <T>(props: RHFSingleSelectProps<T>): JSX.Element;
  <T>(props: RHFClearableSingleSelectProps<T>): JSX.Element;
  <T>(props: RHFMultiSelectProps<T>): JSX.Element;
}
