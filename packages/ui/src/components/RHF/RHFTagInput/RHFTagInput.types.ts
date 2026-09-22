import type { TagInputProps } from "../../TagInput";
import type { RHFBaseProps } from "../RHF.types";

export interface RHFTagInputProps extends RHFBaseProps, Omit<TagInputProps, "value" | "onChange"> {
  /** Called alongside the form update. */
  onChange?: (value: string[]) => void;
}
