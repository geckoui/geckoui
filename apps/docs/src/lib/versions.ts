export interface DocsVersion {
  /** Stable id, also used as the dropdown key */
  id: string;
  /** Shown in the switcher */
  label: string;
  /** Route prefix this version is served from */
  basePath: string;
  /** Exactly one version should be the latest */
  latest?: boolean;
}

/** Add a new version here and the switcher, notices and links follow. */
export const VERSIONS: DocsVersion[] = [
  { id: "v2", label: "v2", basePath: "/docs", latest: true },
  { id: "v1", label: "v1", basePath: "/v1/docs" }
];

export const LATEST = VERSIONS.find((v) => v.latest) ?? VERSIONS[0];

/** Longest matching basePath wins, so /v1/docs never resolves to /docs. */
export function versionFromPathname(pathname: string): DocsVersion {
  const match = [...VERSIONS]
    .sort((a, b) => b.basePath.length - a.basePath.length)
    .find((v) => pathname === v.basePath || pathname.startsWith(`${v.basePath}/`));

  return match ?? LATEST;
}

export function slugFromPathname(pathname: string): string {
  const version = versionFromPathname(pathname);
  return pathname.slice(version.basePath.length).replace(/^\//, "");
}

/**
 * Where the switcher should send you. Keeps you on the same page when that page
 * exists in the target version, otherwise falls back to that version's home.
 */
export function hrefForVersion(version: DocsVersion, slug: string, availableSlugs?: string[]) {
  if (slug && availableSlugs?.includes(slug)) return `${version.basePath}/${slug}`;
  return version.basePath;
}
