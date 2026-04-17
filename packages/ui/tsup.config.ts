import tailwindcss from "@tailwindcss/postcss";
import { sassPlugin } from "esbuild-sass-plugin";
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
  "react-textarea-autosize",
  "prop-types",
  "tailwind-merge"
];

export default defineConfig((options) => {
  return {
    entry: ["src/index.ts", "src/styles.scss"],
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
          const fullSource = `@reference "tailwindcss";\n${source}`;
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
