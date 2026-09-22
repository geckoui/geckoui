import type { FC } from "react";

import { ColorInput } from "../../ColorInput";
import { RHFController } from "../RHFController";
import type { RHFColorInputProps } from "./RHFColorInput.types";

/**
 * React Hook Form wrapper for the ColorInput component.
 *
 * The field holds the colour as a string in whichever format is on show. Untouched and
 * with no default it is `undefined`, the way any React Hook Form field is, so `required`
 * catches one nobody picked.
 *
 * `onChangeComplete` is not wired to the form: the form is updated on every move, so a
 * drag does not leave the value behind. Pass it yourself where a save should wait.
 *
 * @example
 * ```tsx
 * <RHFColorInput name="brand" rules={{ required: "Pick a colour" }} />
 * <RHFColorInput name="overlay" alpha format="rgb" />
 * ```
 */
const RHFColorInput: FC<RHFColorInputProps> = ({
  name,
  control,
  rules,
  onChange,
  defaultValue = "",
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <ColorInput
          value={typeof field.value === "string" ? field.value : defaultValue}
          aria-invalid={Boolean(fieldState.error) || undefined}
          onChange={(color) => {
            field.onChange(color);
            onChange?.(color);
          }}
          {...rest}
        />
      )}
    />
  );
};

RHFColorInput.displayName = "RHFColorInput";

export default RHFColorInput;
