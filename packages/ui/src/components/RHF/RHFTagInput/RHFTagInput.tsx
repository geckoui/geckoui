import type { FC } from "react";

import { TagInput } from "../../TagInput";
import { RHFController } from "../RHFController";
import type { RHFTagInputProps } from "./RHFTagInput.types";

/**
 * React Hook Form wrapper for the TagInput component.
 *
 * The field holds a `string[]`. A field the form has nothing for reads as an empty list, so
 * the input never has to guard against it.
 *
 * @example
 * ```tsx
 * <RHFTagInput name="tags" rules={{ required: "Add at least one tag" }} />
 * <RHFTagInput name="emails" validate={(tag) => tag.includes("@")} />
 * ```
 */
const RHFTagInput: FC<RHFTagInputProps> = ({ name, control, rules, onChange, ...rest }) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TagInput
          value={Array.isArray(field.value) ? field.value : []}
          onChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          hasError={Boolean(fieldState.error)}
          {...rest}
        />
      )}
    />
  );
};

RHFTagInput.displayName = "RHFTagInput";

export default RHFTagInput;
