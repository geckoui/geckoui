// Declared locally rather than pulling in @types/node for a browser library
declare const process: { env?: { NODE_ENV?: string } };

/**
 * Read NODE_ENV without assuming `process` exists.
 *
 * Bundlers replace `process.env.NODE_ENV` at build time, so in a normal app this is a
 * string literal by the time it runs. Somewhere that does not replace it — raw browser
 * ESM, say — the bare identifier would throw `ReferenceError: process is not defined`,
 * so the read is wrapped. Unknown counts as development, which is the safe way round:
 * a warning nobody sees beats a crash.
 */
function readNodeEnv(): string | undefined {
  try {
    return process.env?.NODE_ENV;
  } catch {
    return undefined;
  }
}

const isProduction = readNodeEnv() === "production";

/**
 * Warn about a mistake only a developer can fix. Silent in production builds.
 *
 * tsup is told not to replace `process.env.NODE_ENV` while building this library, or the
 * value would be fixed at publish time — see the `define` in tsup.config.ts.
 */
export function devWarn(message: string): void {
  if (isProduction) return;

  console.warn(`[GeckoUI] ${message}`);
}
