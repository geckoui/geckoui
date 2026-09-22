"use client";

import { FileInput, Label, type PickedFile } from "@geckoui/geckoui";
import { useState } from "react";

function Held({ files }: { files: PickedFile | PickedFile[] | null }) {
  const all = Array.isArray(files) ? files : files ? [files] : [];

  return (
    <p className="font-mono text-xs" style={{ color: "var(--color-text-tertiary)" }}>
      {all.length ? all.map((file) => file.name).join(", ") : "nothing picked"}
    </p>
  );
}

export function FileInputBasicExample() {
  const [file, setFile] = useState<PickedFile | null>(null);

  return (
    <div className="max-w-sm space-y-2">
      <FileInput value={file} onChange={setFile} />
      <Held files={file} />
    </div>
  );
}

export function FileInputMultipleExample() {
  const [files, setFiles] = useState<PickedFile[]>([]);

  return (
    <div className="max-w-sm space-y-2">
      <FileInput multiple value={files} onChange={setFiles} />
      <Held files={files} />
    </div>
  );
}

export function FileInputAppendExample() {
  const [files, setFiles] = useState<PickedFile[]>([]);

  return (
    <div className="max-w-sm space-y-2">
      <FileInput multiple append unique value={files} onChange={setFiles} />
      <Held files={files} />
    </div>
  );
}

export function FileInputRejectExample() {
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [why, setWhy] = useState<string[]>([]);

  return (
    <div className="max-w-sm space-y-2">
      <FileInput
        multiple
        append
        unique
        max={3}
        accept="image/*"
        value={files}
        onChange={setFiles}
        onReject={(rejected) => setWhy(rejected.map((r) => `${r.file.name} — ${r.reason}`))}
      />
      <Held files={files} />

      {!!why.length && (
        <ul className="text-xs" style={{ color: "var(--color-error)" }}>
          {why.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FileInputStatesExample() {
  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <div className="space-y-1">
        <Label>Placeholder</Label>
        <FileInput placeholder="Attach your CV" />
      </div>
      <div className="space-y-1">
        <Label>In error</Label>
        <FileInput hasError />
      </div>
      <div className="space-y-1">
        <Label>Disabled</Label>
        <FileInput disabled />
      </div>
      <div className="space-y-1">
        <Label>No clear button</Label>
        <FileInput hideClearIcon />
      </div>
    </div>
  );
}

export function FileInputRenderExample() {
  const [files, setFiles] = useState<PickedFile[]>([]);

  return (
    <FileInput
      multiple
      preview
      accept="image/*"
      value={files}
      onChange={setFiles}
      render={({ files: held, dragging, remove }) => (
        <div
          className="w-full rounded-lg border-2 border-dashed p-4"
          style={{
            borderColor: dragging ? "var(--color-primary-400)" : "var(--color-border-secondary)"
          }}>
          <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
            {dragging ? "Drop them here" : `${held.length} picked — click or drop`}
          </p>

          {!!held.length && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {held.map((file) => (
                <div className="relative aspect-square" key={file.name}>
                  <img
                    alt={file.name}
                    className="h-full w-full rounded border object-cover"
                    src={(file as { preview?: string }).preview}
                  />
                  <button
                    className="absolute top-1 right-1 rounded px-1 text-xs text-white"
                    onClick={(event) => {
                      event.stopPropagation();
                      remove(file);
                    }}
                    style={{ background: "rgb(0 0 0 / 0.6)" }}
                    type="button">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
}
