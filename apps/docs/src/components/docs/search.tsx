"use client";

import { classNames } from "@/lib/classNames";
import { type DocsVersion, LATEST } from "@/lib/versions";
import { Dialog } from "@geckoui/geckoui";
import { create } from "@orama/orama";
import type { SortedResult } from "fumadocs-core/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import { CornerDownLeft, FileText, Hash, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function initOrama() {
  return create({ schema: { _: "string" }, language: "english" });
}

function searchEndpoint(version: DocsVersion) {
  return version.id === LATEST.id ? "/api/search" : `/api/search-${version.id}`;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-sans text-[11px] text-muted-foreground">
      {children}
    </kbd>
  );
}

/** Orama ranks by body text; put pages whose title matches the query first, keeping each page's headings with it. */
function rankByTitle(results: SortedResult[], search: string) {
  const query = search.trim().toLowerCase();
  const groups: SortedResult[][] = [];

  for (const r of results) {
    if (r.type === "page" || groups.length === 0) groups.push([r]);
    else groups[groups.length - 1].push(r);
  }

  const score = (group: SortedResult[]) => {
    const title = group[0].type === "page" ? group[0].content.toLowerCase() : "";
    if (title === query) return 0;
    if (title.startsWith(query)) return 1;
    if (title.includes(query)) return 2;
    return 3;
  };

  return groups
    .map((group, index) => ({ group, index, score: score(group) }))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .flatMap(({ group }) => group);
}

function Results({ version, onPick }: { version: DocsVersion; onPick: (url: string) => void }) {
  const { search, setSearch, query } = useDocsSearch({
    type: "static",
    from: searchEndpoint(version),
    initOrama
  });
  const [active, setActive] = useState(0);
  const results = useMemo(
    () => (query.data && query.data !== "empty" ? rankByTitle(query.data, search) : []),
    [query.data, search]
  );

  useEffect(() => setActive(0), [search]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      onPick(results[active].url);
    }
  };

  return (
    <div className="flex max-h-[min(32rem,70vh)] flex-col">
      <label className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Search the ${version.label} docs...`}
          className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <ul className="gk-scroll flex-1 overflow-y-auto p-1.5" role="listbox">
        {!search && (
          <li className="px-3 py-8 text-center text-sm text-muted-foreground">
            Type a component or topic.
          </li>
        )}
        {search && query.data === "empty" && (
          <li className="px-3 py-8 text-center text-sm text-muted-foreground">
            No results for &quot;{search}&quot;.
          </li>
        )}
        {results.map((r, i) => (
          <li key={r.id} role="option" aria-selected={i === active}>
            <button
              type="button"
              onMouseMove={() => setActive(i)}
              onClick={() => onPick(r.url)}
              className={classNames(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                i === active && "bg-accent",
                r.type === "page" ? "font-medium" : "pl-7 text-muted-foreground"
              )}>
              {r.type === "page" ? (
                <FileText className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <Hash className="size-3.5 shrink-0" />
              )}
              <span className="truncate">{r.content}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex shrink-0 items-center gap-4 border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          to move
        </span>
        <span className="flex items-center gap-1">
          <Kbd>
            <CornerDownLeft className="size-3" />
          </Kbd>
          to open
        </span>
        <span className="flex items-center gap-1">
          <Kbd>esc</Kbd>
          to close
        </span>
      </div>
    </div>
  );
}

export function SearchButton({ version }: { version: DocsVersion }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:w-56 lg:w-64">
        <SearchIcon className="size-4" />
        <span className="hidden flex-1 text-left md:block">Search documentation...</span>
        <span className="hidden md:block">
          <Kbd>⌘K</Kbd>
        </span>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        dismissOnEscape
        dismissOnOutsideClick
        className="w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-background p-0 text-foreground shadow-2xl">
        {open && <Results key={version.id} version={version} onPick={pick} />}
      </Dialog>
    </>
  );
}
