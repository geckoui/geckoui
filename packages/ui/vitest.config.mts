import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    // Reuses one jsdom per worker instead of building a fresh one for all 52 files,
    // which was taking about 40% of the run. Each file still gets its own module
    // registry, which matters here: the overlay and toast stores are module
    // singletons, and `isolate: false` would let them leak between files.
    pool: "vmThreads"
  }
});
