import type { FileInputProps } from "../../FileInput";
import type { RHFBaseProps } from "../RHF.types";

/**
 * `Omit` over a union collapses it into one object, which would lose the discrimination on
 * `multiple` and `preview` that decides the value type and what `render` is handed.
 * Distributing keeps every branch.
 * */
type OmitEach<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type RHFFileInputProps = RHFBaseProps & OmitEach<FileInputProps, "value">;
