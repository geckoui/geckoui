import { useCallback, useEffect, useRef, useState } from "react";

import { FilePicker } from "../lib";
import type {
  FilePickerFile,
  OpenFilePickerFn,
  UseFilePickerOptions,
  UseFilePickerReturn
} from "../types";
import useRevokedPreviews from "./useRevokedPreviews";

/**
 * A hook for handling file selection with drag-and-drop, file picker, and directory selection support.
 *
 * Selected files are enhanced with:
 * - `preview`: Object URL for displaying file content
 * - `path`: File system path (from directory picker)
 * - `editableName`: Mutable name property
 *
 * @example
 * ```tsx
 * const ImageUploader = () => {
 *   const [files, setFiles] = useState<FilePickerFile[]>([]);
 *   const { dropzoneRef, dragging, loading, openFilePicker } = useFilePicker({
 *     accept: "image/*",
 *     files,
 *     setFiles,
 *     keepOldFiles: true,
 *     onChange: (allFiles, newFiles) => console.log('Added:', newFiles.length),
 *   });
 *
 *   const handleRemove = (preview: string) => {
 *     setFiles(files.filter((f) => f.preview !== preview));
 *   };
 *
 *   return (
 *     <div className="flex flex-col gap-3">
 *       <div
 *         ref={dropzoneRef}
 *         onClick={() => openFilePicker()}
 *         className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 ${
 *           dragging ? 'border-primary-400 bg-primary-50' : 'border-gray-300'
 *         }`}
 *       >
 *         <span>{dragging ? 'Drop images here' : 'Click to upload or drag and drop'}</span>
 *         {loading && <Spinner />}
 *       </div>
 *
 *       {!!files.length && (
 *         <div className="grid grid-cols-4 gap-2">
 *           {files.map((file) => (
 *             <div key={file.preview} className="group relative aspect-square">
 *               <img src={file.preview} className="h-full w-full rounded-lg object-cover" />
 *               <button
 *                 onClick={() => handleRemove(file.preview)}
 *                 className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100"
 *               >
 *                 ✕
 *               </button>
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 * */
function useFilePicker<T extends HTMLElement>(
  options?: UseFilePickerOptions
): UseFilePickerReturn<T> {
  const {
    accept = "*",
    removeDuplicates = false,
    onChange,
    keepOldFiles,
    onStart,
    onError,
    transform,
    files = [],
    setFiles,
    disabled = false,
    multiple = true
  } = options || {};

  const dropzoneRef = useRef<T>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  useRevokedPreviews(files.map((file) => file.preview));

  const handleOnChange = useCallback(
    async (res: FilePickerFile[]) => {
      const transformedRes = transform ? await transform(res) : res;

      const _result = keepOldFiles ? [...files].concat(transformedRes) : transformedRes;

      if (setFiles) setFiles(_result);

      await onChange?.(_result, transformedRes);
    },
    [transform, keepOldFiles, files, onChange, setFiles]
  );

  const openFilePicker: OpenFilePickerFn = async (options) => {
    if (loading || disabled) return;

    try {
      const handler = new FilePicker(accept, removeDuplicates, {
        multiple,
        oldFiles: files
      });
      const res = await handler.open({
        ...options,
        onChangeStart: () => {
          onStart?.();
          setLoading(() => true);
        }
      });

      await handleOnChange(res);

      return res;
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(() => false);
    }
  };

  useEffect(() => {
    const el = dropzoneRef.current;

    if (!el || disabled) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(() => true);
    };

    const handleDragEnter = () => {
      setDragging(() => true);
    };

    const handleDragLeave = () => {
      setDragging(() => false);
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!e.dataTransfer?.items.length || loading) return;

      try {
        setDragging(() => false);
        setLoading(() => true);

        onStart?.();

        const handler = new FilePicker(accept, removeDuplicates, {
          multiple,
          oldFiles: files
        });

        const res = await handler.onDrop(e.dataTransfer.items);
        await handleOnChange(res);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setLoading(() => false);
      }
    };

    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragenter", handleDragEnter);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragenter", handleDragEnter);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, [
    accept,
    disabled,
    files,
    handleOnChange,
    loading,
    multiple,
    onError,
    onStart,
    removeDuplicates
  ]);

  return {
    dropzoneRef,
    files,
    dragging,
    openFilePicker,
    loading
  };
}

export default useFilePicker;
