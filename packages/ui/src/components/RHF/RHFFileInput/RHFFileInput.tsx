import type { FC } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

import useRevokedPreviews from "../../../hooks/useRevokedPreviews";
import { classNames } from "../../../utils/classNames";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import { RHFController } from "../RHFController";
import type { FileWithPreview, RHFFileInputProps } from "./RHFFileInput.types";

/**
 * File input component that integrates with react-hook-form.
 *
 * You can pass `render` to render custom component instead of the default input element
 *
 * You have access to the Controller renderProps object in the `render` function
 * So that you can access the field, fieldState, and formState objects and use them accordingly
 *
 * @example
 * ```tsx
 * // Basic usage - single file selection
 * // Automatically creates a preview URL for the selected file
 * <RHFFileInput name="file" />
 *
 * // Multiple file selection
 * <RHFFileInput name="files" multiple />
 *
 * // Restrict file types
 * <RHFFileInput name="avatar" accept="image/*" />
 *
 * // With custom render
 * <RHFFileInput
 *   name="file"
 *   accept="image/*"
 *   render={({ field: { value } }) => {
 *      return (
 *        <div className="flex rounded overflow-hidden items-center justify-center cursor-pointer border-2 p-4 w-full border-dotted border-gray-300 h-[200px]">
 *          {value ? (
 *            <img
 *              className="inline-block object-contain w-full h-full"
 *              src={value.preview}
 *              alt="Preview"
 *            />
 *          ) : (
 *            <span>Upload File</span>
 *          )}
 *        </div>
 *      );
 *   }}
 * />
 * ```
 */
const RHFFileInput: FC<RHFFileInputProps> = ({
  id,
  control,
  name,
  rules,
  disabled,
  onBlur,
  multiple,
  onChange,
  className,
  inputClassName,
  render,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={(renderProps) => (
        <Field
          {...renderProps}
          className={className}
          disabled={disabled}
          id={id}
          inputClassName={inputClassName}
          multiple={multiple}
          onBlur={onBlur}
          onChange={onChange}
          render={render}
          rest={rest}
        />
      )}
    />
  );
};

/**
 * The input itself, as a component rather than inline, so the preview cleanup can be a hook
 * with the field's value in hand.
 */
const Field = ({
  field,
  className,
  disabled,
  id,
  inputClassName,
  multiple,
  onBlur,
  onChange,
  render,
  rest,
  ...renderProps
}: {
  field: ControllerRenderProps<FieldValues, string>;
  rest: Record<string, unknown>;
} & Omit<RHFFileInputProps, "name" | "control" | "rules">) => {
  const held: FileWithPreview[] = Array.isArray(field.value)
    ? field.value
    : field.value
      ? [field.value]
      : [];

  useRevokedPreviews(held.map((file) => file?.preview));

  return (
    <label className={classNames("GeckoUIRHFFileInput", className)} id={id}>
      <input
        {...field}
        {...rest}
        className={classNames("GeckoUIRHFFileInput__input", inputClassName)}
        data-custom={Boolean(render) || undefined}
        disabled={disabled}
        id={id}
        multiple={multiple}
        onBlur={(e) => {
          field.onBlur();
          onBlur?.(e);
        }}
        onChange={(e) => {
          let data: FileWithPreview[] | FileWithPreview | undefined = Array.from(
            (e.target.files ?? []) as FileWithPreview[]
          ).map((file) => {
            file.preview = URL.createObjectURL(file);
            return file;
          });

          if (!multiple) {
            data = data[0];
          }

          field.onChange(data);
          onChange?.(data);
        }}
        type="file"
        value={undefined}
      />
      {render ? (
        <DynamicComponentRenderer component={render} field={field} {...renderProps} />
      ) : null}
    </label>
  );
};

RHFFileInput.displayName = "RHFFileInput";

export default RHFFileInput;
