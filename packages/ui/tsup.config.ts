import tailwindcss from "@tailwindcss/postcss";
import { sassPlugin } from "esbuild-sass-plugin";
import { resolve } from "path";
import postcss from "postcss";
import { defineConfig } from "tsup";

// tsup already treats dependencies and peerDependencies as external, so this list is
// belt and braces. Keep it in step with package.json rather than letting it collect
// packages the library no longer uses.
const external = [
  "react",
  "react-dom",
  "react-hook-form",
  "@floating-ui/react",
  "lodash.isequal",
  "mime",
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
    // Keep `process.env.NODE_ENV` in the output. With platform "browser" esbuild would
    // otherwise replace it while building the library, baking in "development" and
    // leaving every consumer's production build with the dev warnings switched on.
    // Defining it to itself opts out, so the consumer's bundler resolves it instead.
    define: { "process.env.NODE_ENV": "process.env.NODE_ENV" },
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
