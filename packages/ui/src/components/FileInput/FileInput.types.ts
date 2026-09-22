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

interface CommonFileInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * What may be picked, as the `accept` attribute is written: `"image/*"`, `".pdf,.docx"`.
   *
   * Enforced on a drop as well as in the dialog, unlike the native attribute, which only
   * filters what the dialog offers.
   * @default "*"
   * */
  accept?: string;

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

  className?: string;
  wrapperClassName?: string;
}

interface CommonRenderState {
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
}

export interface SingleFileRenderState<T extends PickedFile = PickedFile>
  extends CommonRenderState {
  /** What is held, or `null`. */
  file: T | null;
}

export interface MultiFileRenderState<T extends PickedFile = PickedFile> extends CommonRenderState {
  /** What is held. */
  files: T[];
  /** Drops one file from the list. */
  remove: (file: T) => void;
}

interface SingleShape<T extends PickedFile> {
  value?: T | null;
  onChange?: (file: T | null) => void;
  multiple?: false;

  /**
   * Draw the field yourself.
   *
   * Drawn **inside** the field, so browsing, dropping, the drag state and the keyboard stay
   * with the component.
   * */
  render?: (state: SingleFileRenderState<T>) => ReactNode;
}

interface MultiShape<T extends PickedFile> {
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

  /** Draw the field yourself. Drawn **inside** it, so the wiring stays put. */
  render?: (state: MultiFileRenderState<T>) => ReactNode;
}

interface Previewless {
  /**
   * Give each file an object URL on `preview`.
   *
   * Off by default: an object URL pins the file's bytes until it is revoked, which is work
   * and memory you have not asked for. `path` is always there.
   * @default false
   * */
  preview?: false;
}

interface Previewed {
  /** Gives each file an object URL on `preview`, revoked for you once it is done with. */
  preview: true;
}

/**
 * `multiple` decides whether the value is one file or a list, and `preview` decides whether
 * those files carry an object URL. Both are read off the props, so neither `value` nor what
 * `render` is given ever needs a cast.
 * */
export type FileInputProps =
  /*
   * Ordered with the plainest last on purpose. When nothing matches, TypeScript reports the
   * union's final branch, so this is the one whose message names the real mismatch —
   * a `PreviewFile` value on a field with no `preview`, say — rather than complaining that
   * `multiple` is missing.
   */
  | (CommonFileInputProps & MultiShape<PreviewFile> & Previewed)
  | (CommonFileInputProps & MultiShape<PickedFile> & Previewless)
  | (CommonFileInputProps & SingleShape<PreviewFile> & Previewed)
  | (CommonFileInputProps & SingleShape<PickedFile> & Previewless);
