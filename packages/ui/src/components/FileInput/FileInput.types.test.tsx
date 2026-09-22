import { describe, expectTypeOf, it } from "vitest";

import FileInput from "./FileInput";
import type { PickedFile, PreviewFile } from "./FileInput.types";

/**
 * What `multiple` and `preview` are for: the value and what `render` is handed follow from
 * the props, so nothing at a call site needs a cast.
 */
describe("FileInput types", () => {
  it("hands render one file when single, and the list when multiple", () => {
    <FileInput
      render={(state) => {
        expectTypeOf(state.file).toEqualTypeOf<PickedFile | null>();

        // @ts-expect-error -- a single field has no list
        expectTypeOf(state.files).toBeUnknown();

        return null;
      }}
    />;

    <FileInput
      multiple
      render={(state) => {
        expectTypeOf(state.files).toEqualTypeOf<PickedFile[]>();
        expectTypeOf(state.remove).toBeFunction();

        // @ts-expect-error -- a list has no single file
        expectTypeOf(state.file).toBeUnknown();

        return null;
      }}
    />;
  });

  it("only types preview when it was asked for", () => {
    <FileInput
      render={({ file }) => {
        // @ts-expect-error -- no preview prop, so no object URL was made
        expectTypeOf(file?.preview).toBeUnknown();

        return null;
      }}
    />;

    <FileInput
      preview
      render={({ file }) => {
        expectTypeOf(file).toEqualTypeOf<PreviewFile | null>();
        expectTypeOf(file!.preview).toEqualTypeOf<string>();

        return null;
      }}
    />;

    <FileInput
      multiple
      preview
      render={({ files }) => {
        expectTypeOf(files).toEqualTypeOf<PreviewFile[]>();

        return null;
      }}
    />;
  });

  it("follows multiple for the value and onChange", () => {
    <FileInput onChange={(file) => expectTypeOf(file).toEqualTypeOf<PickedFile | null>()} />;

    <FileInput multiple onChange={(files) => expectTypeOf(files).toEqualTypeOf<PickedFile[]>()} />;
  });

  it("keeps append, unique and max to a list", () => {
    // @ts-expect-error -- nothing to append to
    <FileInput append />;

    // @ts-expect-error -- one file cannot duplicate itself
    <FileInput unique />;

    // @ts-expect-error -- the max is one
    <FileInput max={3} />;

    <FileInput multiple append unique max={3} />;
  });
});
