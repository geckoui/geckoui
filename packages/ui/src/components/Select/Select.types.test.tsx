import { FormProvider, useForm } from "react-hook-form";
import { describe, expectTypeOf, it } from "vitest";

import { RHFSelect } from "../RHF";
import { Select } from "./Select";

/**
 * The clear button calls `onChange(null)`, so only a clearable single select may hand `null`
 * to its handler. Selects that can't be cleared keep their exact type.
 */
describe("Select onChange types", () => {
  it("gives a select that can't be cleared exactly T", () => {
    <Select value="a" onChange={(value) => expectTypeOf(value).toEqualTypeOf<string>()} />;
  });

  it("adds null when the select is clearable", () => {
    <Select
      value="a"
      clearable
      onChange={(value) => expectTypeOf(value).toEqualTypeOf<string | null>()}
    />;
  });

  it("rejects a handler that can't take null on a clearable select", () => {
    const setValue = (value: string) => value;

    <Select value="a" onChange={setValue} />;

    // @ts-expect-error -- clearing would call setValue(null)
    <Select value="a" clearable onChange={setValue} />;
  });

  it("keeps an array for a multiple select, cleared to []", () => {
    <Select
      multiple
      clearable
      value={["a"]}
      onChange={(value) => expectTypeOf(value).toEqualTypeOf<string[]>()}
    />;
  });

  it("follows the same rule on RHFSelect", () => {
    function Form() {
      const methods = useForm<{ fruit: string }>();

      return (
        <FormProvider {...methods}>
          <RHFSelect<string>
            name="fruit"
            onChange={(value) => expectTypeOf(value).toEqualTypeOf<string>()}
          />
          <RHFSelect<string>
            name="fruit"
            clearable
            onChange={(value) => expectTypeOf(value).toEqualTypeOf<string | null>()}
          />
        </FormProvider>
      );
    }

    expectTypeOf(Form).toBeFunction();
  });
});
