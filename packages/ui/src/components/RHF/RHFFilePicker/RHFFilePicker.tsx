import { useFilePicker } from "../../../hooks";
import { Upload, X } from "../../../icons";
import type { FilePickerFile } from "../../../types";
import { Spinner } from "../../Spinner";
import { RHFController } from "../RHFController";
import type { RHFFilePickerProps, RHFFilePickerRendererProps } from "./RHFFilePicker.types";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * A file picker component with drag-and-drop support for React Hook Form.
 *
 * Features include:
 * - File and directory selection
 * - Drag-and-drop support
 * - File preview URLs
 * - Duplicate detection and optional removal
 * - Custom UI via render prop
 *
 * Selected files have additional properties:
 * - `preview`: URL for displaying file content
 * - `duplicatedWith`: Array of files this file duplicates
 *
 * @example
 * ```tsx
 * // Basic usage - accept all file types
 * <RHFFilePicker name="files" />
 *
 * // Restrict to images only
 * <RHFFilePicker name="images" accept="image/*" />
 *
 * // Remove duplicates automatically
 * <RHFFilePicker
 *   name="files"
 *   accept="image/*"
 *   removeDuplicates
 * />
 * ```
 *
 * Custom UI example (compact image grid):
 * ```tsx
 * <RHFFilePicker
 *   name="customImages"
 *   accept="image/*"
 *   render={({
 *     dropzoneRef,
 *     dragging,
 *     loading,
 *     field: { value: files, onChange },
 *     openFilePicker,
 *   }) => {
 *     const handleRemove = (preview: string) => {
 *       onChange(files.filter((f) => f.preview !== preview));
 *     };
 *
 *     return (
 *       <div className="flex flex-col gap-3">
 *         <div
 *           ref={dropzoneRef}
 *           onClick={() => openFilePicker()}
 *           className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
 *             dragging ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
 *           }`}
 *         >
 *           <div className="flex items-center gap-3 text-sm text-gray-500">
 *             <UploadIcon className="h-5 w-5" />
 *             <span>{dragging ? 'Drop images here' : 'Click to upload or drag and drop'}</span>
 *           </div>
 *           {loading && (
 *             <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/50">
 *               <Spinner className="h-5 w-5" />
 *             </div>
 *           )}
 *         </div>
 *
 *         {!!files?.length && (
 *           <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
 *             {files.map((file) => (
 *               <div key={file.preview} className="group relative aspect-square">
 *                 <img
 *                   src={file.preview}
 *                   alt={file.name}
 *                   className="h-full w-full rounded-lg border object-cover"
 *                 />
 *                 <button
 *                   type="button"
 *                   onClick={() => handleRemove(file.preview)}
 *                   className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm hover:bg-red-600 group-hover:opacity-100"
 *                 >
 *                   <XIcon className="h-3 w-3" />
 *                 </button>
 *               </div>
 *             ))}
 *           </div>
 *         )}
 *       </div>
 *     );
 *   }}
 * />
 * ```
 *
 * */
function RHFFilePicker<T extends HTMLElement = HTMLDivElement>(props: RHFFilePickerProps<T>) {
  const { name, control, rules, ...rest } = props;

  return (
    <RHFController
      control={control}
      name={name}
      rules={rules}
      render={(renderProps) => {
        return <RHFFilePickerRenderer<T> {...rest} {...renderProps} />;
      }}
    />
  );
}

function RHFFilePickerRenderer<T extends HTMLElement = HTMLDivElement>({
  accept,
  removeDuplicates,
  onChange,
  onError,
  render,
  keepOldFiles,
  transform,
  field,
  fieldState,
  formState
}: RHFFilePickerRendererProps<T>) {
  const filePicker = useFilePicker<T>({
    files: field.value,
    setFiles: field.onChange,
    accept,
    removeDuplicates,
    keepOldFiles,
    transform,
    onChange: async (files, newFiles) => {
      field.onChange(files);

      await onChange?.(files, newFiles);
    },
    onError
  });

  const { dropzoneRef, openFilePicker, loading, dragging } = filePicker;

  if (render && typeof render === "function") {
    return render({ ...filePicker, field, fieldState, formState });
  }

  const { value } = field;
  const { error } = fieldState;

  const handleRemoveFile = (fileToRemove: FilePickerFile) => {
    const updatedFiles = value.filter((file) => file.preview !== fileToRemove.preview);
    field.onChange(updatedFiles);
  };

  return (
    <div
      className="GeckoUIRHFFilePicker"
      data-loading={loading || undefined}
      data-dragging={dragging || undefined}
      data-error={error ? "" : undefined}>
      <div
        className="GeckoUIRHFFilePicker__upload-area"
        ref={dropzoneRef as unknown as React.RefObject<HTMLDivElement>}>
        <Upload className="GeckoUIRHFFilePicker__upload-icon" />

        <p className="GeckoUIRHFFilePicker__upload-text">Drag and drop files here, or browse</p>

        <div className="GeckoUIRHFFilePicker__upload-buttons">
          <button
            className="GeckoUIRHFFilePicker__browse-button"
            onClick={() => openFilePicker()}
            type="button">
            Browse Files
          </button>

          <button
            className="GeckoUIRHFFilePicker__browse-button"
            onClick={() => openFilePicker({ directory: true })}
            type="button">
            Browse Folder
          </button>
        </div>

        {loading ? (
          <div className="GeckoUIRHFFilePicker__loading-overlay">
            <Spinner />
          </div>
        ) : null}
      </div>

      {Boolean(value?.length) && (
        <div className="GeckoUIRHFFilePicker__file-list">
          {value.map((file) => (
            <div className="GeckoUIRHFFilePicker__file-row" key={file.preview}>
              <span className="GeckoUIRHFFilePicker__file-name">{file.name}</span>
              <span className="GeckoUIRHFFilePicker__file-size">{formatFileSize(file.size)}</span>
              <button
                className="GeckoUIRHFFilePicker__file-remove"
                onClick={() => handleRemoveFile(file)}
                type="button">
                <X className="GeckoUIRHFFilePicker__file-remove-icon" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

RHFFilePicker.displayName = "RHFFilePicker";

export default RHFFilePicker;
