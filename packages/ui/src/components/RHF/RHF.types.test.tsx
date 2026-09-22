import { describe, expectTypeOf, it } from "vitest";

import { RHFCheckbox } from "./RHFCheckbox";
import { RHFInput } from "./RHFInput";
import { RHFOTPInput } from "./RHFOTPInput";
import { RHFRadio } from "./RHFRadio";
import { RHFSwitch } from "./RHFSwitch";
import { RHFTextarea } from "./RHFTextarea";

/**
 * `onBlur` never hands back a DOM event. The wrappers whose value is a string give the
 * value; the rest take no argument.
 */
describe("RHF onBlur", () => {
  it("gives the value where the field holds a string", () => {
    <RHFInput name="a" onBlur={(value) => expectTypeOf(value).toEqualTypeOf<string>()} />;
    <RHFTextarea name="a" onBlur={(value) => expectTypeOf(value).toEqualTypeOf<string>()} />;
  });

  it("takes no argument on the toggles and the code field", () => {
    <RHFCheckbox name="a" onBlur={() => {}} />;
    <RHFRadio name="a" value="x" onBlur={() => {}} />;
    <RHFSwitch name="a" onBlur={() => {}} />;
    <RHFOTPInput name="a" onBlur={() => {}} />;

    // @ts-expect-error -- no event is passed any more
    <RHFCheckbox name="a" onBlur={(event: FocusEvent) => void event} />;
    // @ts-expect-error -- no event is passed any more
    <RHFRadio name="a" value="x" onBlur={(event: FocusEvent) => void event} />;
    // @ts-expect-error -- no event is passed any more
    <RHFSwitch name="a" onBlur={(event: FocusEvent) => void event} />;
  });
});
