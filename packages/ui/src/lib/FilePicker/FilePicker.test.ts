import { describe, expect, it, vi } from "vitest";

import FilePicker from ".";
import type { FilePickerFile } from "../../types";

const asFile = (name: string, size: number) =>
  Object.assign(new File(["x".repeat(size)], name, { type: "image/png" }), {
    preview: "",
    path: ""
  }) as FilePickerFile;

/** The list a drop would hand over, run through the handler's own funnel. */
const dropped = async (handler: InstanceType<typeof FilePicker>, files: FilePickerFile[]) => {
  const data: FilePickerFile[] = [];

  for (const file of files) {
    // the protected funnel every drop path goes through
    await (
      handler as unknown as {
        addFileIfValid: (f: FilePickerFile, d: FilePickerFile[]) => Promise<FilePickerFile[]>;
      }
    ).addFileIfValid(file, data);
  }

  return data;
};

describe("FilePicker", () => {
  const three = () => [asFile("a.png", 1), asFile("b.png", 2), asFile("c.png", 3)];

  it("takes every file when multiple is on", async () => {
    const handler = new FilePicker("*", false, { multiple: true });

    expect(await dropped(handler, three())).toHaveLength(3);
  });

  it("is on by default", async () => {
    const handler = new FilePicker("*", false);

    expect(await dropped(handler, three())).toHaveLength(3);
  });

  it("keeps only the first when multiple is off", async () => {
    const handler = new FilePicker("*", false, { multiple: false });
    const data = await dropped(handler, three());

    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("a.png");
  });

  it("still turns away a file the accept rule rejects", async () => {
    const handler = new FilePicker("image/*", false, { multiple: false });
    const wrong = Object.assign(new File(["x"], "n.txt", { type: "text/plain" }), {
      preview: "",
      path: ""
    }) as FilePickerFile;

    expect(await dropped(handler, [wrong, asFile("a.png", 1)])).toHaveLength(1);
  });
});

describe("FilePicker rejections", () => {
  const png = (name: string, size = 8) =>
    Object.assign(new File(["x".repeat(size)], name, { type: "image/png" }), {
      preview: "",
      path: ""
    }) as FilePickerFile;

  const txt = (name: string) =>
    Object.assign(new File(["hello"], name, { type: "text/plain" }), {
      preview: "",
      path: ""
    }) as FilePickerFile;

  it("reports a file that did not match accept", async () => {
    const handler = new FilePicker("image/*");

    await dropped(handler, [txt("notes.txt"), png("a.png")]);

    expect(handler.rejected).toEqual([expect.objectContaining({ reason: "type" })]);
  });

  it("reports a duplicate", async () => {
    const same = png("a.png");
    const handler = new FilePicker("*", true);

    await dropped(handler, [same, same]);

    expect(handler.rejected).toEqual([expect.objectContaining({ reason: "duplicate" })]);
  });

  it("reports the ones past the room it was given", async () => {
    const handler = new FilePicker("*", false, { room: 2 });
    const data = await dropped(handler, [png("a.png"), png("b.png"), png("c.png")]);

    expect(data).toHaveLength(2);
    expect(handler.rejected).toEqual([expect.objectContaining({ reason: "max" })]);
  });

  it("reports the second file dropped on a single field as having no room", async () => {
    const handler = new FilePicker("*", false, { multiple: false });

    await dropped(handler, [png("a.png"), png("b.png")]);

    expect(handler.rejected).toEqual([expect.objectContaining({ reason: "max" })]);
  });

  it("says nothing when everything was taken", async () => {
    const handler = new FilePicker("*");

    await dropped(handler, [png("a.png"), png("b.png")]);

    expect(handler.rejected).toEqual([]);
  });
});

describe("FilePicker preview", () => {
  const png = (name: string) =>
    Object.assign(new File(["x"], name, { type: "image/png" }), {
      preview: "",
      path: ""
    }) as FilePickerFile;

  it("makes no object URL unless it was asked to", async () => {
    const create = vi.fn(() => "blob:made");

    vi.stubGlobal("URL", { ...URL, createObjectURL: create });

    const handler = new FilePicker("*");
    await dropped(handler, [png("a.png")]);

    expect(create).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("makes one per file when preview is set", async () => {
    const create = vi.fn(() => "blob:made");

    vi.stubGlobal("URL", { ...URL, createObjectURL: create });

    const handler = new FilePicker("*", false, { preview: true });
    const data = await dropped(handler, [png("a.png"), png("b.png")]);

    expect(create).toHaveBeenCalledTimes(2);
    expect(data[0].preview).toBe("blob:made");

    vi.unstubAllGlobals();
  });
});
