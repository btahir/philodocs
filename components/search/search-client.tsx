"use client";

import { useEffect, useId, useRef, useState } from "react";

type PagefindResultData = {
  url: string;
  meta: {
    title?: string;
  };
  excerpt?: string;
};

type PagefindResult = {
  id: string;
  data: () => Promise<PagefindResultData>;
};

type Pagefind = {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
};

type SearchClientProps = {
  className?: string;
  limit?: number;
  placeholder?: string;
  variant?: "page" | "nav";
};

let pagefindLoad: Promise<Pagefind> | null = null;

function loadPagefind() {
  pagefindLoad ??= (
    new Function("path", "return import(path)") as (
      path: string,
    ) => Promise<Pagefind>
  )("/pagefind/pagefind.js");

  return pagefindLoad;
}

function normalizeResultUrl(url: string) {
  try {
    const parsed = new URL(url, window.location.origin);

    if (parsed.origin !== window.location.origin) {
      return url;
    }

    if (parsed.pathname.endsWith("/index.html")) {
      parsed.pathname = parsed.pathname.slice(0, -"/index.html".length) || "/";
    } else if (parsed.pathname.endsWith(".html")) {
      parsed.pathname = parsed.pathname.slice(0, -5);
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return url.replace(/\/index\.html($|[?#])/, "/$1").replace(/\.html($|[?#])/, "$1");
  }
}

export function SearchClient({
  className = "",
  limit = 8,
  placeholder = "Search the wiki",
  variant = "page",
}: SearchClientProps) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [status, setStatus] = useState("Type to search");
  const [isOpen, setIsOpen] = useState(false);
  const requestId = useRef(0);
  const isNav = variant === "nav";

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      return undefined;
    }

    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;

    const timeout = window.setTimeout(async () => {
      setStatus("Searching...");
      try {
        const pagefind = await loadPagefind();
        const search = await pagefind.search(trimmed);
        const nextResults = await Promise.all(
          search.results.slice(0, limit).map((result) => result.data()),
        );

        if (requestId.current !== currentRequest) return;

        setResults(nextResults);
        setStatus(
          nextResults.length > 0
            ? `${nextResults.length} result${nextResults.length === 1 ? "" : "s"}`
            : "No results",
        );
        setIsOpen(true);
      } catch {
        if (requestId.current !== currentRequest) return;
        setResults([]);
        setStatus("Search index unavailable.");
        setIsOpen(true);
      }
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [limit, query]);

  return (
    <div
      className={[
        "wiki-search",
        isNav ? "wiki-search-nav" : "wiki-search-page",
        className,
      ].join(" ")}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      onFocus={() => setIsOpen(true)}
      data-pagefind-ignore={isNav ? true : undefined}
    >
      <label className="sr-only" htmlFor={listId}>
        Search PhiloDocs
      </label>
      <div className="wiki-search-field">
        <svg
          aria-hidden="true"
          className="wiki-search-icon"
          fill="none"
          height="18"
          viewBox="0 0 24 24"
          width="18"
        >
          <path
            d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
        <input
          aria-autocomplete="list"
          aria-controls={`${listId}-results`}
          aria-expanded={isOpen}
          autoComplete="off"
          id={listId}
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setIsOpen(true);
            if (!nextQuery.trim()) {
              requestId.current += 1;
              setResults([]);
              setStatus("Type to search");
            } else {
              setStatus("Waiting...");
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
          placeholder={placeholder}
          role="combobox"
          type="search"
        />
      </div>

      <div
        className={[
          "wiki-search-results",
          isOpen && query.trim() ? "wiki-search-results-open" : "",
        ].join(" ")}
        id={`${listId}-results`}
        role="listbox"
      >
        <div className="wiki-search-status">{status}</div>

        {results.length > 0
          ? results.map((result) => (
            <a
              key={result.url}
              aria-selected="false"
              className="wiki-search-result"
              href={normalizeResultUrl(result.url)}
              role="option"
            >
              <span className="wiki-search-result-title">
                {result.meta.title ?? result.url}
              </span>
              {result.excerpt ? (
                <span
                  className="wiki-search-result-excerpt"
                  dangerouslySetInnerHTML={{ __html: result.excerpt }}
                />
              ) : null}
            </a>
          ))
          : null}
      </div>
    </div>
  );
}
