import { classNames } from "../../../utils/classNames";
import { Select } from "../../Select";
import { RHFController } from "../RHFController";
import type { RHFSelectOverload, RHFSelectProps } from "./RHFSelect.types";

/**
 * A select dropdown component integrated with React Hook Form.
 *
 * Supports both single and multiple selection modes with automatic error state display.
 * Built on the Select component with full React Hook Form integration.
 *
 * @example
 * ```tsx
 * // Basic single select
 * <RHFSelect name="country">
 *   <SelectOption value="us" label="United States" />
 *   <SelectOption value="uk" label="United Kingdom" />
 *   <SelectOption value="ca" label="Canada" />
 * </RHFSelect>
 *
 * // Multiple selection
 * <RHFSelect name="skills" multiple>
 *   <SelectOption value="js" label="JavaScript" />
 *   <SelectOption value="ts" label="TypeScript" />
 *   <SelectOption value="react" label="React" />
 * </RHFSelect>
 *
 * // With custom option styling
 * <RHFSelect name="priority">
 *   {['low', 'medium', 'high'].map((priority) => (
 *     <SelectOption
 *       key={priority}
 *       value={priority}
 *       label={priority.charAt(0).toUpperCase() + priority.slice(1)}
 *       className={({ selected }) =>
 *         selected ? "text-blue-600 font-bold" : "text-gray-700"
 *       }
 *     />
 *   ))}
 * </RHFSelect>
 *
 * // With onChange callback
 * <RHFSelect
 *   name="category"
 *   onChange={(value) => {
 *     console.log('Selected:', value);
 *     fetchSubcategories(value);
 *   }}
 * >
 *   <SelectOption value="1" label="Category 1" />
 *   <SelectOption value="2" label="Category 2" />
 * </RHFSelect>
 * ```
 */
const RHFSelect: RHFSelectOverload = <T,>({
  name,
  control,
  rules,
  className,
  wrapperClassName,
  ...rest
}: RHFSelectProps<T>) => {
  return (
    <RHFController
      name={name}
      control={control}
      rules={rules}
      render={({ field: { ref, value, onChange }, fieldState: { error } }) => {
        return (
          <Select<T>
            inputRef={ref}
            wrapperClassName={classNames("GeckoUIRHFSelect", wrapperClassName)}
            {...rest}
            className={classNames("GeckoUIRHFSelectButton", className)}
            data-error={!!error || undefined}
            value={value}
            onChange={(v: unknown) => {
              onChange(v);
              rest.onChange?.(v as T & T[]);
            }}
          />
        );
      }}
    />
  );
};

RHFSelect.displayName = "RHFSelect";

export default RHFSelect;
