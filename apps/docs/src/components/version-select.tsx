import { VersionSwitch } from "@/components/version-switch";
import { source, sourceV1 } from "@/lib/source";
import { VERSIONS } from "@/lib/versions";

const sourcesById: Record<string, typeof source | typeof sourceV1> = {
  v2: source,
  v1: sourceV1
};

/** slug -> versions containing it, so switching keeps you on the same page */
function slugsByVersion(): Record<string, string[]> {
  return Object.fromEntries(
    VERSIONS.map((v) => [v.id, (sourcesById[v.id]?.getPages() ?? []).map((p) => p.slugs.join("/"))])
  );
}

export function VersionSelect() {
  return <VersionSwitch slugsByVersion={slugsByVersion()} />;
}
