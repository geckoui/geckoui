import type { FileInputProps, PickedFile } from "../../FileInput";
import type { RHFBaseProps } from "../RHF.types";

/**
 * `Omit` over a union collapses it into one object, which would lose the discrimination
 * that makes `append`, `unique` and `max` multiple-only. Distributing keeps both branches.
 * */
type OmitEach<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type RHFFileInputProps<T extends PickedFile = PickedFile> = RHFBaseProps &
  OmitEach<FileInputProps<T>, "value" | "hasError">;
