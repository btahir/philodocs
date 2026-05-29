import type { Metadata } from "next";
import { EntryList } from "@/components/wiki/entry-list";
import { schools } from "@/lib/content";

export const metadata: Metadata = {
  title: "Schools",
};

export default function SchoolsPage() {
  return (
    <>
      <header className="wiki-index-header">
        <p className="wiki-kicker">Schools</p>
        <h1 className="wiki-index-title">Schools and movements</h1>
        <p className="wiki-index-copy">
          Cluster pages for traditions, movements, and intellectual lineages.
        </p>
      </header>
      <EntryList entries={schools} />
    </>
  );
}
