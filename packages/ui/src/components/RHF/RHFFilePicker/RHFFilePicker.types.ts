import type { ReactNode } from "react";

import type { FilePickerFile, UseFilePickerOptions, UseFilePickerReturn } from "../../../types";
import type { RHFBaseProps, RHFRenderArgs } from "../RHF.types";

export interface RHFFilePickerRenderProps<T extends HTMLElement = HTMLDivElement>
  extends UseFilePickerReturn<T>,
    RHFRenderArgs<Record<string, FilePickerFile[]>> {
  /** Nothing can be picked or dropped; draw your dropzone accordingly. */
  disabled: boolean;
}

export type FilePickerOptions = Omit<UseFilePickerOptions, "onStart">;

export interface RHFFilePickerBaseProps<T extends HTMLElement = HTMLDivElement>
  extends FilePickerOptions {
  render?: (
    /** Additional props to be used on the dropzone element */
    props: RHFFilePickerRenderProps<T>
  ) => ReactNode;
}

export interface RHFFilePickerProps<T extends HTMLElement = HTMLDivElement>
  extends RHFBaseProps,
    RHFFilePickerBaseProps<T> {}

export interface RHFFilePickerRendererProps<T extends HTMLElement = HTMLDivElement>
  extends RHFRenderArgs<Record<string, FilePickerFile[]>>,
    RHFFilePickerBaseProps<T> {}
