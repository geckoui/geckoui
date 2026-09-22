import { describe, expect, it } from "vitest";

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

describe("FilePicker multiple", () => {
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
