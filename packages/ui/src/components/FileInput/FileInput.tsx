import type { DragEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import useRevokedPreviews from "../../hooks/useRevokedPreviews";
import { Upload } from "../../icons";
import FilePicker from "../../lib/FilePicker";
import type { FilePickerFile } from "../../types";
import { classNames } from "../../utils/classNames";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import { Spinner } from "../Spinner";
import type { FileInputProps, FileRejection, PickedFile, PreviewFile } from "./FileInput.types";
import { countLabel } from "./FileInput.utils";

/**
 * A file field: click it to browse, or drop files onto it.
 *
 * One file unless `multiple` is set, which is what a native file input does. A second pick
 * replaces what is held unless `append` is set, again as native does.
 *
 * `preview` is off by default. An object URL pins the file's bytes until it is revoked, so
 * it is opt in — and revoked for you once the file leaves or the field unmounts. `path` is
 * always there.
 *
 * @example
 * ```tsx
 * const [file, setFile] = useState<PickedFile | null>(null);
 *
 * <FileInput value={file} onChange={setFile} accept="image/*" />
 * ```
 *
 * @example
 * ```tsx
 * <FileInput
 *   multiple
 *   append
 *   unique
 *   preview
 *   max={5}
 *   value={files}
 *   onChange={setFiles}
 *   onReject={(rejected) => toast.error(`${rejected.length} turned away`)}
 * />
 * ```
 */
const FileInput = (props: FileInputProps) => {
  /*
   * The multiple-only three are pulled out here as well, or they would ride `rest` onto the
   * div and React would complain about `append` not being a DOM attribute.
   */
  const {
    accept = "*",
    preview = false,
    onReject,
    placeholder,
    hideClearIcon = false,
    disabled = false,
    readOnly = false,
    render,
    className,
    wrapperClassName,
    multiple,
    value,
    onChange,
    append = false,
    unique = false,
    max,
    ...rest
  } = props as FileInputProps & {
    value?: PickedFile | PickedFile[] | null;
    onChange?: (value: never) => void;
    render?: (state: never) => ReactNode;
    append?: boolean;
    unique?: boolean;
    max?: number;
  };

  const fieldRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const held: PickedFile[] = multiple
    ? ((value as PickedFile[]) ?? [])
    : value
      ? [value as PickedFile]
      : [];

  useRevokedPreviews(held.map((file) => (file as Partial<PreviewFile>).preview));

  const usable = !disabled && !readOnly;

  const emit = (files: PickedFile[]) => {
    const report = onChange as ((value: PickedFile[] | PickedFile | null) => void) | undefined;

    report?.(multiple ? files : (files[0] ?? null));
  };

  /** Room left on this run: everything when replacing, what is spare when appending. */
  const roomFor = () => {
    if (!multiple) return 1;
    if (max === undefined) return undefined;

    return append ? Math.max(max - held.length, 0) : max;
  };

  const take = (incoming: FilePickerFile[], rejected: FileRejection[]) => {
    const picked = incoming as unknown as PickedFile[];
    const kept = (append && multiple ? [...held, ...picked] : picked).slice(
      0,
      multiple ? undefined : 1
    );

    emit(kept);

    if (rejected.length) onReject?.(rejected);
  };

  const handlerFor = () =>
    new FilePicker(accept, unique, {
      multiple: Boolean(multiple),
      preview,
      room: roomFor(),
      oldFiles: append && multiple ? (held as FilePickerFile[]) : []
    });

  const browse = async () => {
    if (!usable || loading) return;

    const handler = handlerFor();

    try {
      const picked = await handler.open({
        multiple: Boolean(multiple),
        onChangeStart: () => setLoading(true)
      });

      take(picked, handler.rejected);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    if (!usable || loading || !event.dataTransfer?.items.length) return;

    const handler = handlerFor();

    try {
      setLoading(true);

      const dropped = await handler.onDrop(event.dataTransfer.items);

      take(dropped, handler.rejected);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    if (!usable) return;

    emit([]);
  };

  const remove = (file: PickedFile) => {
    if (!usable) return;

    emit(held.filter((current) => current !== file));
  };

  const state = disabled ? "disabled" : readOnly ? "readonly" : "enabled";

  const text = multiple ? countLabel(held.length) : held[0]?.name;

  return (
    <div className={classNames("GeckoUIFileInputWrapper", wrapperClassName)}>
      {/*
       * A plain div, not a button: the clear button and anything `render` draws live inside
       * it, and nesting one control in another is neither valid nor reachable. The row
       * itself is the trigger below, and its click bubbles up to here.
       */}
      <div
        {...rest}
        ref={fieldRef}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        className={classNames("GeckoUIFileInput", className)}
        data-state={state}
        data-dragging={dragging || undefined}
        data-empty={!held.length || undefined}
        data-custom={render ? "" : undefined}
        onClick={browse}
        onDragEnter={() => usable && setDragging(true)}
        onDragOver={(event) => {
          event.preventDefault();

          if (usable) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}>
        {render ? (
          /*
           * One file gets `file`, a list gets `files` and `remove`. The props say which it
           * is, so nothing here needs narrowing at the call site.
           */
          (render as (state: unknown) => ReactNode)(
            multiple
              ? { files: held, remove, dragging, loading, disabled, readOnly, browse, clear }
              : { file: held[0] ?? null, dragging, loading, disabled, readOnly, browse, clear }
          )
        ) : (
          <>
            {/* No handler of its own: the click bubbles to the row, which is the drop target */}
            <button
              type="button"
              className="GeckoUIFileInput__trigger"
              aria-invalid={(rest as { "aria-invalid"?: boolean })["aria-invalid"]}
              disabled={disabled}
              aria-describedby={undefined}>
              {text ? (
                <span className="GeckoUIFileInput__value">{text}</span>
              ) : (
                <span className="GeckoUIFileInput__placeholder">
                  <DynamicComponentRenderer
                    component={placeholder ?? (multiple ? "Choose files" : "Choose a file")}
                  />
                </span>
              )}
            </button>

            <div className="GeckoUIFileInput__icons">
              {loading && <Spinner className="GeckoUIFileInput__spinner" />}

              {!hideClearIcon && !!held.length && usable && (
                <button
                  type="button"
                  aria-label="Clear"
                  className="GeckoUIFileInput__clear"
                  onClick={(event) => {
                    event.stopPropagation();
                    clear();
                  }}>
                  <div className="GeckoUI-icon__clear" />
                </button>
              )}

              <Upload className="GeckoUIFileInput__icon" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

FileInput.displayName = "FileInput";

export default FileInput;
