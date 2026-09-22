import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, type UseFormProps, useForm } from "react-hook-form";

/** A form around whatever is under test, so a field can be submitted and read back. */
export function Form({
  children,
  onSubmit,
  ...options
}: { children: ReactNode; onSubmit?: (values: unknown) => void } & UseFormProps) {
  const methods = useForm(options);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((values) => onSubmit?.(values))}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

export const submit = () => userEvent.click(screen.getByRole("button", { name: "Submit" }));
