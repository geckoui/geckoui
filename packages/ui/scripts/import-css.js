const fs = require("fs");
const glob = require("glob");
const path = require("path");

const srcDir = path.join(__dirname, "../src");

const cssImports = glob
  .sync(path.join(srcDir, "**/*.scss"))
  .filter(
    (f) =>
      !f.endsWith("styles.scss") &&
      !f.endsWith("imports.scss") &&
      !f.endsWith("mixins.scss") &&
      fs.lstatSync(f).isFile()
  )
  .map((f) => {
    const relativePath = path.relative(srcDir, f).replace(/\\/g, "/"); // Replace backslashes on Windows
    return `@import "./${relativePath}";`;
  });

const baseComponents = cssImports
  .filter((f) => !f.includes("/RHF/"))
  .sort((a, b) => a.length - b.length);

const rhfComponents = cssImports
  .filter((f) => f.includes("/RHF/"))
  .sort((a, b) => a.length - b.length);

const sortedImports = [...baseComponents, ...rhfComponents].join("\n") + "\n";

fs.writeFileSync(path.join(srcDir, "imports.scss"), sortedImports);

console.log("CSS imports updated");
