/** Vite's `?raw` imports, which the tsup externals test uses to read the config as text. */
declare module "*?raw" {
  const content: string;

  export default content;
}
