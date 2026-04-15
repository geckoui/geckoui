import tailwindcss from "@tailwindcss/postcss";
import { sassPlugin } from "esbuild-sass-plugin";
import { readFileSync } from "fs";
import { globSync } from "glob";
import { resolve } from "path";
import postcss from "postcss";
import { defineConfig } from "tsup";

const external = [
  "react",
  "react-dom",
  "react-hook-form",
  "tailwind-merge",
  "mime",
  "class-variance-authority",
  "class-variance-authority/types",
  "@floating-ui/react",
  "sonner",
  "next-themes",
  "@headlessui/react",
  "react-textarea-autosize",
  "prop-types",
  "tailwind-merge"
];

const themeCSS = readFileSync(resolve("src/theme.css"), "utf8");
const themeVars = themeCSS.match(/@theme\s*\{([\s\S]*?)\}/)?.[1] || "";
const themeRoot = `:root {\n${themeVars}\n}`;

const watchFiles = ["./src/**/*.scss"].flatMap((pattern) => {
  return globSync(pattern, { ignore: "node_modules/**" });
});

export default defineConfig((options) => {
  return {
    entry: [
      "src/index.ts",
      ...(options.watch ? watchFiles.filter((f) => f !== "src/imports.scss") : ["src/styles.scss"])
    ],
    outDir: "dist",
    external,
    format: ["cjs", "esm"],
    dts: {
      entry: "src/index.ts",
      output: "dist/index.d.ts"
    },
    clean: !options.watch,
    platform: "browser",
    esbuildPlugins: [
      sassPlugin({
        sourceMap: false,
        async transform(source) {
          const fullSource = `@reference "tailwindcss";\n${themeCSS}\n${themeRoot}\n${source}`;
          const { css } = await postcss([tailwindcss()]).process(fullSource, {
            from: resolve("src/styles.scss")
          });

          return {
            loader: "css",
            contents: css
          };
        }
      })
    ]
  };
});
