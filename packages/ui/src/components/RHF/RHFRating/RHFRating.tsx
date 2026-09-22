import type { FC } from "react";

import { Rating } from "../../Rating";
import { RHFController } from "../RHFController";
import type { RHFRatingProps } from "./RHFRating.types";

/**
 * React Hook Form wrapper for the Rating component.
 *
 * The field holds a number, `0` for nothing picked, so `required` catches an untouched one.
 *
 * @example
 * ```tsx
 * <RHFRating name="score" rules={{ min: { value: 1, message: "Pick a rating" } }} />
 * <RHFRating name="score" allowHalf max={10} />
 * ```
 */
const RHFRating: FC<RHFRatingProps> = ({
  name,
  control,
  rules,
  onChange,
  defaultValue = 0,
  ...rest
}) => {
  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <Rating
          name={field.name}
          value={typeof field.value === "number" ? field.value : defaultValue}
          onChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          {...rest}
        />
      )}
    />
  );
};

RHFRating.displayName = "RHFRating";

export default RHFRating;
