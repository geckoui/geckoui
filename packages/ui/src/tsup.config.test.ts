import { describe, expect, it } from "vitest";

import pkg from "../package.json";
// Read as text rather than imported: the config pulls in the Tailwind plugin, which will
// not load under vitest, and the list is a literal anyway.
import configSource from "../tsup.config.ts?raw";

/**
 * The external list is belt and braces over what tsup already infers, so it only helps
 * while it says the same thing as package.json. Left to drift it would either bundle a
 * dependency or name one the library no longer has.
 */
describe("tsup externals", () => {
  it("names exactly the dependencies and peer dependencies", () => {
    const block = configSource.slice(
      configSource.indexOf("const external"),
      configSource.indexOf("];")
    );

    const listed = [...block.matchAll(/"([^"]+)"/g)].map(([, name]) => name);

    const declared = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {})
    ];

    expect(listed.sort()).toEqual(declared.sort());
  });
});
