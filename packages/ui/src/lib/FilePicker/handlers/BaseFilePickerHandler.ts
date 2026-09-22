import type { FileRejection } from "../../../components/FileInput";
import type { FilePickerFile, OpenFilePickerOptions } from "../../../types";
import { isTwoFileEqualByFileContent } from "../../../utils";

class BaseFilePickerHandler {
  accept: string;
  removeDuplicates: boolean;
  multiple: boolean;
  preview: boolean;
  /** How many more files may be taken on this run, not the field's own `max`. */
  room?: number;
  oldFiles: FilePickerFile[];

  /** Everything turned away on this run, and why, for the caller to report. */
  rejected: FileRejection[] = [];

  constructor(
    accept = "*",
    removeDuplicates = false,
    opts?: {
      oldFiles?: FilePickerFile[];
      multiple?: boolean;
      preview?: boolean;
      room?: number;
    }
  ) {
    this.accept = accept;
    this.removeDuplicates = removeDuplicates;
    this.multiple = opts?.multiple ?? true;
    this.preview = opts?.preview ?? false;
    this.room = opts?.room;
    this.oldFiles = opts?.oldFiles || [];

    this.open = this.open.bind(this);
  }

  private turnAway(file: File, reason: FileRejection["reason"]) {
    this.rejected.push({ file, reason });
  }

  onDrop(_: DataTransferItemList | undefined): Promise<FilePickerFile[]> {
    throw new Error("Method not implemented.");
  }

  async open(options?: OpenFilePickerOptions): Promise<FilePickerFile[]> {
    const { multiple = this.multiple, directory = false, onChangeStart } = options || {};

    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.accept = this.accept;
      input.type = "file";
      input.multiple = multiple;
      input.webkitdirectory = directory;

      input.addEventListener("change", async () => {
        onChangeStart?.();

        const files = Array.from(input.files ?? []) as FilePickerFile[];
        const data: FilePickerFile[] = [];

        for await (const file of files) {
          await this.addFileIfValid(file, data);
        }

        resolve(data);
      });

      input.addEventListener("cancel", () => {
        resolve([]);
      });

      if ("showPicker" in HTMLInputElement.prototype) {
        input.showPicker();
      } else {
        input.click();
      }
    });
  }

  protected async addFileIfValid(
    file: FilePickerFile,
    data: FilePickerFile[] = []
  ): Promise<FilePickerFile[]> {
    /*
     * Every path in, browsed or dropped, comes through here, so one file means one file
     * whichever way it arrived. The browse dialog also enforces it, but a drop cannot.
     */
    if (!this.multiple && data.length >= 1) {
      this.turnAway(file, "max");

      return data;
    }

    if (this.room !== undefined && data.length >= this.room) {
      this.turnAway(file, "max");

      return data;
    }

    let newFile = file;
    const key = newFile.size;

    if (this.removeDuplicates) {
      const possibleDuplicatedFiles = data.concat(this.oldFiles).filter((f) => f.size === key);

      if (possibleDuplicatedFiles) {
        for (const possibleDuplicatedFile of possibleDuplicatedFiles) {
          const isEqual = await isTwoFileEqualByFileContent(newFile, possibleDuplicatedFile);

          if (isEqual) {
            this.turnAway(file, "duplicate");

            return data;
          }
        }
      }
    }

    const type = await (async () => {
      if (newFile.type) return newFile.type;

      const { default: mime } = await import("mime");
      return mime.getType(newFile.name) || "";
    })();
    const path = newFile.webkitRelativePath || "";

    //
    // In firefox when dropping files from nested folders, the file type is empty
    //
    if (newFile.type === "" && type !== "") {
      newFile = new File([newFile], newFile.name, {
        type,
        lastModified: newFile.lastModified
      }) as unknown as FilePickerFile;
    }

    newFile.editableName = newFile.name;
    newFile.path ||= path;

    if (this.accept !== "*") {
      const acceptTypes = this.accept.split(",").map((t) => t.trim());
      const valid = acceptTypes.some((acceptType) => {
        if (acceptType.startsWith(".")) {
          return newFile.name.toLowerCase().endsWith(acceptType.toLowerCase());
        }
        if (acceptType.endsWith("/*")) {
          const baseType = acceptType.slice(0, -2);
          return newFile.type.startsWith(baseType + "/");
        }
        return newFile.type === acceptType;
      });

      if (!valid) {
        this.turnAway(newFile, "type");

        return data;
      }
    }

    // Only on request: an object URL pins the file's bytes until it is revoked
    if (this.preview) newFile.preview = URL.createObjectURL(newFile);

    data.push(newFile);

    return data;
  }
}

export default BaseFilePickerHandler;
