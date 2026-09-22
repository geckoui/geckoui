import { FileInput } from "../../FileInput";
import type { PickedFile } from "../../FileInput";
import { RHFController } from "../RHFController";
import type { RHFFileInputProps } from "./RHFFileInput.types";

/**
 * React Hook Form wrapper for [FileInput](/docs/file-input).
 *
 * The field holds one `PickedFile` when single, or a `PickedFile[]` when `multiple`, so
 * `required` catches an empty one either way.
 *
 * @example
 * ```tsx
 * <RHFFileInput name="avatar" accept="image/*" rules={{ required: "Pick a file" }} />
 * <RHFFileInput name="photos" multiple append unique preview max={5} />
 * ```
 */
const RHFFileInput = <T extends PickedFile = PickedFile>({
  name,
  control,
  rules,
  onChange,
  ...rest
}: RHFFileInputProps<T>) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FileInput
          {...(rest as RHFFileInputProps<T>)}
          hasError={Boolean(fieldState.error)}
          value={field.value}
          onChange={(value: T | T[] | null) => {
            field.onChange(value);
            (onChange as ((v: unknown) => void) | undefined)?.(value);
          }}
        />
      )}
    />
  );
};

RHFFileInput.displayName = "RHFFileInput";

export default RHFFileInput;
