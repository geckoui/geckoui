import type { RefObject } from "react";

export interface FilePickerFile extends File {
  /** Preview URL of the file */
  preview: string;

  /**
   * Path of the file in the file system
   * These fields will be derived from the `webkitRelativePath` property if it exists
   * if not it will be generated based on `directory` and `name` properties from directory picker
   * */
  path: string;

  /**
   * Name of the file in the file system
   * Due to the fact `File.name` is read-only, we provide a way to edit the name of the file
   * in case you need to rename the file before uploading it
   * */
  editableName: string;
}

export type FileSize = number | string;

export interface OpenFilePickerOptions {
  /**
   * If `directory` is false, whether to allow multiple files to be selected
   *
   * Default: true
   * */
  multiple?: boolean;

  /**
   * Open directory picker instead of file picker
   * */
  directory?: boolean;

  /**
   * Callback function that is called when the file picker changes
   * */
  onChangeStart?: () => void;
}

export interface UseFilePickerOptions {
  /**
   * File types that can be accepted by the file picker
   *
   * Default: *
   * */
  accept?: string;

  /** Nothing can be picked or dropped.(Default: false) */
  disabled?: boolean;

  /**
   * Function to transform files before returning them
   * */
  transform?: (files: FilePickerFile[]) => Promise<FilePickerFile[]> | FilePickerFile[];

  /**
   * Whether to keep old files when the file picker changes
   * If true, the file picker will keep old files when new files are selected
   * And return all files selected so far
   *
   * Default: false
   * */
  keepOldFiles?: boolean;

  /**
   * Whether to remove duplicated files if `keepOldFiles` is true
   * If true, the file picker will remove duplicated files
   *
   * Default: false
   * */
  removeDuplicates?: boolean;

  /**
   * Callback function that is called when the file picker changes
   * */
  onChange?: (
    /** All files selected so far if `keepOldFiles` is true */
    files: FilePickerFile[],

    /** New files that are selected if */
    newFiles: FilePickerFile[]
  ) => Promise<void> | void;

  /**
   * Callback function that is called when the file picker starts
   * */
  onStart?: () => void;

  /**
   * Callback function that is called when the file picker encounters an error
   * */
  onError?: (error: Error) => void;

  // State handler Files selected so far
  files?: FilePickerFile[];

  // State handler setFiles
  setFiles?: (files: FilePickerFile[]) => void;
}

export type OpenFilePickerFn = (
  options?: Omit<OpenFilePickerOptions, "onChangeStart">
) => Promise<FilePickerFile[] | undefined>;

export interface UseFilePickerReturn<T extends HTMLElement> {
  /**
   * Ref to the element that should be used as the dropzone
   * */
  dropzoneRef: RefObject<T | null>;

  /** Whether the user is currently dragging files over the dropzone */
  dragging: boolean;

  /** Whether the dropzone is currently processing files */
  loading: boolean;

  /** Function to open the file picker */
  openFilePicker: OpenFilePickerFn;

  /**
   * Files selected so far
   * */
  files: FilePickerFile[];
}
