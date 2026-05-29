import Link from "next/link";
import type { ReactNode } from "react";
import { SearchClient } from "@/components/search/search-client";
import { getWikiStats } from "@/lib/content";

const navItems = [
  { href: "/", label: "Index" },
  { href: "/timeline", label: "Timeline" },
  { href: "/thinkers", label: "Thinkers" },
  { href: "/schools", label: "Schools" },
  { href: "/works", label: "Works" },
];

export function WikiFrame({ children }: { children: ReactNode }) {
  const stats = getWikiStats();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="wiki-shell-header" data-pagefind-ignore>
        <div className="wiki-topbar">
          <Link href="/" className="wiki-brand">
            <div className="wiki-brand-title">
              PhiloDocs
            </div>
            <div className="wiki-brand-subtitle">
              Open-source history of thought
            </div>
          </Link>
          <SearchClient
            limit={7}
            placeholder="Search thinkers, schools, works..."
            variant="nav"
          />
          <nav className="wiki-topnav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="wiki-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="wiki-layout">
        <aside
          className="wiki-rail wiki-rail-left"
          data-pagefind-ignore
        >
          <div className="sticky top-6 space-y-6">
            <section>
              <h2 className="wiki-sidebar-title">Sections</h2>
              <div className="mt-3 grid gap-2">
                {navItems.slice(1, 5).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="wiki-sidebar-link"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </aside>

        <main>{children}</main>

        <aside
          className="wiki-rail wiki-rail-right"
          data-pagefind-ignore
        >
          <div className="sticky top-6 space-y-6">
            <section>
              <h2 className="wiki-sidebar-title">Corpus</h2>
              <dl className="mt-3 grid gap-2">
                <Stat label="Thinkers" value={stats.thinkers} />
                <Stat label="Schools" value={stats.schools} />
                <Stat label="Works" value={stats.works} />
                <Stat label="Timeline rows" value={stats.timelineRows} />
              </dl>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line-soft)] pb-2">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="font-mono text-xs text-[var(--ink)]">{value}</dd>
    </div>
  );
}
