import type { HTMLAttributes, ReactNode } from "react";

/** A file that has been picked, with where it sat in any folder it came from. */
export type PickedFile = File & {
  /**
   * Where the file sat in the folder it came from, or `""` for a file picked on its own.
   * Taken from `webkitRelativePath` when the browser gives one.
   * */
  path: string;
};

/** A picked file with an object URL, which only exists when `preview` is set. */
export type PreviewFile = PickedFile & {
  /**
   * An object URL for showing the file. Revoked for you when the file leaves the field or
   * the field unmounts.
   * */
  preview: string;
};

/** Why a file was turned away. */
export type FileRejectionReason =
  /** It did not match `accept`. */
  | "type"
  /** It is already held, and `unique` is set. */
  | "duplicate"
  /** There was no room: past `max`, or a second file in a single field. */
  | "max";

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

interface BaseFileInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * What may be picked, as the `accept` attribute is written: `"image/*"`, `".pdf,.docx"`.
   *
   * Enforced on a drop as well as in the dialog, unlike the native attribute, which only
   * filters what the dialog offers.
   * @default "*"
   * */
  accept?: string;

  /**
   * Give each file an object URL on `preview`.
   *
   * Off by default: an object URL pins the file's bytes until it is revoked, which is work
   * and memory you have not asked for. `path` is always there.
   * @default false
   * */
  preview?: boolean;

  /** Called with every file turned away, and why. */
  onReject?: (rejected: FileRejection[]) => void;

  /** Shown while there is nothing picked. */
  placeholder?: ReactNode;

  /** Drop the × that empties the field. @default false */
  hideClearIcon?: boolean;

  /** @default false */
  disabled?: boolean;

  /** Shows what is picked, but nothing can be picked or dropped. @default false */
  readOnly?: boolean;

  /** Draws the field in its error colours. @default false */
  hasError?: boolean;

  /**
   * Draw the field yourself.
   *
   * Drawn **inside** the field, so browsing, dropping, the drag state and the keyboard stay
   * with the component.
   * */
  render?: (state: FileInputRenderState) => ReactNode;

  className?: string;
  wrapperClassName?: string;
}

export interface FileInputRenderState {
  /** What is held: one file, or the list. */
  files: PickedFile[];
  /** Whether a file is being dragged over the field. */
  dragging: boolean;
  /** Whether the files are still being read. */
  loading: boolean;
  disabled: boolean;
  readOnly: boolean;
  /** Opens the file dialog. */
  browse: () => void;
  /** Empties the field. */
  clear: () => void;
  /** Drops one file from the list. */
  remove: (file: PickedFile) => void;
}

/** One file, which is what a file field is unless it is told otherwise. */
export interface SingleFileInputProps<T extends PickedFile = PickedFile>
  extends BaseFileInputProps {
  value?: T | null;
  onChange?: (file: T | null) => void;
  multiple?: false;
}

/** A list of files. */
export interface MultiFileInputProps<T extends PickedFile = PickedFile> extends BaseFileInputProps {
  value?: T[];
  onChange?: (files: T[]) => void;
  multiple: true;

  /**
   * Keep what is already held and add to it, rather than replacing it.
   *
   * Off by default, which is what a native file input does.
   * @default false
   * */
  append?: boolean;

  /**
   * Turn away a file that is already held.
   *
   * Compared by size first, then by sampling the start, middle and end, so a large file is
   * never read end to end. Reaches `onReject` with `"duplicate"`.
   * @default false
   * */
  unique?: boolean;

  /** How many may be held. Anything past it reaches `onReject` with `"max"`. */
  max?: number;
}

export type FileInputProps<T extends PickedFile = PickedFile> =
  | SingleFileInputProps<T>
  | MultiFileInputProps<T>;
