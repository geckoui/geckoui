"use client";
import { create } from "@orama/orama";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { usePathname } from "next/navigation";

import { LATEST, versionFromPathname, type DocsVersion } from "@/lib/versions";

function initOrama() {
  return create({
    schema: { _: "string" },
    // https://docs.orama.com/docs/orama-js/supported-languages
    language: "english"
  });
}

/** Each version has its own index, so searching from v1 docs returns v1 pages. */
function searchEndpoint(version: DocsVersion) {
  return version.id === LATEST.id ? "/api/search" : `/api/search-${version.id}`;
}

function VersionedSearchDialog({ version, ...props }: SharedProps & { version: DocsVersion }) {
  const { locale } = useI18n();

  const { search, setSearch, query } = useDocsSearch({
    type: "static",
    from: searchEndpoint(version),
    initOrama,
    locale
  });

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          {version.id !== LATEST.id && (
            <span className="shrink-0 rounded border border-fd-border px-1.5 py-0.5 text-[11px] font-medium text-fd-muted-foreground">
              {version.label}
            </span>
          )}
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}

export default function DefaultSearchDialog(props: SharedProps) {
  const version = versionFromPathname(usePathname());

  // keyed so the Orama index is rebuilt from scratch when the version changes
  return <VersionedSearchDialog key={version.id} version={version} {...props} />;
}
